import Fastify from "fastify";
import { z } from "zod";
import { isAdminRequest } from "./auth.js";
import { integrationKeys } from "./catalog.js";
import { loadConfig } from "./config.js";
import { createPool } from "./database.js";
import { registerPlatformCoreRoutes } from "./platform-core.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
const app = Fastify({ logger: true, bodyLimit: 1_048_576 });

// Parser tolerante que aceita JSON vazio ou em branco sem quebrar requisições
app.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body, done) => {
  try {
    const json = (typeof body === "string" && body.trim().length > 0) ? JSON.parse(body) : {};
    done(null, json);
  } catch (err) {
    done(err as Error, undefined);
  }
});

registerPlatformCoreRoutes(app, pool);

app.get("/health", async (_request, reply) => {
  try {
    await pool.query("select 1");
    return reply.send({ status: "ok" });
  } catch {
    return reply.code(503).send({ status: "degraded" });
  }
});

const shutdown = async (): Promise<void> => {
  await app.close();
  await pool.end();
};

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());

await app.listen({ host: "0.0.0.0", port: config.PORT });
