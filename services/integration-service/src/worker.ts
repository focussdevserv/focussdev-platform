import { loadConfig } from "./config.js";
import { createPool } from "./database.js";
import { deferUnimplemented, reserveJob } from "./jobs.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);

async function run(): Promise<void> {
  for (;;) {
    const job = await reserveJob(pool, config.WORKER_LEASE_MS);
    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, config.WORKER_POLL_MS));
      continue;
    }
    await deferUnimplemented(pool, job, config.WORKER_MAX_ATTEMPTS);
  }
}

process.on("SIGTERM", () => void pool.end().finally(() => process.exit(0)));
process.on("SIGINT", () => void pool.end().finally(() => process.exit(0)));

await run();
