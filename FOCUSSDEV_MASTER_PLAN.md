# 🎯 FOCUSSDEV MASTER PLAN

**Atualizado:** 2026-09-20  
**Preparado para:** Implementação sequencial + testes ponta-a-ponta  
**Prioridade:** Cliente 360° + Projeto 360°  
**Filosofia:** UMA ETAPA POR VEZ — sem saltos, sem retrabalho

---

## 📋 CLASSIFICAÇÃO DE REQUISITOS

### 🟢 STATUS: JÁ FUNCIONANDO (Verificado na VPS / Cloudflare)

```
✅ Authentik (SSO/login/permissões) — https://github.com/goauthentik/authentik — auth.focussdev.space — LIVE
✅ Uptime Kuma (monitoramento sites/APIs) — https://github.com/louislam/uptime-kuma — status.focussdev.space — LIVE  
✅ Vaultwarden (senhas/acessos) — https://github.com/dani-garcia/vaultwarden — cofre.focussdev.space — LIVE
✅ Hub Central (Shell unificado) — Cloudflare Pages — app.focussdev.space — LIVE
✅ Integration Service (microserviço webhooks/filas) — privado — LIVE
✅ DeskcommCRM (CRM/comercial) — crm.focussdev.space — LIVE (confirmar repo exato antes de alterações)
✅ WAHA (WhatsApp) — integrado ao CRM — LIVE
✅ Supabase (PostgreSQL/Storage/backend) — https://github.com/supabase/supabase — supabase.focussdev.space — LIVE
```

---

### 🟡 STATUS: PRECISA INTEGRAR (Open Source Definido / Docker pronto)

```
⏳ Plane (projetos/tarefas) — https://github.com/makeplane/plane — projetos.focussdev.space — Docker pronto, OIDC pendente
⏳ Documenso (propostas, contratos e assinaturas) — https://github.com/documenso/documenso — docs.focussdev.space — Docker pronto, OIDC pendente
⏳ Forgejo (Git self-hosted) — https://codeberg.org/forgejo/forgejo — git.focussdev.space — Docker pronto, OIDC pendente
⏳ BookStack (documentação) — https://github.com/BookStackApp/BookStack — wiki.focussdev.space — Docker pronto, OIDC pendente
⏳ FreeScout (suporte/tickets) — https://github.com/freescout-help-desk/freescout — suporte.focussdev.space — Docker pronto, OIDC pendente
⏳ AureusERP (financeiro/operação) — erp.focussdev.space — Docker pronto (confirmar repo exato antes de alterações)
```

---

### 🔵 STATUS: FORNECIDO POR OPEN SOURCE (Aplicações complementares sob demanda)

> **Regra de Custo e Recursos:** NÃO encher a VPS de novos containers sem necessidade. Antes de subir, verificar se a função já existe nos sistemas acima, via API/webhook ou código próprio leve.

```
🔹 Evolution API (WhatsApp) — https://github.com/EvolutionAPI/evolution-api — sob demanda (avaliar vs WAHA)
🔹 Stirling-PDF (ferramentas PDF) — https://github.com/Stirling-Tools/Stirling-PDF — sob demanda
🔹 Gotenberg (geração/conversão PDF) — https://github.com/gotenberg/gotenberg — sob demanda
🔹 Formbricks (formulários/briefings/feedback) — https://github.com/formbricks/formbricks — sob demanda
🔹 Beszel (monitoramento de servidor) — https://github.com/henrygd/beszel — sob demanda
```

---

### 🟠 STATUS: PRECISA SER DESENVOLVIDO NO FOCUSSDEV

