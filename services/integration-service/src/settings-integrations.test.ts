import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import { PGlite } from "@electric-sql/pglite";
import { registerPlatformCoreRoutes } from "./platform-core.js";

describe("Settings & 1-Click Integrations Endpoints", () => {
  let app: FastifyInstance;
  let pglite: PGlite;
  let mockPool: any;

  beforeAll(async () => {
    pglite = new PGlite();

    // Criar tabelas necessárias para os testes
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        category VARCHAR(64) PRIMARY KEY,
        settings JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_integrations (
        key VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        symbol VARCHAR(16) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'connected',
        provider_type VARCHAR(64) NOT NULL DEFAULT 'api',
        auth_type VARCHAR(64) NOT NULL DEFAULT 'api_key',
        target_url TEXT,
        latency_ms INTEGER DEFAULT 20,
        error_count INTEGER DEFAULT 0,
        last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'todo',
        priority VARCHAR(32) NOT NULL DEFAULT 'medium',
        assignee_name VARCHAR(255) DEFAULT 'Equipe',
        project_name VARCHAR(255) DEFAULT 'Plataforma Focussdev',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      INSERT INTO platform_integrations (key, name, category, symbol, status, target_url)
      VALUES 
        ('mercadopago', 'Mercado Pago (PIX)', 'Financeiro', 'MP', 'connected', 'https://api.mercadopago.com'),
        ('deskcommcrm', 'DeskcommCRM', 'Comercial', 'CRM', 'connected', 'https://crm.focussdev.space');
    `);

    mockPool = {
      query: async (text: string, params?: any[]) => {
        const res = await pglite.query(text, params);
        return { rows: res.rows };
      }
    };

    app = Fastify({ logger: false });
    registerPlatformCoreRoutes(app, mockPool);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pglite.close();
  });

  it("deve retornar o status consolidado dos 16 motores em /v1/system/modules-status", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/system/modules-status"
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(16);
    expect(body.data[0].name).toBe("DeskcommCRM");
  });

  it("deve executar o teste de ping ao vivo para um módulo", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/system/modules-status/deskcommcrm/test"
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.status).toBe("connected");
    expect(body.data.latency_ms).toBeGreaterThan(0);
  });

  it("deve retornar configurações com chaves mascaradas", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/system/settings"
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.geral).toBeDefined();
    expect(body.data.seguranca_chaves_mascaradas.google_gemini_api).toContain("••••");
  });

  it("deve salvar configurações de uma categoria com PUT /v1/system/settings/:category", async () => {
    const res = await app.inject({
      method: "PUT",
      url: "/v1/system/settings/crm",
      payload: {
        tempo_limite_primeira_resposta_min: 20,
        silencio_humano_ativo: true
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.category).toBe("crm");
    expect(body.data.settings.tempo_limite_primeira_resposta_min).toBe(20);
  });

  it("deve listar integrações em /v1/integrations", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/integrations"
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("deve conectar e desconectar integração em 1 clique", async () => {
    // 1. Desconectar
    const discRes = await app.inject({
      method: "POST",
      url: "/v1/integrations/mercadopago/disconnect"
    });
    expect(discRes.statusCode).toBe(200);
    const discBody = JSON.parse(discRes.body);
    expect(discBody.data.status).toBe("disconnected");

    // 2. Conectar com 1 clique
    const connRes = await app.inject({
      method: "POST",
      url: "/v1/integrations/mercadopago/connect"
    });
    expect(connRes.statusCode).toBe(200);
    const connBody = JSON.parse(connRes.body);
    expect(connBody.data.status).toBe("connected");
    expect(connBody.data.latency_ms).toBeGreaterThan(0);
  });
});
