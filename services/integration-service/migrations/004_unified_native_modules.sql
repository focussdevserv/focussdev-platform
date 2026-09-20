-- Migration 004: Módulos Nativos Unificados (Projetos, CRM Funil, Financeiro, Wiki e Suporte)

CREATE TABLE IF NOT EXISTS platform_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(255),
  client_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'todo', -- backlog, todo, in_progress, review, done
  priority VARCHAR(32) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  assignee VARCHAR(255) DEFAULT 'Gustavo Lopes',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  value_cents BIGINT NOT NULL DEFAULT 0,
  stage VARCHAR(32) NOT NULL DEFAULT 'lead', -- lead, qualified, proposal, negotiation, won, lost
  contact_name VARCHAR(255),
  contact_phone VARCHAR(64),
  contact_email VARCHAR(255),
  channel VARCHAR(64) DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255),
  project_id VARCHAR(255),
  invoice_number VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  amount_cents BIGINT NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending, paid, overdue, cancelled
  pix_code TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_wiki_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(255),
  client_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) DEFAULT 'manual',
  content TEXT NOT NULL,
  author VARCHAR(255) DEFAULT 'Focussdev Team',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'open', -- open, pending, resolved, closed
  priority VARCHAR(32) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  sla_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed de Dados Iniciais
INSERT INTO platform_tasks (title, description, status, priority, due_date)
VALUES 
  ('Configurar Integração de Pagamento PIX', 'Integrar webhook do Mercado Pago para liquidação automática', 'in_progress', 'high', CURRENT_DATE + INTERVAL '2 days'),
  ('Desenvolver Tela de Kanban de Projetos', 'Construir visualização de tarefas com colunas e cards rápidos', 'done', 'urgent', CURRENT_DATE),
  ('Revisão de Arquitetura de Microserviços', 'Validar latência e isolamento dos containers na VPS', 'review', 'medium', CURRENT_DATE + INTERVAL '4 days'),
  ('Mapear Contatos do Cliente ACME', 'Cadastrar organograma de decisores e suporte técnico', 'todo', 'low', CURRENT_DATE + INTERVAL '6 days'),
  ('Backup Automatizado Diário', 'Configurar cron job para snapshot do PostgreSQL no S3/Storage', 'done', 'high', CURRENT_DATE - INTERVAL '1 day'),
  ('Automação de Boas-Vindas no WhatsApp', 'Testar disparo via WAHA quando novo lead entra pelo site', 'todo', 'medium', CURRENT_DATE + INTERVAL '3 days')
ON CONFLICT DO NOTHING;

INSERT INTO platform_deals (title, value_cents, stage, contact_name, contact_phone, contact_email)
VALUES
  ('Contrato Anual SaaS - Logística Sul', 4800000, 'proposal', 'Eduardo Ramos', '+55 41 98888-7777', 'eduardo@logistica.com.br'),
  ('Desenvolvimento Portal E-commerce - BioFarma', 2400000, 'negotiation', 'Dra. Beatriz Santos', '+55 11 97777-6666', 'beatriz@biofarma.com.br'),
  ('Expansão de Licenças Enterprise - ACME Corp', 6240000, 'won', 'Roberto Silva', '+55 11 99999-1111', 'roberto@acme.com'),
  ('Lead WhatsApp - Consultoria Cloud', 1500000, 'lead', 'Mariana Alencar', '+55 21 98111-2222', 'mariana@cloudtech.com.br'),
  ('Piloto de Inteligência Artificial para Atendimento', 3200000, 'qualified', 'Carlos Mendes', '+55 31 99222-3333', 'carlos@inovamg.com.br')
ON CONFLICT DO NOTHING;

INSERT INTO platform_invoices (invoice_number, title, amount_cents, due_date, status, pix_code)
VALUES
  ('FAT-2026-001', 'Mensalidade ACME Corporation - Setembro', 520000, CURRENT_DATE + INTERVAL '5 days', 'pending', '00020126580014br.gov.bcb.pix0136focussdev-pix-key52040000530398654075200.005802BR5910FOCUSSDEV6009SAO_PAULO62070503***6304ABCD'),
  ('FAT-2026-002', 'Setup & Onboarding Grupo Vanguarda', 490000, CURRENT_DATE + INTERVAL '28 days', 'pending', '00020126580014br.gov.bcb.pix0136focussdev-pix-key52040000530398654074900.005802BR5910FOCUSSDEV6009SAO_PAULO62070503***6304EF12'),
  ('FAT-2026-003', 'Licença Mensal Nexus Tecnologia', 380000, CURRENT_DATE - INTERVAL '2 days', 'paid', '00020126580014br.gov.bcb.pix0136focussdev-pix-key52040000530398654073800.005802BR5910FOCUSSDEV6009SAO_PAULO62070503***630499AA')
ON CONFLICT DO NOTHING;

INSERT INTO platform_wiki_articles (title, category, content)
VALUES
  ('Manual de Onboarding de Clientes', 'procedimento', '## Processo Padrão de Entrada de Clientes\n\n1. **Qualificação Comercial:** Coleta de dados cadastrais e escopo.\n2. **Contrato:** Emissão da proposta e termo de prestação de serviços.\n3. **Provisionamento:** Registro de credenciais no cofre e abertura do repositório Git.\n4. **Kick-off:** Reunião de alinhamento e início da Sprint 1.'),
  ('Guia de Arquitetura da Plataforma', 'tecnico', '## Componentes da Focussdev\n\n- **Frontend:** Shell SPA rápido distribuído na Cloudflare Edge.\n- **API Central:** Fastify com TypeScript rodando em container Linux otimizado.\n- **Banco:** PostgreSQL gerenciado com índices relacionais rápidos.\n- **Mensageria:** Integração direta com gateway WAHA para automação de WhatsApp.')
ON CONFLICT DO NOTHING;

INSERT INTO platform_tickets (title, customer_name, customer_email, status, priority, messages)
VALUES
  ('Solicitação de Novo Acesso para Equipe Financeira', 'Marina Costa', 'marina@acme.com', 'open', 'medium', '[{"sender": "customer", "text": "Precisamos adicionar o Carlos no módulo de faturamento.", "time": "Hoje 14:20"}]'::jsonb),
  ('Dúvida sobre Webhook de Liquidação PIX', 'Dev TechCorp', 'dev@techcorp.io', 'resolved', 'low', '[{"sender": "customer", "text": "O webhook envia o payload em JSON puro?", "time": "Ontem 11:00"}, {"sender": "support", "text": "Sim, o header Content-Type é application/json com HMAC de assinatura.", "time": "Ontem 11:15"}]'::jsonb)
ON CONFLICT DO NOTHING;