```
1️⃣ CLIENTE 360°
   - Visão unificada de UM cliente
   - Dados de: CRM, AureusERP, Plane, Documenso, FreeScout, BookStack
   - Não duplicar dados — apenas agregar APIs reais
   
2️⃣ PROJETO 360°
   - Visão unificada de UM projeto
   - Dados de: Plane, Forgejo, BookStack, AureusERP, Documenso, FreeScout, monitoring
   - Status, tarefas, PRs, documentação, financeiro, suporte, uptime
   
3️⃣ GLOBAL CLIENT ID & PROJECT ID
   - Mapeamento único entre sistemas (xref tables)
   - DeskcommCRM lead_id ↔ AureusERP customer_id ↔ Plane customer_id, etc.
   - DeskcommCRM deal_id ↔ Plane project_id ↔ Forgejo repo_id, etc.
   - Tabela: integration_links (já estruturada)

4️⃣ TIMELINE UNIFICADA
   - Feed agregado: CRM → Docs → Contrato → Pagamento → Projeto → Release → Suporte
   - Ordem cronológica
   - Filtros por tipo de evento

5️⃣ CENTRAL DE ASSETS (Ativos)
   - Domínios
   - Repositórios
   - Documentação (páginas BookStack)
   - Bancos de dados
   - Chaves/certificados (via Vaultwarden)

6️⃣ CENTRAL DE LINKS
   - Clientes → Projetos (1-N)
   - Projetos → Repositórios (1-N)
   - Projetos → Documentação (1-N)
   - Projetos → Domínios (1-N)
   - Projetos → Monitoramento (1-N)
   - Projetos → Suporte (1-N)

7️⃣ DASHBOARD VENCIMENTOS
   - Próximas faturas vencendo (AureusERP)
   - Próximas renovações de domínio
   - Próximos contratos vencendo (Documenso)
   - Próximos certificados expirando

8️⃣ BUSCA GLOBAL
   - Clientes (CRM)
   - Projetos (Plane + Forgejo)
   - Documentos (BookStack)
   - Tickets (FreeScout)
   - Repositórios (Forgejo)
   - Cross-references

9️⃣ MEU DIA AGREGADO
   - Tarefas do dia (Plane)
   - Conversas/suporte (FreeScout)
   - Leads qualificados (CRM)
   - Alertas de monitoramento (Uptime Kuma)
   - Reuniões (Google Calendar integration)

🔟 VISÃO GERAL DA CARTEIRA (Portfolio)
   - Clientes ativos vs inativos
   - Receita MRR (AureusERP)
   - Projetos em execução vs completos
   - Health score por projeto (base em monitoramento)

1️⃣1️⃣ ONBOARDING & ENCERRAMENTO
   - Fluxo: CRM → Documenso → AureusERP → Plane → Forgejo → BookStack
   - Checklist automático para cada etapa
   - Documentação gerada (template BookStack)
   - Repositório criado com estrutura padrão
   - Domínio registrado/apontado

1️⃣2️⃣ MAPA DO CLIENTE
   - Organograma de contatos
   - Responsabilidades por projeto
   - Histórico de comunicação (CRM + FreeScout)
   - Preferências de contato
```

---

### 🔴 STATUS: INTEGRAÇÃO EXTERNA (APIs terceiros)

```
✅ Mercado Pago — webhooks de pagamento
✅ GitHub — OAuth + importação de repositórios
✅ Meta Ads/Lead Ads — API de leads entrantes
✅ Google Ads — dados de campanhas
✅ Google Analytics — métricas de sites
✅ Google Search Console — performance de SEO
✅ Google Calendar — reuniões agendadas
✅ Google Drive — documentos compartilhados
✅ Cloudflare — DNS + WAF
✅ BrasilAPI — CEP/CNPJ/validações
✅ Resend — envio de e-mails
✅ NFS-e — emissão de notas fiscais eletrônicas
```

---

### 🟣 STATUS: DUPLICADO/DESNECESSÁRIO

```
❌ n8n — Removido (usar integrações diretas na API)
❌ Zapier/Make — Removido (usar webhooks nativos)
❌ Banco de dados adicional — Usar Supabase único
❌ Cache adicional (Redis) — Usar Supabase Realtime
❌ Message queue (Bull/RabbitMQ) — Usar event_log + cron
❌ Segunda aplicação CRM — Usar DeskcommCRM + AureusERP
❌ Dashboard customizado — Usar visões dos open source
```

