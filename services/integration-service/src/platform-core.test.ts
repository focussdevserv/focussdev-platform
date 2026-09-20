import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import { PGlite } from "@electric-sql/pglite";
import { registerPlatformCoreRoutes } from "./platform-core.js";

describe("Platform Core Endpoints", () => {
  let app: FastifyInstance;
  let pglite: PGlite;
  let mockPool: any;

  beforeAll(async () => {
    pglite = new PGlite();

    // Criar tabelas da migration 002
    await pglite.exec(`
      CREATE TABLE IF NOT EXISTS integration_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(64) NOT NULL,
        source_system VARCHAR(64) NOT NULL,
        source_id VARCHAR(255) NOT NULL,
        target_systems JSONB NOT NULL DEFAULT '{}'::jsonb,
        title VARCHAR(255),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_entity_source UNIQUE(entity_type, source_system, source_id)
      );

      CREATE TABLE IF NOT EXISTS platform_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(64) NOT NULL,
        source_system VARCHAR(64) NOT NULL,
        client_id VARCHAR(255),
        project_id VARCHAR(255),
        actor VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(1024),
        severity VARCHAR(32) NOT NULL DEFAULT 'info',
        payload JSONB DEFAULT '{}'::jsonb,
        occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_deadlines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category VARCHAR(64) NOT NULL,
        source_system VARCHAR(64) NOT NULL,
        external_id VARCHAR(255),
        client_id VARCHAR(255),
        project_id VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount_cents BIGINT,
        currency VARCHAR(8) DEFAULT 'BRL',
        due_date DATE NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        link VARCHAR(1024),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        asset_type VARCHAR(64) NOT NULL,
        project_id VARCHAR(255),
        client_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        url VARCHAR(1024),
        status VARCHAR(32) NOT NULL DEFAULT 'online',
        health_check_url VARCHAR(1024),
        last_check_at TIMESTAMPTZ,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS platform_search_index (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(64) NOT NULL,
        entity_id VARCHAR(255) NOT NULL,
        source_system VARCHAR(64) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        content TEXT,
        url VARCHAR(1024) NOT NULL,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        metadata JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_search_entity UNIQUE (entity_type, entity_id)
      );
    `);

    // Mock Pool wrapper adaptando PGlite
    mockPool = {
      query: (sql: string, params?: any[]) => pglite.query(sql, params),
    };

    app = Fastify();
    registerPlatformCoreRoutes(app, mockPool);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pglite.close();
  });

  it("deve criar e buscar um link Cross-Reference (XREF)", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/xref/link",
      payload: {
        entity_type: "client",
        source_system: "deskcommcrm",
        source_id: "lead-12345",
        target_systems: {
          aureus_customer_id: "CUST-999",
          plane_project_id: "PRJ-555",
        },
        title: "ACME Corp",
      },
    });

    expect(createRes.statusCode).toBe(201);
    const body = JSON.parse(createRes.body);
    expect(body.data.source_id).toBe("lead-12345");
    expect(body.data.target_systems.aureus_customer_id).toBe("CUST-999");

    // Buscar o link
    const lookupRes = await app.inject({
      method: "GET",
      url: "/v1/xref/lookup?entity_type=client&source_system=deskcommcrm&source_id=lead-12345",
    });

    expect(lookupRes.statusCode).toBe(200);
    const lookupBody = JSON.parse(lookupRes.body);
    expect(lookupBody.data.title).toBe("ACME Corp");
  });

  it("deve retornar a visão agregada de Cliente 360°", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/clients/lead-12345/overview",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data.name).toBe("ACME Corp");
    expect(body.data.financial).toBeDefined();
    expect(body.data.crm).toBeDefined();
    expect(body.data.contracts).toBeDefined();
    expect(body.data.support).toBeDefined();
  });

  it("deve registrar e listar eventos na Timeline Unificada", async () => {
    const postRes = await app.inject({
      method: "POST",
      url: "/v1/timeline/events",
      payload: {
        event_type: "contract.signed",
        source_system: "documenso",
        client_id: "lead-12345",
        title: "Contrato Anual Assinado",
        description: "Contrato de prestação de serviços assinado eletronicamente",
        severity: "success",
      },
    });

    expect(postRes.statusCode).toBe(201);

    const getRes = await app.inject({
      method: "GET",
      url: "/v1/timeline?client_id=lead-12345",
    });

    expect(getRes.statusCode).toBe(200);
    const body = JSON.parse(getRes.body);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].title).toBe("Contrato Anual Assinado");
  });

  it("deve gerenciar prazos e retornar dados de Meu Dia", async () => {
    const today = new Date().toISOString().split("T")[0];
    await app.inject({
      method: "POST",
      url: "/v1/deadlines",
      payload: {
        category: "invoice",
        source_system: "aureuserp",
        title: "Fatura Mensalidade ACME",
        due_date: today,
        amount_cents: 250000,
        status: "pending",
      },
    });

    const myDayRes = await app.inject({
      method: "GET",
      url: "/v1/my-day",
    });

    expect(myDayRes.statusCode).toBe(200);
    const body = JSON.parse(myDayRes.body);
    expect(body.data.due_today.length).toBeGreaterThan(0);
    expect(body.data.summary.due_today_count).toBeGreaterThan(0);
  });

  it("deve realizar busca global transversal", async () => {
    const searchRes = await app.inject({
      method: "GET",
      url: "/v1/search?q=ACME",
    });

    expect(searchRes.statusCode).toBe(200);
    const body = JSON.parse(searchRes.body);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].title).toContain("ACME");
  });

  it("deve executar o fluxo de onboarding automático e offboarding com sucesso (Fase 12)", async () => {
    // 1. Onboarding de novo cliente
    const onboardRes = await app.inject({
      method: "POST",
      url: "/v1/onboarding/client",
      payload: {
        name: "InovaTech Soluções",
        legal_name: "InovaTech Soluções Digitais LTDA",
        document: "98.765.432/0001-10",
        email: "contato@inovatech.com.br",
        phone: "+55 11 99999-8888",
        plan: "enterprise",
        mrr_cents: 650000,
        domain: "inovatech.com.br",
        repo_name: "inovatech-portal",
      },
    });

    expect(onboardRes.statusCode).toBe(201);
    const onboardData = JSON.parse(onboardRes.body).data;
    expect(onboardData.client_id).toContain("fc_client_inovatech-solucoes");
    expect(onboardData.project_id).toContain("fc_proj_inovatech-solucoes");
    expect(onboardData.checklist.length).toBe(8);

    // 2. Verificar que o cliente agora é pesquisável na busca global
    const searchRes = await app.inject({
      method: "GET",
      url: "/v1/search?q=InovaTech",
    });
    expect(searchRes.statusCode).toBe(200);
    const searchResults = JSON.parse(searchRes.body).data;
    expect(searchResults.some((item: any) => item.title.includes("InovaTech"))).toBe(true);

    // 3. Executar o offboarding do cliente
    const offboardRes = await app.inject({
      method: "POST",
      url: "/v1/offboarding/client",
      payload: {
        client_id: onboardData.client_id,
        reason: "Migração interna concluída",
      },
    });

    expect(offboardRes.statusCode).toBe(200);
    const offboardData = JSON.parse(offboardRes.body).data;
    expect(offboardData.status).toBe("archived");
  });
});

