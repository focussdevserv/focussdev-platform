-- Migration 005: Expansão Completa das Funções dos 16 Repositórios / Open Source
-- Contratos (Documenso), Deploys/Git (Forgejo), Infra (Uptime Kuma/Beszel), Cofre (Vaultwarden),
-- Equipe (Authentik), WhatsApp (WAHA), Automações (N8N) e Consulta CNPJ.

-- 1. CONTRATOS & ASSINATURAS DIGITAIS (Documenso)
CREATE TABLE IF NOT EXISTS platform_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255),
  client_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  document_type VARCHAR(64) DEFAULT 'prestacao_servicos', -- prestacao_servicos, nda, aditivo, proposta
  amount_cents BIGINT DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'pending_signature', -- draft, pending_signature, signed, rejected
  sign_url TEXT,
  pdf_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. REPOSITÓRIOS & DEPLOYS (Forgejo / Git)
CREATE TABLE IF NOT EXISTS platform_deploys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(255),
  repository_name VARCHAR(255) NOT NULL,
  branch VARCHAR(128) NOT NULL DEFAULT 'main',
  commit_hash VARCHAR(40) NOT NULL,
  commit_message TEXT,
  environment VARCHAR(64) NOT NULL DEFAULT 'production', -- production, staging, preview
  status VARCHAR(32) NOT NULL DEFAULT 'success', -- success, building, failed, rollback
  author VARCHAR(255) DEFAULT 'Gustavo Lopes',
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MONITORAMENTO & TELEMETRIA DE SERVIDORES (Uptime Kuma / Beszel)
CREATE TABLE IF NOT EXISTS platform_monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  target_url TEXT NOT NULL,
  monitor_type VARCHAR(32) DEFAULT 'http', -- http, port, ping, docker
  status VARCHAR(32) NOT NULL DEFAULT 'online', -- online, degraded, offline
  uptime_pct NUMERIC(5,2) DEFAULT 99.98,
  latency_ms INTEGER DEFAULT 24,
  last_check TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. COFRE DE ACESSOS & CREDENCIAIS (Vaultwarden)
CREATE TABLE IF NOT EXISTS platform_vault_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'Servidores', -- Servidores, Bancos, APIs, Clientes
  username VARCHAR(255),
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EQUIPE & PERMISSÕES (Authentik)
CREATE TABLE IF NOT EXISTS platform_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(64) NOT NULL DEFAULT 'Desenvolvedor', -- Admin, Desenvolvedor, Suporte, Comercial
  two_factor_enabled BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, inactive, vacation
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INSTÂNCIAS DE WHATSAPP (WAHA)
CREATE TABLE IF NOT EXISTS platform_whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name VARCHAR(128) NOT NULL UNIQUE,
  phone_number VARCHAR(32),
  status VARCHAR(32) NOT NULL DEFAULT 'connected', -- connected, qr_ready, disconnected
  battery_level INTEGER DEFAULT 100,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. AUTOMAÇÕES & WEBHOOKS (N8N)
CREATE TABLE IF NOT EXISTS platform_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(128) NOT NULL,
  action_summary VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  executions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CONSULTA CNPJ (Receita Federal / BrasilAPI)
CREATE TABLE IF NOT EXISTS platform_cnpj_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj VARCHAR(20) NOT NULL UNIQUE,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  situacao VARCHAR(64) DEFAULT 'ATIVA',
  cnae_principal VARCHAR(255),
  cidade VARCHAR(128),
  uf VARCHAR(2),
  queried_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DADOS INICIAIS (SEED) PARA CADA UM DOS NOVOS MÓDULOS

INSERT INTO platform_contracts (client_name, title, document_type, amount_cents, status, sign_url)
VALUES
  ('Alpha Distribuidora', 'Contrato de Desenvolvimento de Plataforma Web & App', 'prestacao_servicos', 1500000, 'signed', 'https://docs.focussdev.space/d/alpha-contrato'),
  ('Beta Tech', 'Acordo de Confidencialidade e NDA de Projeto', 'nda', 0, 'signed', 'https://docs.focussdev.space/d/beta-nda'),
  ('Gama Soluções', 'Contrato de Manutenção e Suporte Contínuo (SLA)', 'prestacao_servicos', 250000, 'pending_signature', 'https://docs.focussdev.space/d/gama-manutencao')
