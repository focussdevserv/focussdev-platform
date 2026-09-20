import Fastify from "fastify";
import { z } from "zod";
import { isAdminRequest } from "./auth.js";
import { integrationKeys } from "./catalog.js";
import { loadConfig } from "./config.js";
import { createPool } from "./database.js";

const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
const app = Fastify({ logger: true, bodyLimit: 1_048_576 });

app.get("/health", async (_request, reply) => {
  try {
    await pool.query("select 1");
    return reply.send({ status: "ok" });
  } catch {
    return reply.code(503).send({ status: "degraded" });
  }
});

app.get("/v1/integrations", async (request, reply) => {
  if (!isAdminRequest(request, config.INTEGRATION_ADMIN_TOKEN)) {
    return reply.code(401).send({ error: "unauthorized" });
  }

  const result = await pool.query(
    `select connector, display_name, status, required_configuration,
            last_test_at, last_sync_at, last_error_at, last_error_code
       from integration_connections
      order by display_name`
  );
  return reply.send({ data: result.rows });
});

const connectorParams = z.object({ connector: z.string().min(1).max(64) });

app.post("/v1/integrations/:connector/test", async (request, reply) => {
  if (!isAdminRequest(request, config.INTEGRATION_ADMIN_TOKEN)) {
    return reply.code(401).send({ error: "unauthorized" });
  }

  const parsed = connectorParams.safeParse(request.params);
  if (!parsed.success || !integrationKeys.has(parsed.data.connector)) {
    return reply.code(404).send({ error: "integration_not_found" });
  }

  return reply.code(409).send({
    error: "connector_not_implemented",
    message: "A API oficial da versão instalada ainda precisa ser validada para este conector."
  });
});

const shutdown = async (): Promise<void> => {
  await app.close();
  await pool.end();
};

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());

await app.listen({ host: "0.0.0.0", port: config.PORT });