---

### ⏳ STATUS: PENDENTE (Aguardando confirmação)

```
❓ DeskcommCRM — URL exata do repositório?
❓ AureusERP — URL exata do repositório?
❓ Qual ERP para usar? (ERPNext, Odoo, AureusERP, outro?)
❓ Necessário Evolution API além de WAHA?
❓ Necessário Stirling-PDF ou Gotenberg?
```

---

## 🔄 ORDEM DE IMPLEMENTAÇÃO (Sequencial)

### **FASE 1: INFRA & AUTENTICAÇÃO (Dias 1-3)**

Dependência: Nada — foundation

```bash
ETAPA 1.1: Validar Authentik + OIDC
├─ Verificar credenciais de acesso
├─ Testar OIDC em Plane/Documenso/Forgejo/BookStack/FreeScout
├─ Gerar Client IDs/Secrets
└─ CHECKPOINT: 10-oidc-setup.md

ETAPA 1.2: Validar Supabase
├─ Credenciais de acesso
├─ Criar tabelas faltantes (integration_links, integration_jobs, etc)
├─ Testar conexões de todos os serviços
└─ CHECKPOINT: 11-supabase-integration.md
```

---

### **FASE 2: MAPEAMENTO DE IDENTIDADES (Dias 4-6)**

Dependência: FASE 1 (Authentik + Supabase)

```bash
ETAPA 2.1: Criar tabela integration_links (se não existir)
├─ Coluna source_system (deskcommcrm, aureusrp, plane, forgejo, etc)
├─ Coluna source_id (UUID do registro externo)
├─ Coluna target_systems (JSONB com IDs em outros sistemas)
├─ Índices por (org, source_system, source_id)
└─ CHECKPOINT: 12-integration-xref.md

ETAPA 2.2: Criar API /api/v1/integration/xref
├─ GET /integration/xref/client/{source_id}
│   → retorna cliente em TODOS os sistemas
├─ GET /integration/xref/project/{source_id}
│   → retorna projeto em TODOS os sistemas
├─ POST /integration/xref
│   → criar/atualizar mapeamento
└─ CHECKPOINT: 13-xref-api.md
```

---

### **FASE 3: CLIENTE 360° (Dias 7-10)**

Dependência: FASE 2 (xref)

```bash
ETAPA 3.1: Frontend Cliente 360°
├─ GET /api/v1/clients/{client_id}/overview
│   ├─ Dados CRM (leads, funnel, histórico)
│   ├─ Dados AureusERP (faturas, recebimentos, MRR)
│   ├─ Projetos Plane vinculados
│   ├─ Contratos Documenso
│   ├─ Tickets FreeScout abertos
│   └─ Documentação BookStack
├─ Layout: 
│   └─ Header: Nome, email, status, ações
│   └─ Tabs: Visão Geral | Projetos | Contratos | Financeiro | Suporte | Docs | Timeline
└─ CHECKPOINT: 14-cliente-360-frontend.md

ETAPA 3.2: Agregação de APIs
├─ Service /lib/clients/aggregator.ts
│   ├─ fetchCRMData(customerId)
│   ├─ fetchFinancialData(aureusId)
│   ├─ fetchProjects(planeOrgId)
│   ├─ fetchContracts(documensoEmail)
│   ├─ fetchTickets(freescoutCustomerId)
│   └─ fetchDocs(bookstackCustomerId)
├─ Timeout: 5s por API, fallback se ≥2 APIs falharem
└─ CHECKPOINT: 15-cliente-360-backend.md

ETAPA 3.3: Testes E2E
├─ Selecionar cliente de teste (com dados reais)
├─ Verificar exibição de cada seção
├─ Teste de timeout/erro em APIs
└─ CHECKPOINT: 16-cliente-360-e2e.md
```

---

### **FASE 4: PROJETO 360° (Dias 11-14)**

Dependência: FASE 2 (xref)

