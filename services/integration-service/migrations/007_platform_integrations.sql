-- Migration 007: Tabela de Integrações com 1-Click Connect
CREATE TABLE IF NOT EXISTS platform_integrations (
  key VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  symbol VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'connected', -- connected, disconnected, pending
  provider_type VARCHAR(64) NOT NULL DEFAULT 'api', -- api, oauth, webhook, internal
  auth_type VARCHAR(64) NOT NULL DEFAULT 'api_key', -- bearer, oidc, token, basic, zero_knowledge
  target_url TEXT,
  latency_ms INTEGER DEFAULT 20,
  error_count INTEGER DEFAULT 0,
  last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed de todas as integrações oficiais da plataforma Focussdev
INSERT INTO platform_integrations (key, name, category, symbol, status, provider_type, auth_type, target_url, latency_ms)
VALUES
  -- Comercial
  ('deskcommcrm', 'DeskcommCRM', 'Comercial', 'CRM', 'connected', 'api', 'session', 'https://crm.focussdev.space', 28),
  ('documenso', 'Documenso', 'Comercial', 'DOC', 'connected', 'api', 'api_key', 'https://docs.focussdev.space', 24),
  
  -- Financeiro
  ('aureuserp', 'AureusERP', 'Financeiro', 'ERP', 'connected', 'api', 'token', 'https://erp.focussdev.space', 30),
  ('mercadopago', 'Mercado Pago (PIX)', 'Financeiro', 'MP', 'connected', 'oauth', 'bearer', 'https://api.mercadopago.com', 45),
  ('nfse', 'Emissor NFS-e', 'Financeiro', 'NF', 'connected', 'api', 'cert_a1', 'https://focusnfe.com.br', 62),

  -- Desenvolvimento & Projetos
  ('plane', 'Plane', 'Desenvolvimento', 'PL', 'connected', 'api', 'api_key', 'https://projetos.focussdev.space', 22),
  ('forgejo', 'Forgejo Git', 'Desenvolvimento', 'GIT', 'connected', 'api', 'pat', 'https://git.focussdev.space', 18),
  ('gotenberg', 'Gotenberg (PDF Engine)', 'Desenvolvimento', 'PDF', 'connected', 'internal', 'http', 'http://localhost:3000', 12),
  ('stirling_pdf', 'Stirling-PDF', 'Desenvolvimento', 'STP', 'connected', 'internal', 'http', 'http://localhost:8080', 16),

  -- Marketing & Inteligência Artificial
  ('gemini_ai', 'Google Gemini AI', 'Marketing & IA', 'AI', 'connected', 'api', 'api_key', 'https://generativelanguage.googleapis.com', 38),
  ('meta_ads', 'Meta Ads & Pixel', 'Marketing & IA', 'ADS', 'connected', 'oauth', 'bearer', 'https://graph.facebook.com', 54),

  -- Comunicação
  ('waha', 'WhatsApp (WAHA)', 'Comunicação', 'WA', 'connected', 'api', 'token', 'http://localhost:3000', 14),
  ('resend', 'Resend E-mail', 'Comunicação', 'RE', 'connected', 'api', 'api_key', 'https://api.resend.com', 42),

  -- Suporte & Documentação
  ('freescout', 'FreeScout Helpdesk', 'Suporte', 'FS', 'connected', 'api', 'api_key', 'https://suporte.focussdev.space', 26),
  ('bookstack', 'BookStack Wiki', 'Documentação', 'BS', 'connected', 'api', 'token', 'https://wiki.focussdev.space', 20),
  ('formbricks', 'Formbricks Formulários', 'Pesquisas', 'FBX', 'connected', 'api', 'api_key', 'https://forms.focussdev.space', 32),

  -- Infraestrutura & Segurança
  ('authentik', 'Authentik (SSO & 2FA)', 'Infraestrutura', 'ID', 'connected', 'oauth', 'oidc', 'https://auth.focussdev.space', 25),
  ('supabase', 'Supabase (DB & Storage)', 'Infraestrutura', 'DB', 'connected', 'internal', 'service_role', 'https://supabase.focussdev.space', 8),
  ('uptime_kuma', 'Uptime Kuma', 'Infraestrutura', 'UP', 'connected', 'api', 'token', 'https://status.focussdev.space', 16),
  ('beszel', 'Beszel (Métricas VPS)', 'Infraestrutura', 'VPS', 'connected', 'api', 'agent_key', 'http://localhost:8090', 10),
  ('vaultwarden', 'Vaultwarden Cofre', 'Infraestrutura', 'VW', 'connected', 'api', 'zero_knowledge', 'https://cofre.focussdev.space', 22),

  -- Serviços Externos
  ('brasil_api', 'BrasilAPI / Receita Federal', 'Serviços Externos', 'BR', 'connected', 'api', 'public', 'https://brasilapi.com.br', 65),
  ('cloudflare', 'Cloudflare CDN & DNS', 'Serviços Externos', 'CF', 'connected', 'api', 'api_token', 'https://api.cloudflare.com', 40)
ON CONFLICT (key) DO UPDATE
SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  symbol = EXCLUDED.symbol,
  status = EXCLUDED.status,
  target_url = EXCLUDED.target_url,
  latency_ms = EXCLUDED.latency_ms,
  updated_at = NOW();
