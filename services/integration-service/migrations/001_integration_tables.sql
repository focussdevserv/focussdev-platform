-- Integration Service Schema

-- ========== TABELAS PRINCIPAIS ==========

-- Histórico de conexões de integrações
CREATE TABLE IF NOT EXISTS integration_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  connector_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- connected, pending, error, not_implemented
  webhook_url VARCHAR(1024),
  webhook_secret VARCHAR(255),
  api_key_encrypted VARCHAR(1024),
  last_sync_at TIMESTAMP,
  next_sync_at TIMESTAMP,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, connector_name)
);

-- Fila de jobs de integração
CREATE TABLE IF NOT EXISTS integration_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  connector_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  payload JSONB NOT NULL,
  result JSONB,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  next_retry_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  INDEX idx_org_status (organization_id, status),
  INDEX idx_next_retry (next_retry_at)
);

-- Log de auditoria de integrações
CREATE TABLE IF NOT EXISTS integration_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  source_system VARCHAR(255) NOT NULL, -- deskcommcrm, aureusrp, plane, forgejo, etc
  target_system VARCHAR(255),
  actor VARCHAR(255), -- webhook, cron, user_id
  data JSONB NOT NULL,
  duration_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  INDEX idx_org_event (organization_id, event_type),
  INDEX idx_created (created_at DESC)
);

-- Rastreamento de entregas de webhooks (attempt history)
CREATE TABLE IF NOT EXISTS integration_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  attempt_number INT NOT NULL,
  webhook_url VARCHAR(1024),
  request_payload JSONB,
  response_status INT,
  response_body TEXT,
  error_message TEXT,
  duration_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES integration_jobs(id) ON DELETE CASCADE,
  INDEX idx_job (job_id)
);

-- Dead letter queue (jobs que falharam depois de max_retries)
CREATE TABLE IF NOT EXISTS integration_dead_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  job_id UUID,
  connector_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  error_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  INDEX idx_org_created (organization_id, created_at DESC)
);

-- Vinculações de dados cross-system (external IDs mapping)
CREATE TABLE IF NOT EXISTS integration_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  source_system VARCHAR(255) NOT NULL, -- deskcommcrm
  source_id VARCHAR(255) NOT NULL,
  target_systems JSONB NOT NULL, -- { aureusrp_customer: id, plane_project: id, ... }
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, source_system, source_id),
  INDEX idx_org_source (organization_id, source_system, source_id)
);

-- ========== ÍNDICES ADICIONAIS ==========

CREATE INDEX IF NOT EXISTS idx_connections_status ON integration_connections(status);
CREATE INDEX IF NOT EXISTS idx_jobs_connector_status ON integration_jobs(connector_name, status);
CREATE INDEX IF NOT EXISTS idx_audit_source_system ON integration_audit_log(source_system);

-- ========== VIEWS ==========

-- Dashboard de status das integrações
CREATE OR REPLACE VIEW integration_status_dashboard AS
SELECT
  c.organization_id,
  c.connector_name,
  c.status,
  COUNT(CASE WHEN j.status = 'pending' THEN 1 END) AS pending_jobs,
  COUNT(CASE WHEN j.status = 'processing' THEN 1 END) AS processing_jobs,
  COUNT(CASE WHEN j.status = 'failed' THEN 1 END) AS failed_jobs,
  COUNT(CASE WHEN j.status = 'completed' THEN 1 END) AS completed_jobs,
  c.last_sync_at,
  c.error_message,
  c.updated_at
FROM integration_connections c
LEFT JOIN integration_jobs j ON c.organization_id = j.organization_id AND c.connector_name = j.connector_name
GROUP BY c.id, c.organization_id, c.connector_name, c.status, c.last_sync_at, c.error_message, c.updated_at;

-- ========== TRIGGERS ==========

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_connections_timestamp
BEFORE UPDATE ON integration_connections
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_links_timestamp
BEFORE UPDATE ON integration_links
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