```bash
ETAPA 4.1: Frontend Projeto 360°
├─ GET /api/v1/projects/{project_id}/overview
│   ├─ Dados Plane (tarefas, ciclos, status)
│   ├─ Repositório Forgejo (branches, PRs, último commit)
│   ├─ Documentação BookStack
│   ├─ Financeiro AureusERP (fatura, recebimento, MRR)
│   ├─ Contrato Documenso (status, assinaturas)
│   ├─ Tickets FreeScout (abertos, SLA)
│   ├─ Monitoramento Uptime Kuma (uptime %, últimos alertas)
│   └─ Timeline
├─ Layout:
│   └─ Header: Nome, cliente, status, ações
│   └─ Tabs: Visão Geral | Tarefas | Código | Docs | Contrato | Financeiro | Suporte | Monit | Timeline
└─ CHECKPOINT: 17-projeto-360-frontend.md

ETAPA 4.2: Agregação de APIs
├─ Service /lib/projects/aggregator.ts
│   ├─ fetchPlaneData(projectId)
│   ├─ fetchGitData(forgejoRepo)
│   ├─ fetchDocsData(bookstackProject)
│   ├─ fetchFinancialData(aureusId)
│   ├─ fetchContractData(documensoId)
│   ├─ fetchSupportData(freescoutId)
│   └─ fetchMonitoringData(uptimeKumaMonitor)
├─ Timeout: 5s por API, fallback
└─ CHECKPOINT: 18-projeto-360-backend.md

ETAPA 4.3: Testes E2E
├─ Selecionar projeto de teste
├─ Verificar cada tab carregando dados
├─ Teste de status real vs expirado
└─ CHECKPOINT: 19-projeto-360-e2e.md
```

---

### **FASE 5: TIMELINE UNIFICADA (Dias 15-17)**

Dependência: FASE 3-4 (Cliente 360° + Projeto 360°)

```bash
ETAPA 5.1: Agregar eventos de todas as fontes
├─ CRM: lead criado, qualificado, ganho, perdido
├─ Documenso: proposta enviada, contrato assinado
├─ AureusERP: fatura criada, paga
├─ Plane: projeto criado, tarefa concluída
├─ Forgejo: commit, PR criado, release
├─ BookStack: documento criado/atualizado
├─ FreeScout: ticket criado, respondido, fechado
├─ Uptime Kuma: status mudou, alerta
└─ Tabela: events (org_id, client_id, project_id, event_type, timestamp, data)

ETAPA 5.2: GET /api/v1/timeline?client_id=X&project_id=Y
├─ Retornar últimos 100 eventos
├─ Ordem: DESC timestamp
├─ Filtros: por tipo, por data
└─ Resposta: { event_type, timestamp, title, description, source_system, link }

ETAPA 5.3: UI Timeline
├─ Componente: <Timeline events={events} />
├─ Visual: vertical line com cards
├─ Cards: clicáveis para detalhes
└─ CHECKPOINT: 20-timeline.md
```

---

### **FASE 6: DASHBOARD VENCIMENTOS (Dias 18-19)**

Dependência: FASE 2 (xref)

```bash
ETAPA 6.1: Agregar vencimentos
├─ AureusERP: próximas faturas (próximos 30 dias)
├─ Documenso: contratos vencendo
├─ Domínios: renovações (via WHOIS ou anotação manual)
├─ Certificados SSL: via Let's Encrypt API ou anotação
└─ Tabela: deadlines (org_id, type, due_date, client_id, project_id, metadata)

ETAPA 6.2: GET /api/v1/deadlines?days_ahead=30
├─ Retornar deadlines ordenados por data
├─ Resposta: { type, due_date, client_name, project_name, link }

ETAPA 6.3: UI Dashboard
├─ Componente: <DeadlinesList />
├─ Cores: red (vencido), orange (hoje), yellow (semana), green (OK)
├─ Ações: marcar concluído, adiar, criar tarefa
└─ CHECKPOINT: 21-deadlines.md
```

---

