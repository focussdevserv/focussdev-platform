import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import type pg from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { persistWebhook } from "./inbox.js";
import { deferUnimplemented, reserveJob, type JobRow } from "./jobs.js";

const leaseMs = 60_000;
const payload = { event: "synthetic-event", amount: 123 };
let database: PGlite;
let pool: pg.Pool;

beforeAll(async () => {
  database = await PGlite.create();
  await database.exec(await readFile(new URL("../migrations/001_initial.sql", import.meta.url), "utf8"));

  // Adapt only the pg result shape: every SQL statement runs in the real in-memory engine.
  const query = async (sql: string, values?: unknown[]) => {
    const result = await database.query(sql, values);
    return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length };
  };
  pool = {
    query,
    connect: async () => ({ query, release() {} })
  } as unknown as pg.Pool;
}, 30_000);

beforeEach(async () => {
  await database.exec(`
    alter table webhook_inbox drop constraint if exists test_prevent_failure;
    truncate integration_dead_letters, integration_deliveries, integration_jobs, webhook_inbox;
  `);
});

afterAll(async () => {
  await database?.close();
});

async function enqueue(externalEventId = "synthetic-1"): Promise<void> {
  await persistWebhook(pool, {
    connector: "deskcommcrm",
    externalEventId,
    eventType: "synthetic.test",
    payload,
    critical: true,
    signatureValid: true
  });
}

async function acquire(): Promise<JobRow> {
  const job = await reserveJob(pool, leaseMs);
  expect(job).not.toBeNull();
  return job!;
}

async function abandon(job: JobRow): Promise<void> {
  await database.query(
    "update integration_jobs set locked_at = now() - interval '10 minutes' where id = $1",
    [job.id]
  );
}

async function state() {
  const jobs = await database.query("select status, attempt_count, locked_at, finished_at from integration_jobs");
  const inbox = await database.query("select status, payload from webhook_inbox");
  const deadLetters = await database.query("select reason, payload_snapshot from integration_dead_letters");
  return { jobs: jobs.rows, inbox: inbox.rows, deadLetters: deadLetters.rows };
}

describe("durable job recovery", () => {
  it("reclaims an abandoned reservation after a crash without losing its payload", async () => {
    await enqueue();
    const crashed = await acquire();
    await abandon(crashed);

    const recovered = await acquire();

    expect(recovered).toEqual({ ...crashed, attempt_count: 2 });
    expect((await state()).inbox).toEqual([{ status: "accepted", payload }]);
  });

  it("does not reclaim a reservation while its configured lease is valid", async () => {
    await enqueue();
    const running = await acquire();
    await database.query(
      "update integration_jobs set locked_at = now() - interval '5 seconds' where id = $1",
      [running.id]
    );

    expect(await reserveJob(pool, leaseMs)).toBeNull();
    expect(await reserveJob(pool, 1_000)).toEqual({ ...running, attempt_count: 2 });
  });

  it("gives only one caller the same job when reservations are submitted together", async () => {
    await enqueue();
    // PGlite serializes its single connection; this does not simulate independent server locks.
    const reservations = await Promise.all(Array.from({ length: 4 }, () => reserveJob(pool, leaseMs)));

    expect(reservations.filter(Boolean)).toHaveLength(1);
    expect((await state()).jobs).toMatchObject([{ status: "processing", attempt_count: 1 }]);
  });

  it("does not reserve retries until their scheduled time", async () => {
    await enqueue();
    const first = await acquire();
    expect(await deferUnimplemented(pool, first, 8)).toBe(true);
    await database.exec("update integration_jobs set next_attempt_at = now() + interval '1 hour'");

    expect(await reserveJob(pool, leaseMs)).toBeNull();
    await database.exec("update integration_jobs set next_attempt_at = now() - interval '1 second'");
    expect(await acquire()).toEqual({ ...first, attempt_count: 2 });
  });

  it("prevents an expired worker from scheduling a retry for a newer reservation", async () => {
    await enqueue();
    const old = await acquire();
    await abandon(old);
    const current = await acquire();

    expect(await deferUnimplemented(pool, old, 8)).toBe(false);
    expect((await state()).jobs).toMatchObject([{ status: "processing", attempt_count: current.attempt_count }]);
    expect(await deferUnimplemented(pool, current, 8)).toBe(true);
    expect((await state()).jobs).toMatchObject([{ status: "retry", locked_at: null }]);
  });

  it("prevents an expired worker from dead-lettering a newer reservation", async () => {
    await enqueue();
    const old = await acquire();
    await abandon(old);
    const current = await acquire();

    expect(await deferUnimplemented(pool, old, 1)).toBe(false);
    const afterOldWorker = await state();
    expect(afterOldWorker.jobs).toMatchObject([{ status: "processing", attempt_count: current.attempt_count }]);
    expect(afterOldWorker.inbox).toEqual([{ status: "accepted", payload }]);
    expect(afterOldWorker.deadLetters).toEqual([]);
  });

  it("preserves the payload and marks the inbox failed when attempts are exhausted", async () => {
    await enqueue();
    const job = await acquire();

    expect(await deferUnimplemented(pool, job, 1)).toBe(true);
    const result = await state();
    expect(result.jobs).toMatchObject([{ status: "dead_letter", locked_at: null }]);
    expect(result.jobs[0]).toHaveProperty("finished_at", expect.any(Date));
    expect(result.inbox).toEqual([{ status: "failed", payload }]);
    expect(result.deadLetters).toEqual([{ reason: "connector_not_implemented", payload_snapshot: payload }]);
    expect(await reserveJob(pool, leaseMs)).toBeNull();
    expect(await deferUnimplemented(pool, job, 1)).toBe(false);
    expect((await state()).deadLetters).toHaveLength(1);
  });

  it("rolls back the job and dead letter when the final inbox write fails", async () => {
    await enqueue();
    const job = await acquire();
    await database.exec(
      "alter table webhook_inbox add constraint test_prevent_failure check (status <> 'failed')"
    );

    await expect(deferUnimplemented(pool, job, 1)).rejects.toThrow("test_prevent_failure");
    const afterFailure = await state();
    expect(afterFailure.jobs).toMatchObject([{ status: "processing", finished_at: null }]);
    expect(afterFailure.inbox).toEqual([{ status: "accepted", payload }]);
    expect(afterFailure.deadLetters).toEqual([]);

    await database.exec("alter table webhook_inbox drop constraint test_prevent_failure");
    await abandon(job);
    expect(await deferUnimplemented(pool, await acquire(), 1)).toBe(true);
  });
});
