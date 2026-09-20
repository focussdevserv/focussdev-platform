import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3100),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  INTEGRATION_ADMIN_TOKEN: z.string().min(32),
  WORKER_POLL_MS: z.coerce.number().int().min(250).max(60_000).default(2_000),
  WORKER_LEASE_MS: z.coerce.number().int().min(1_000).max(3_600_000).default(300_000),
  WORKER_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(25).default(8)
});

export type Config = z.infer<typeof schema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): Config {
  return schema.parse(environment);
}
