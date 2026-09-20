# AureusERP — Plano de Implementação (Checkpoint 09)

**Data Início:** 2026-09-20  
**Estimativa:** 3-5 dias  
**Bloqueador Atual:** Qual imagem Docker usar?

---

## Fase 1: Preparação (HOJE)

- [ ] **Decidir Stack**
  - [ ] Opção A: Odoo (ERP open-source robusto, Python)
  - [ ] Opção B: ERPNext (Frappe, Python, mais simples)
  - [ ] Opção C: Dolibarr (PHP, lightweight)
  - [ ] Opção D: Outro (qual?)
  
  **PRECISO: Você escolhe qual!** → Depois monto a imagem Docker

- [ ] Confirmar requisitos (CPU, RAM, disco)
- [ ] Reservar espaço em disco (/var/data/focussdev/aureusrp)
- [ ] Criar domínio `erp.focussdev.space`

---

## Fase 2: Setup DNS + Banco (1-2 dias)

### DNS
- [ ] `erp.focussdev.space` → IP da VPS (72.62.138.208)
- [ ] Validar propagação (`dig erp.focussdev.space`)
- [ ] Traefik labels já estão no docker-compose

### PostgreSQL
- [ ] Gerar senha segura para `aureusrp_user`
- [ ] Criar `.env` com credenciais
- [ ] Deploy do container `aureusrp-db`
- [ ] Validar conexão: `psql -h <VPS_IP> -U aureusrp_user -d aureusrp_db`

### Backup
- [ ] Setup cron para daily backup (já está no compose)
- [ ] Testar primeiro backup
- [ ] Validar arquivo `/var/backups/focussdev/aureusrp/`

---

## Fase 3: Deploy Aplicação (1 dia)

### Imagem Docker
- [ ] Confirmar imagem (Odoo? ERPNext? Dolibarr?)
- [ ] Testar pull em dev: `docker pull <imagem>`
- [ ] Atualizar docker-compose com imagem correta

### Deploy
```bash
ssh root@72.62.138.208
cd /opt/focussdev/stacks/aureusrp
docker compose -f docker-compose.aureusrp.yml up -d
```

- [ ] Banco inicializa sem erros
- [ ] App sobe sem crash
- [ ] Healthcheck: `curl https://erp.focussdev.space/health` → 200

### HTTPS
- [ ] Certificado Let's Encrypt emitido (automático via Traefik)
- [ ] Validar: `curl -I https://erp.focussdev.space` → 200
- [ ] Sem avisos de SSL

---

## Fase 4: Autenticação (1 dia)

### Authentik OIDC
- [ ] Criar application em Authentik (`aureusrp`)
- [ ] Gerar client ID + secret
- [ ] Atualizar `.env`

### Primeiro Login
- [ ] Acessar `https://erp.focussdev.space`
- [ ] Redireciona para Authentik
- [ ] Criar usuário de teste
- [ ] Login com Authentik → AureusERP
- [ ] Super-admin criado

### Fallback Nativo
- [ ] Se OIDC falhar, permitir login local (dependendo da stack)
- [ ] Testar ambos os caminhos

---

## Fase 5: Integração (1-2 dias)

### DeskcommCRM ↔ AureusERP

**Webhook:** Lead vendido → Cliente + Fatura

```
POST /api/v1/crm/finance/webhook
{
  "event": "lead.won",
  "lead_id": "uuid",
  "contact_name": "João Silva",
  "contact_email": "joao@example.com",
  "value_cents": 500000,  // R$ 5.000
  "currency": "BRL"
}
```

- [ ] Criar endpoint em AureusERP
- [ ] Criar webhook em integration-service
- [ ] Testar fluxo: CRM → Webhook → AureusERP
- [ ] Validar cliente criado
- [ ] Validar fatura gerada

### Mercado Pago ↔ AureusERP (Futuro)

```
POST /api/v1/finance/mercadopago/webhook
{
  "event": "payment.success",
  "payment_id": "xxx",
  "amount": 5000,
  "contact_id": "uuid",
  "invoice_id": "INV-001"
}
```

- [ ] Documentado, não implementado ainda
- [ ] Será feito após checkpoint 09

---

## Fase 6: Testes (1 dia)

### Teste Manual
- [ ] Criar cliente via dashboard
- [ ] Criar fatura manualmente
- [ ] Gerar PDF da fatura
- [ ] Acessar dashboard financeiro
- [ ] Validar gráficos/relatórios

### Teste de Integração
- [ ] Vender lead no CRM
- [ ] Verificar cliente criado no AureusERP
- [ ] Verificar fatura gerada
- [ ] Verificar auditoria em ambos os sistemas

### Backup + Restauração
- [ ] Primeiro backup executado
- [ ] Simular restauração em BD separado
- [ ] Validar integridade

---

## Fase 7: Monitoramento (1 dia)

### Uptime Kuma
- [ ] Criar monitor: `https://erp.focussdev.space/health`
- [ ] Configurar alertas (Slack/Email)
- [ ] Testar falha simulada

### Logs
- [ ] Docker logs acessíveis
- [ ] Sentry integrado (opcional)
- [ ] Rotação de logs configurada

---

## Fase 8: Checkpoint 09 (Final)

- [ ] Documentar estado em `checkpoints/09-aureusrp.md`
- [ ] Commitar: `stacks/aureusrp/*`, `checkpoints/09-*.md`
- [ ] Hash de containers
- [ ] Living System Checklist preenchido
- [ ] Próxima stack: Documenso

---

## ⚠️ DECISÃO NECESSÁRIA

**Qual stack usar para AureusERP?**

| Stack | Imagem Docker | Linguagem | Licença | Complexidade |
|---|---|---|---|---|
| **Odoo** | `odoo:17` | Python | AGPL | Media |
| **ERPNext** | `frappe/erpnext:latest` | Python | Frappe | Simples |
| **Dolibarr** | `dolibarr:latest` | PHP | AGPL | Simples |
| **Akaunting** | `akaunting:latest` | PHP | LGPL | Muito Simples |

**Recomendação:** ERPNext (equilíbrio entre simplicidade e funcionalidade)

**VOCÊ DECIDE E AVISA!** Depois eu atualizo o docker-compose com a imagem correta.

---

## Referências

- Status da VPS: `72.62.138.208`
- Hub: `app.focussdev.space`
- Integration Service: `services/integration-service`
- DeskcommCRM: `stacks/deskcommcrm`
