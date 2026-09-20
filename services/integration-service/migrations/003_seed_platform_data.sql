-- =============================================================================
-- Migration 003: Seed Platform Data (Clientes 360°, Deadlines, Assets, Timeline)
-- =============================================================================

-- 1. Clientes e Projetos Cross-Reference
INSERT INTO integration_links (entity_type, source_system, source_id, target_systems, title, metadata)
VALUES
  ('client', 'deskcommcrm', 'lead-acme-01', 
   '{"crm_lead_id": "lead-acme-01", "aureus_customer_id": "CLI-101", "plane_project_id": "PRJ-ACME-01", "documenso_id": "DOC-ACME-2026", "freescout_customer_id": "FS-ACME-01"}'::jsonb,
   'ACME Brasil Soluções',
   '{"mrr_cents": 450000, "crm_status": "Cliente Ativo", "funnel": "Enterprise B2B", "open_tickets_count": 0, "contract_status": "Assinado", "client_name": "ACME Brasil"}'::jsonb),

  ('client', 'deskcommcrm', 'lead-tech-02', 
   '{"crm_lead_id": "lead-tech-02", "aureus_customer_id": "CLI-102", "plane_project_id": "PRJ-TECH-02", "documenso_id": "DOC-TECH-2026", "freescout_customer_id": "FS-TECH-02"}'::jsonb,
   'TechCorp Logística',
   '{"mrr_cents": 890000, "crm_status": "Cliente Ativo", "funnel": "Enterprise B2B", "open_tickets_count": 1, "contract_status": "Assinado", "client_name": "TechCorp"}'::jsonb),

  ('client', 'deskcommcrm', 'lead-bio-03', 
   '{"crm_lead_id": "lead-bio-03", "aureus_customer_id": "CLI-103", "plane_project_id": "PRJ-BIO-03", "documenso_id": "DOC-BIO-2026", "freescout_customer_id": "FS-BIO-03"}'::jsonb,
   'BioFarma Saúde Integrada',
   '{"mrr_cents": 320000, "crm_status": "Onboarding", "funnel": "Projetos Sob Medida", "open_tickets_count": 0, "contract_status": "Assinado", "client_name": "BioFarma"}'::jsonb)
ON CONFLICT (entity_type, source_system, source_id) DO NOTHING;

-- 2. Projetos Cross-Reference
INSERT INTO integration_links (entity_type, source_system, source_id, target_systems, title, metadata)
VALUES
  ('project', 'plane', 'PRJ-ACME-01',
   '{"client_id": "lead-acme-01", "plane_project_id": "PRJ-ACME-01", "forgejo_repo": "focussdev/acme-portal"}'::jsonb,
   'Portal do Cliente ACME',
   '{"status": "Em Andamento", "progress_percentage": 75, "cycle_name": "Sprint 5", "total_tasks": 32, "completed_tasks": 24, "client_name": "ACME Brasil Soluções"}'::jsonb),

  ('project', 'plane', 'PRJ-TECH-02',
   '{"client_id": "lead-tech-02", "plane_project_id": "PRJ-TECH-02", "forgejo_repo": "focussdev/techcorp-api"}'::jsonb,
   'API de Rastreamento TechCorp',
   '{"status": "Em Andamento", "progress_percentage": 50, "cycle_name": "Sprint 2", "total_tasks": 20, "completed_tasks": 10, "client_name": "TechCorp Logística"}'::jsonb)
ON CONFLICT (entity_type, source_system, source_id) DO NOTHING;

-- 3. Linha do Tempo Unificada
INSERT INTO platform_events (event_type, source_system, client_id, project_id, actor, title, description, severity, occurred_at)
VALUES
  ('contract.signed', 'documenso', 'lead-acme-01', 'PRJ-ACME-01', 'Gustavo Lopes', 'Contrato de Prestação de Serviços Assinado', 'Documento autenticado digitalmente via Documenso', 'success', NOW() - INTERVAL '2 days'),
  ('payment.success', 'mercado_pago', 'lead-acme-01', 'PRJ-ACME-01', 'Mercado Pago', 'Pagamento Confirmado (R$ 4.500,00)', 'Fatura #1029 liquidada com sucesso via PIX', 'success', NOW() - INTERVAL '1 day'),
  ('release.deployed', 'forgejo', 'lead-tech-02', 'PRJ-TECH-02', 'CI/CD Pipeline', 'Deploy em Produção v1.4.0', 'Novo microserviço de tracking operacional', 'info', NOW() - INTERVAL '6 hours'),
  ('lead.qualified', 'deskcommcrm', 'lead-bio-03', 'PRJ-BIO-03', 'IA Sales Agent', 'Lead Qualificado via WhatsApp', 'Atendimento inicial automático conduzido pelo agente de IA', 'info', NOW() - INTERVAL '2 hours');

-- 4. Vencimentos e Obrigações (Deadlines)
INSERT INTO platform_deadlines (category, source_system, client_id, project_id, title, description, amount_cents, due_date, status)
VALUES
  ('invoice', 'aureuserp', 'lead-acme-01', 'PRJ-ACME-01', 'Fatura Mensal ACME Brasil', 'Mensalidade de sustentação e suporte', 450000, CURRENT_DATE + INTERVAL '5 days', 'pending'),
  ('contract', 'documenso', 'lead-tech-02', 'PRJ-TECH-02', 'Renovação Contratual TechCorp', 'Termo aditivo para expansão de escopo', NULL, CURRENT_DATE + INTERVAL '12 days', 'pending'),
  ('domain', 'hostinger', NULL, NULL, 'Renovação Domínio focussdev.space', 'Registro internacional de domínio', 12900, CURRENT_DATE + INTERVAL '28 days', 'pending'),
  ('ssl', 'letsencrypt', NULL, NULL, 'Renovação de Certificados SSL Traefik', 'Certificados wildcard para *.focussdev.space', NULL, CURRENT_DATE + INTERVAL '45 days', 'pending');

-- 5. Central de Ativos (Assets)
INSERT INTO platform_assets (asset_type, project_id, client_id, name, url, status, health_check_url)
VALUES
  ('domain', 'PRJ-ACME-01', 'lead-acme-01', 'app.focussdev.space', 'https://app.focussdev.space', 'online', 'https://app.focussdev.space'),
  ('domain', 'PRJ-ACME-01', 'lead-acme-01', 'crm.focussdev.space', 'https://crm.focussdev.space', 'online', 'https://crm.focussdev.space/api/health'),
  ('repository', 'PRJ-ACME-01', 'lead-acme-01', 'focussdev-platform', 'https://git.focussdev.space/focussdev/focussdev-platform', 'online', NULL),
  ('monitor', 'PRJ-ACME-01', 'lead-acme-01', 'Uptime Kuma Central', 'https://status.focussdev.space', 'online', 'https://status.focussdev.space/api/health'),
  ('documentation', 'PRJ-ACME-01', 'lead-acme-01', 'Base de Conhecimento Focussdev', 'https://wiki.focussdev.space', 'online', NULL);
