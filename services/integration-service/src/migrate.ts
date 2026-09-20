import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { createPool } from "./database.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
const migrationDirectory = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

await pool.query(`create table if not exists integration_schema_migrations (
  name text primary key,
  applied_at timestamptz not null default now()
)`);

for (const name of (await readdir(migrationDirectory)).filter((file) => file.endsWith(".sql")).sort()) {
  const applied = await pool.query("select 1 from integration_schema_migrations where name = $1", [name]);
  if (applied.rowCount) continue;
  const sql = await readFile(join(migrationDirectory, name), "utf8");
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(sql);
    await client.query("insert into integration_schema_migrations (name) values ($1)", [name]);
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

await pool.end();