### **FASE 7: BUSCA GLOBAL (Dias 20-21)**

Dependência: FASE 1-6 (tudo)

```bash
ETAPA 7.1: Indexar todos os dados
├─ Clientes (CRM)
├─ Projetos (Plane + Forgejo)
├─ Documentos (BookStack)
├─ Tickets (FreeScout)
├─ Repositórios (Forgejo)
├─ Tabela: search_index (org_id, type, title, description, link, updated_at)

ETAPA 7.2: GET /api/v1/search?q=termo
├─ Buscar em TODOS os tipos
├─ Retornar top 50 resultados
├─ Resposta: { type, title, description, link, score }

ETAPA 7.3: UI Busca
├─ Input no header (sempre visível)
├─ Dropdown com resultados em tempo real
├─ Resultado click → navega
└─ CHECKPOINT: 22-global-search.md
```

---

### **FASE 8: MEU DIA AGREGADO (Dias 22-23)**

Dependência: FASE 1-7 (tudo)

```bash
ETAPA 8.1: Coletar eventos do "dia"
├─ Tarefas Plane (assigned_to = user, due_date = today)
├─ Conversas FreeScout (assigned_to = user, updated_today)
├─ Leads CRM (assigned_to = user, created_today ou updated_today)
├─ Alertas Uptime Kuma (triggered_today)
├─ Reuniões Google Calendar (today)
├─ Commits Forgejo (author = user, created_today)
└─ Tabela: dashboard_daily (user_id, org_id, event_type, count, data)

ETAPA 8.2: GET /api/v1/my-day
├─ Retornar agregado do dia (por tipo e contagem)
├─ Resposta: { tasks_count, support_count, leads_count, alerts_count, meetings, commits }

ETAPA 8.3: UI Meu Dia
├─ Componente: <MyDay />
├─ Layout: grid 2x3 com cards
├─ Cards: clicáveis para listar detalhes
└─ CHECKPOINT: 23-my-day.md
```

---

### **FASE 9: CENTRAL DE ASSETS (Dias 24-25)**

Dependência: FASE 6 (deadlines)

```bash
ETAPA 9.1: Inventariar ativos por projeto
├─ Domínios (manual + whois check)
├─ Repositórios (Forgejo + GitHub)
├─ Documentação (BookStack projects)
├─ Bancos de dados (anotação)
├─ Chaves/Certificados (Vaultwarden)
├─ Monitoramento (Uptime Kuma monitors)
└─ Tabela: assets (org_id, project_id, type, name, url, status, last_check)

ETAPA 9.2: GET /api/v1/assets?project_id=X
├─ Retornar todos os ativos do projeto
├─ Status: online, offline, warning, expired

ETAPA 9.3: UI Assets
├─ Componente: <AssetsList />
├─ Filtros: por tipo
├─ Ações: atualizar, renew, detalhes
└─ CHECKPOINT: 24-assets.md
```

---

### **FASE 10: CENTRAL DE LINKS (Dias 26-27)**

Dependência: FASE 2 (xref) + FASE 3-4 (Cliente/Projeto 360°)

```bash
ETAPA 10.1: UI Links
├─ Na página Cliente 360°: mostrar todos os projetos
├─ Na página Projeto 360°: mostrar cliente, repositórios, docs, domínios
├─ Componente: <RelationshipMap />

ETAPA 10.2: Atualizar xref em tempo real
├─ Quando criar projeto no Plane → associar ao cliente
├─ Quando criar repo no Forgejo → associar ao projeto
├─ Quando criar doc no BookStack → associar ao projeto
└─ Webhooks que atualizam integration_links

ETAPA 10.3: Testes
├─ Criar cliente → criar projeto → ver associado
├─ Criar repo → aparecer em Projeto 360°
└─ CHECKPOINT: 25-links.md
```

---

### **FASE 11: VISÃO GERAL CARTEIRA (Dias 28)** 

Dependência: FASE 3-9 (tudo agregado)

