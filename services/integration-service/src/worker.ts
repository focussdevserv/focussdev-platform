import { loadConfig } from "./config.js";
import { createPool } from "./database.js";
import { retryDelayMs } from "./retry.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);

interface JobRow {
  id: string;
  connector: string;
  attempt_count: number;
}

async function reserveJob(): Promise<JobRow | null> {
  const result = await pool.query<JobRow>(
    `with candidate as (
       select id from integration_jobs
        where status in ('pending', 'retry') and next_attempt_at <= now()
        order by priority desc, created_at
        for update skip locked limit 1
     )
     update integration_jobs j
        set status = 'processing', locked_at = now(), attempt_count = attempt_count + 1
       from candidate
      where j.id = candidate.id
    returning j.id, j.connector, j.attempt_count`
  );
  return result.rows[0] ?? null;
}

async function deferUnimplemented(job: JobRow): Promise<void> {
  if (job.attempt_count >= config.WORKER_MAX_ATTEMPTS) {
    const client = await pool.connect();
    try {
      await client.query("begin");
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
        "update integration_jobs set status = 'dead_letter', finished_at = now(), last_error_code = 'connector_not_implemented' where id = $1",
        [job.id]
      );
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
    return;
  }

  const delay = retryDelayMs(job.attempt_count);
  await pool.query(
    `update integration_jobs
        set status = 'retry', next_attempt_at = now() + ($2 * interval '1 millisecond'),
            last_error_code = 'connector_not_implemented', locked_at = null
      where id = $1`,
    [job.id, delay]
  );
}

async function run(): Promise<void> {
  for (;;) {
    const job = await reserveJob();
    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, config.WORKER_POLL_MS));
      continue;
    }
    await deferUnimplemented(job);
  }
}

process.on("SIGTERM", () => void pool.end().finally(() => process.exit(0)));
process.on("SIGINT", () => void pool.end().finally(() => process.exit(0)));

await run();
