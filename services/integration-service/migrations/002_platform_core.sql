-- =============================================================================
-- Migration 002: Core Platform Schema (Cross-Reference, Timeline, Deadlines, Assets, Search)
-- =============================================================================

-- 1. Tabela de Mapeamento de Identidades Globais (Cross-Reference)
CREATE TABLE IF NOT EXISTS integration_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(64) NOT NULL, -- 'client', 'project', 'contact', 'invoice', 'document'
  source_system VARCHAR(64) NOT NULL, -- 'deskcommcrm', 'aureusrp', 'plane', 'forgejo', 'freescout', 'documenso', 'bookstack'
  source_id VARCHAR(255) NOT NULL,
  target_systems JSONB NOT NULL DEFAULT '{}'::jsonb, -- ex: {"aureusrp_customer_id": "CLI-001", "plane_project_id": "PRJ-002"}
  title VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_entity_source UNIQUE(entity_type, source_system, source_id)
);

CREATE INDEX IF NOT EXISTS idx_integration_links_lookup 
  ON integration_links (entity_type, source_system, source_id);

CREATE INDEX IF NOT EXISTS idx_integration_links_targets 
  ON integration_links USING GIN (target_systems);

-- 2. Tabela de Linha do Tempo Unificada (Unified Timeline Events)
CREATE TABLE IF NOT EXISTS platform_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(64) NOT NULL, -- 'lead.won', 'contract.signed', 'invoice.paid', 'task.completed', 'pr.merged', 'ticket.resolved', 'monitor.down'
  source_system VARCHAR(64) NOT NULL,
  client_id VARCHAR(255),
  project_id VARCHAR(255),
  actor VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(1024),
  severity VARCHAR(32) NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'critical'
  payload JSONB DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_events_client 
  ON platform_events (client_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_events_project 
  ON platform_events (project_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_events_timeline 
  ON platform_events (occurred_at DESC);

-- 3. Tabela de Prazos & Vencimentos (Deadlines & Expirations)
CREATE TABLE IF NOT EXISTS platform_deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(64) NOT NULL, -- 'invoice', 'contract', 'domain', 'ssl', 'task'
  source_system VARCHAR(64) NOT NULL,
  external_id VARCHAR(255),
  client_id VARCHAR(255),
  project_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount_cents BIGINT,
  currency VARCHAR(8) DEFAULT 'BRL',
  due_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'renewed', 'expired', 'canceled'
  link VARCHAR(1024),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_deadlines_due 
  ON platform_deadlines (due_date ASC, status);

-- 4. Tabela de Ativos e Infraestrutura (Central de Ativos)
CREATE TABLE IF NOT EXISTS platform_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type VARCHAR(64) NOT NULL, -- 'domain', 'repository', 'documentation', 'database', 'monitor', 'certificate'
  project_id VARCHAR(255),
  client_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1024),
  status VARCHAR(32) NOT NULL DEFAULT 'online', -- 'online', 'degraded', 'offline', 'pending'
  health_check_url VARCHAR(1024),
  last_check_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_assets_proj 
  ON platform_assets (project_id, asset_type);

-- 5. Índice de Busca Global Transversal (Global Search Index)
CREATE TABLE IF NOT EXISTS platform_search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(64) NOT NULL, -- 'client', 'project', 'document', 'ticket', 'repository', 'deal'
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

CREATE INDEX IF NOT EXISTS idx_search_index_text 
  ON platform_search_index USING GIN (to_tsvector('portuguese', title || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(content, '')));