```bash
ETAPA 11.1: Dashboard Portfolio
├─ Clientes ativos vs inativos (status)
├─ Receita MRR (soma AureusERP)
├─ Projetos em execução vs completos (contagem Plane)
├─ Health score por projeto (base Uptime Kuma)
├─ Churn rate (clientes perdidos último mês)
└─ Receita previsível vs realizado (Plane vs AureusERP)

ETAPA 11.2: GET /api/v1/portfolio/overview
├─ Retornar métricas agregadas
├─ Charts: line (receita), pie (clientes), bar (projetos)

ETAPA 11.3: UI Portfolio
├─ Componente: <PortfolioOverview />
├─ Design: cards + charts
└─ CHECKPOINT: 26-portfolio.md
```

---

### **FASE 12: ONBOARDING & ENCERRAMENTO (Dias 29-30)**

Dependência: FASE 1-11 (tudo)

```bash
ETAPA 12.1: Fluxo Onboarding Automático
├─ Checklist:
│   ├─ Criar cliente em CRM
│   ├─ Criar contato AureusERP
│   ├─ Criar projeto Plane
│   ├─ Criar repositório Forgejo
│   ├─ Criar documentação BookStack
│   ├─ Criar monitor Uptime Kuma
│   ├─ Enviar boas-vindas por e-mail (Resend)
│   └─ Gerar template documentação
└─ Ordem: responder dependências

ETAPA 12.2: Fluxo Encerramento
├─ Checklist:
│   ├─ Finalizar projeto Plane (archivado)
│   ├─ Desativar deploy (Forgejo)
│   ├─ Arquivar documentação (BookStack)
│   ├─ Encerrar monitoramento (Uptime Kuma)
│   ├─ Marcar cliente como inativo (CRM)
│   ├─ Mover para "archive" (AureusERP)
│   └─ Backup final

ETAPA 12.3: UI Onboarding
├─ Componente: <OnboardingFlow />
├─ Design: steps com validação
├─ Notificações: por passo
└─ CHECKPOINT: 27-onboarding.md
```

---

## 🧪 CRONOGRAMA ESTIMADO

```
TOTAL: ~30 dias (dias úteis)

Semana 1 (5 dias):
  ├─ Dias 1-3: FASE 1 (Authentik + Supabase)
  └─ Dias 4-5: FASE 2 (Mapeamento xref)

Semana 2 (5 dias):
  ├─ Dias 6-8: FASE 3 (Cliente 360°)
  └─ Dias 9-10: FASE 4 (Projeto 360°)

Semana 3 (5 dias):
  ├─ Dias 11-12: FASE 5 (Timeline)
  ├─ Dias 13-14: FASE 6 (Vencimentos)
  └─ Dias 15: FASE 7 (Busca)

Semana 4 (5 dias):
  ├─ Dias 16-17: FASE 8 (Meu Dia)
  ├─ Dias 18-19: FASE 9 (Assets)
  └─ Dias 20: FASE 10 (Links)

Semana 5 (5 dias):
  ├─ Dias 21: FASE 11 (Portfolio)
  └─ Dias 22-25: FASE 12 (Onboarding)

Semana 6 (adaptável):
  └─ Testes E2E + Ajustes finais
```

---

## ✅ CHECKLIST POR ETAPA

### Antes de cada etapa:
- [ ] Ler checkpoint anterior (se existe)
- [ ] Verificar que dados anteriores não foram apagados
- [ ] Testar autenticação
- [ ] Validar conectividade com APIs

### Ao fim de cada etapa:
- [ ] Código commitado
- [ ] Testes passando (unit + E2E)
- [ ] Frontend testado manualmente
- [ ] Backend testado com curl/Postman
- [ ] Banco de dados validado
- [ ] Persistência verificada (restart container)
- [ ] Autenticação funcionando
- [ ] Integrações testadas
- [ ] Checkpoint criado (nome: NN-descricao.md)
- [ ] Documentação atualizada

