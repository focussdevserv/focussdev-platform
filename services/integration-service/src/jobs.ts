import type pg from "pg";
import { retryDelayMs } from "./retry.js";

export interface JobRow {
  id: string;
  connector: string;
  attempt_count: number;
}

export async function reserveJob(pool: pg.Pool, leaseMs: number): Promise<JobRow | null> {
  const result = await pool.query<JobRow>(
    `with candidate as (
       select id from integration_jobs
        where (status in ('pending', 'retry') and next_attempt_at <= now())
           or (status = 'processing' and locked_at <= now() - ($1 * interval '1 millisecond'))
        order by priority desc, created_at
        for update skip locked limit 1
     )
     update integration_jobs j
        set status = 'processing', locked_at = now(), updated_at = now(),
            attempt_count = attempt_count + 1
       from candidate
      where j.id = candidate.id
    returning j.id, j.connector, j.attempt_count`,
    [leaseMs]
  );
  return result.rows[0] ?? null;
}

// The attempt number fences an expired worker out after another worker reclaims its job.
export async function deferUnimplemented(
  pool: pg.Pool,
  job: JobRow,
  maxAttempts: number
): Promise<boolean> {
  if (job.attempt_count < maxAttempts) {
    const result = await pool.query(
      `update integration_jobs
          set status = 'retry', next_attempt_at = now() + ($3 * interval '1 millisecond'),
              last_error_code = 'connector_not_implemented', locked_at = null, updated_at = now()
        where id = $1 and status = 'processing' and attempt_count = $2`,
      [job.id, job.attempt_count, retryDelayMs(job.attempt_count)]
    );
    return result.rowCount === 1;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    const finished = await client.query<{ inbox_id: string }>(
      `update integration_jobs
          set status = 'dead_letter', finished_at = now(), locked_at = null,
              last_error_code = 'connector_not_implemented', updated_at = now()
        where id = $1 and status = 'processing' and attempt_count = $2
      returning inbox_id`,
      [job.id, job.attempt_count]
    );

    const inboxId = finished.rows[0]?.inbox_id;
    if (!inboxId) {
      await client.query("commit");
      return false;
    }

    await client.query(
      `insert into integration_dead_letters (job_id, connector, reason, payload_snapshot)
       select j.id, j.connector, 'connector_not_implemented', w.payload
         from integration_jobs j
         join webhook_inbox w on w.id = j.inbox_id
        where j.id = $1
       on conflict (job_id) do nothing`,
      [job.id]
    );
    await client.query(
      "update webhook_inbox set status = 'failed', processed_at = now() where id = $1",
      [inboxId]
    );
    await client.query("commit");
    return true;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