ON CONFLICT DO NOTHING;

INSERT INTO platform_deploys (repository_name, branch, commit_hash, commit_message, environment, status, author)
VALUES
  ('focussdev-platform', 'main', '7a12b9c', 'feat: módulos unificados dos 16 repositórios na API e Hub', 'production', 'success', 'Gustavo Lopes'),
  ('focussdev-api', 'main', '3e48f10', 'perf: otimização de pool de conexões PostgreSQL', 'production', 'success', 'Gustavo Lopes'),
  ('credmaisapp', 'main', '98c41d2', 'fix: validação de esteira de crédito e webhook de pagamento', 'production', 'success', 'Gustavo Lopes')
ON CONFLICT DO NOTHING;

INSERT INTO platform_monitors (name, target_url, monitor_type, status, uptime_pct, latency_ms)
VALUES
  ('Hub Central (Cloudflare Pages)', 'https://app.focussdev.space', 'http', 'online', 100.00, 18),
  ('API de Integração & Core (VPS)', 'https://api.focussdev.space/v1/health', 'http', 'online', 99.98, 22),
  ('CRM & Atendimento (WAHA)', 'https://crm.focussdev.space', 'http', 'online', 99.95, 34),
  ('PostgreSQL Database (Cluster)', 'localhost:5432', 'port', 'online', 100.00, 2),
  ('Servidor Hostinger VPS', '72.62.138.208', 'ping', 'online', 100.00, 14)
ON CONFLICT DO NOTHING;

INSERT INTO platform_vault_items (title, category, username, url, notes)
VALUES
  ('Servidor VPS Hostinger', 'Servidores', 'root', 'ssh://72.62.138.208:22', 'Chave SSH ED25519 instalada no cofre'),
  ('PostgreSQL Central Produção', 'Bancos', 'focuss_integrations', 'postgresql://localhost:5432/focuss_integrations', 'Banco de dados central do ecossistema'),
  ('Gateway de Pagamento PIX', 'APIs', 'focussdev_master', 'https://api.mercadopago.com', 'Token de produção para emissão de cobranças'),
  ('Google Gemini AI Studio', 'APIs', 'focussdev-ai', 'https://aistudio.google.com', 'Chave de API dos Agentes de IA da plataforma')
ON CONFLICT DO NOTHING;

INSERT INTO platform_team_members (name, email, role, two_factor_enabled, status)
VALUES
  ('Gustavo Lopes', 'gustavo@focussdev.com.br', 'Admin', true, 'active'),
  ('Engenharia de Software', 'dev@focussdev.com.br', 'Desenvolvedor', true, 'active'),
  ('Suporte & Sucesso do Cliente', 'suporte@focussdev.com.br', 'Suporte', true, 'active'),
  ('Comercial & Vendas', 'comercial@focussdev.com.br', 'Comercial', true, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO platform_whatsapp_sessions (session_name, phone_number, status, battery_level)
VALUES
  ('Atendimento Principal (WAHA)', '+55 (11) 98765-4321', 'connected', 98)
ON CONFLICT DO NOTHING;

INSERT INTO platform_automations (name, trigger_event, action_summary, status, executions_count)
VALUES
  ('Cobrança Automática PIX', 'Quando fatura atingir 3 dias para vencer', 'Dispara mensagem de lembrete no WhatsApp com código copia e cola', 'active', 142),
  ('Boas-vindas ao Novo Cliente', 'Quando oportunidade for movida para GANHO', 'Cria pasta no drive, contrato de serviço e projeto no Plane', 'active', 38),
  ('Alerta de Incidente de Servidor', 'Quando qualquer monitor do Uptime falhar', 'Notifica equipe no WhatsApp com latência e status', 'active', 7)
ON CONFLICT DO NOTHING;