### Checkpoint deve incluir:
```markdown
# Checkpoint NN — Descrição

**Data:** 2026-09-XX
**Etapa:** N.N (FASE)
**Objetivo:** O que foi feito

## ✅ Concluído
- [ ] Item 1
- [ ] Item 2

## 📊 Evidência
- Comando rodado
- Saída esperada
- Screenshot/link

## 🔒 Proteções
- [ ] Dados anteriores preservados
- [ ] Rollback possível (comando)
- [ ] Backup feito

## 🚫 Próxima etapa NÃO PODE
- Deletar tabela X
- Alterar Dockerfile
- Resetar credenciais
```

---

## 🚨 RESTRIÇÕES CRÍTICAS E SEGURANÇA DA VPS

### 🛑 REGRAS MANDATÓRIAS DA VPS:
- **JAMAIS** reinstalar Docker, EasyPanel, sistema operacional ou infraestrutura saudável da VPS.
- **JAMAIS** executar `docker system prune`, `docker volume prune` ou qualquer comando de limpeza global.
- **JAMAIS** apagar ou modificar containers, bancos, volumes ou redes sem provar que pertencem exclusivamente ao Focussdev antigo.
- **PROTEGER** integralmente outros projetos em produção na mesma VPS (`credmaisapp`, `evolutions`, etc.).
- O Focussdev antigo pode ser substituído, mas **somente** seus recursos exclusivos podem ser tocados.

### 💰 REGRAS DE CUSTO E RECURSOS:
- **NÃO** contratar novos serviços pagos.
- **NÃO** encher a VPS com novos containers desnecessários.
- Antes de adicionar qualquer ferramenta, verificar se a função já existe nos sistemas escolhidos, se pode ser atendida por API/webhook oficial, biblioteca leve ou código do próprio Focussdev.

### 🛡️ DISCIPLINA DE EXECUÇÃO:
- **UMA ETAPA POR VEZ:** Sem saltos, sem implementar tudo de uma vez.
- **TESTES OBRIGATÓRIOS:** Ao terminar cada etapa, testar frontend, backend, banco, persistência, autenticação e integrações.
- **CHECKPOINT OBRIGATÓRIO:** Criar checkpoint documentando o que foi feito e o que a próxima etapa NÃO PODE alterar.
- **NUNCA INVENTAR ROTAS/APIs:** Inspecionar a versão real instalada e a documentação upstream antes de integrar.

---

## 📞 PRÓXIMOS PASSOS AGORA

### Pré-requisitos para começar:

1. **Confirmar URLs dos repositórios:**
   ```
   [ ] DeskcommCRM — https://github.com/...
   [ ] AureusERP — https://github.com/...
   ```

2. **Validar infraestrutura VPS:**
   ```bash
   # Na VPS:
   docker ps | grep -E "authentik|uptime-kuma|deskcommcrm|aureusrp|plane|forgejo|bookstack|freescout"
   docker inspect <container> | grep -E "Status|IPAddress"
   curl https://auth.focussdev.space/api/health
   curl https://app.focussdev.space/api/health
   ```

3. **Validar conectividade Supabase:**
   ```bash
   # Tentar conexão
   psql $DATABASE_URL -c "SELECT version();"
   ```

4. **Começar FASE 1:**
   - Testar OIDC em 1 sistema (Plane)
   - Validar Supabase
   - Criar primeiro checkpoint

---

## 🎯 Objetivo Final

```
Dia 1: Log no Focussdev (Authentik)
  ↓
Navegar para Cliente X
  ↓
Ver Cliente 360° (CRM + financeiro + projetos + contratos + suporte + docs)
  ↓
Clicar em Projeto Y
  ↓
Ver Projeto 360° (tarefas + código + documentação + financeiro + suporte + monit)
  ↓
Clicar em link → vai direto para a fonte (Plane/Forgejo/BookStack/etc)
  ↓
Tudo funciona, tudo sincronizado, zero duplicação, zero manual.
```

---

**Próximo:** Você confirma as URLs de DeskcommCRM e AureusERP, e começamos FASE 1!
