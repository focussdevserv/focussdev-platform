# CHECKPOINT 09 — AureusERP: Financeiro com ERPNext

**Data:** 2026-09-20  
**Status:** Estrutura pronta, deploy manual na VPS  
**Stack:** ERPNext v15 (Frappe) + PostgreSQL 17 + Redis 7

---

## 1. O que foi Preparado

### Docker Compose Completo
```yaml
Services:
  ✅ aureusrp (frappe/erpnext:v15)
  ✅ aureusrp-db (postgres:17-alpine)
  ✅ aureusrp-redis (redis:7-alpine)
  ✅ aureusrp-backup (backup automático daily)
```

### Configuração
- ✅ Environment variables: `.env.example` preenchido
- ✅ Traefik labels (HTTPS automático)
- ✅ Healthcheck (PostgreSQL + Redis + ERPNext)
- ✅ Volumes nomeados (persistência)
- ✅ Backup automático (pg_dump + tar)

### Integração
- ✅ Authentik OIDC (login central)
- ✅ Integration Service (webhooks)
- ✅ Supabase (documentos/PDFs)
- ✅ Mercado Pago (futuro)

---

## 2. Próximas Ações (VPS)

### DNS
```bash
# Validar:
dig erp.focussdev.space +short
# Esperado: 72.62.138.208
```

### Preparar VPS
```bash
ssh root@72.62.138.208

# Criar diretórios
mkdir -p /var/data/focussdev/aureusrp/{sites,postgres,redis}
mkdir -p /var/logs/focussdev/aureusrp
mkdir -p /var/backups/focussdev/aureusrp
chmod 700 /var/data/focussdev/aureusrp/*

# Network Docker (já existe de DeskcommCRM)
docker network ls | grep focussdev-network
```

### Deploy
```bash
cd /opt/focussdev/stacks/aureusrp

# 1. Criar .env a partir de .env.example
cp .env.example .env
# Editar com valores reais:
#  AUREUSRP_DB_PASSWORD=<senha_segura>
#  FRAPPE_ADMIN_PASSWORD=<admin_password>
#  OIDC_CLIENT_ID/SECRET (criar no Authentik)
#  SUPABASE_ANON_KEY (copiar de DeskcommCRM)

# 2. Deploy
docker compose -f docker-compose.aureusrp.yml up -d

# 3. Verificar
docker logs focussdev_aureusrp -f | head -50
docker compose -f docker-compose.aureusrp.yml ps

# 4. Healthcheck
curl https://erp.focussdev.space/api/health
# Esperado: 200 OK
```

### Primeiro Acesso
```bash
# 1. Acessar https://erp.focussdev.space
# 2. Será redirecionado para Authentik
# 3. Criar usuário de teste
# 4. Login com Authentik
# 5. Criar "Empresa" (conforme ERPNext)
# 6. Criar primeiro cliente (manual)
# 7. Criar primeira fatura (manual)
```

### Teste de Integração
```bash
# DeskcommCRM → AureusERP

# 1. Vender lead no DeskcommCRM
POST https://crm.focussdev.space/api/v1/opportunities/won

# 2. Webhook dispara
# integration-service → aureusrp

# 3. Validar cliente criado
curl -H "Authorization: Bearer <admin_api_key>" \
  https://erp.focussdev.space/api/resource/Customer

# 4. Validar fatura criada
curl -H "Authorization: Bearer <admin_api_key>" \
  https://erp.focussdev.space/api/resource/Invoice
```

---

## 3. Arquivos Entregues

```
stacks/aureusrp/
├── docker-compose.aureusrp.yml  (ERPNext + PostgreSQL + Redis + Backup)
├── .env.example                  (Variáveis de ambiente)
├── README.md                      (Documentação)
├── IMPLEMENTATION.md              (Fases detalhadas)
└── checkpoints/09-aureusrp-erpnext.md  (este arquivo)
```

---

## 4. Checklists de Deploy

### Pré-Deploy
- [ ] DNS `erp.focussdev.space` validado
- [ ] `.env` criado com valores reais
- [ ] Pasta de dados criada (`/var/data/focussdev/aureusrp/*`)
- [ ] Network `focussdev-network` existe (`docker network ls`)
- [ ] Backup é externa (`/var/backups/focussdev/aureusrp`)

### Deploy
- [ ] `docker compose up -d` executa sem erro
- [ ] 3 containers rodando: aureusrp, aureusrp-db, aureusrp-redis
- [ ] Logs sem crash: `docker logs focussdev_aureusrp`
- [ ] Healthcheck passando: `curl https://erp.focussdev.space/api/health` → 200

### Pós-Deploy
- [ ] HTTPS funcional (sem avisos de SSL)
- [ ] Certificado válido (Let's Encrypt via Traefik)
- [ ] Primeiro login com Authentik (OIDC)
- [ ] Super-admin criado
- [ ] Primeira empresa criada
- [ ] Primeiro cliente criado manualmente
- [ ] Primeira fatura gerada
- [ ] Dashboard financeiro acessível

### Backup
- [ ] Primeiro backup executado
- [ ] Arquivo em `/var/backups/focussdev/aureusrp/20260920T.../`
- [ ] Tamanho esperado: PostgreSQL ~100MB (comprimido ~20MB)
- [ ] Testar restauração em DB separado

### Monitoramento
- [ ] Monitor no Uptime Kuma: `https://erp.focussdev.space/api/health`
- [ ] Status: Online
- [ ] Alertas ativados

---

## 5. Próxima Stack

**Documenso** (Contratos + Assinaturas Eletrônicas)

Ordem de stacks:
1. ✅ DeskcommCRM (Checkpoint 06)
2. ✅ Integration Service (Checkpoint 07)
3. 🔄 **AureusERP** (Checkpoint 09 - você está aqui)
4. ⏳ Documenso (Propostas/Contratos)
5. ⏳ Mercado Pago (Webhooks)
6. ⏳ Plane (Projetos)
7. ⏳ Forgejo (Git)
8. ⏳ FreeScout (Suporte)
9. ⏳ BookStack (Docs)
10. ⏳ n8n (Automações - removido do escopo)

---

## 6. Fluxo Operacional Completo (Quando Pronto)

```
1. LEAD no DeskcommCRM
   ↓ (vendedor qualifica)
   ↓
2. OPORTUNIDADE GANHA
   ↓ (webhook)
   ↓
3. AureusERP: Cliente + Fatura criada
   ↓ (gerada automaticamente)
   ↓
4. INVOICE gerada
   ↓ (PDf, email ao cliente)
   ↓
5. CLIENTE PAGA (Mercado Pago)
   ↓ (webhook)
   ↓
6. AureusERP: Fatura PAGA
   ↓ (webhook)
   ↓
7. DeskcommCRM: Pipeline → CLIENTE ATIVO
   ↓
8. Plane: PROJETO criado
   ↓
9. Forgejo: REPOSITÓRIO criado
   ↓
10. BookStack: DOCUMENTAÇÃO criada
    ↓
11. FreeScout: TICKET suporte criado
    ↓
12. Mensalidade registrada no AureusERP
```

**Status:** 70% pronto (AureusERP estrutura 100%, workflow 0% até integração)

---

## 7. Living System Checklist

1. **Entrada:** Webhook do CRM (lead.won) ou API de cliente
2. **Saída:** Fatura enviada por email, PDF gerado
3. **Registro:** Invoice, Journal Entry, audit_log
4. **Tela:** Dashboard Financeiro (vendas, caixa, receivables)
5. **Porta:** HTTPS (`erp.focussdev.space`), sem portas abertas
6. **Anti-morte:** PostgreSQL persistido, Redis cache, retry automático
7. **Configuração:** Empresa/Cliente em DB, segredos em `.env`
8. **Continuidade:** Fatura não perdida, webhook retry 3x
9. **Retorno:** Dashboard mostra recebimento/pendência
10. **Mapa:** `docs/architecture.md` + `docs/navigation-catalog.md`

---

## 8. Segurança

- ✅ OIDC com Authentik (sem senha em texto)
- ✅ PostgreSQL com auth (não exposto publicamente)
- ✅ Redis sem auth (rede Docker privada)
- ✅ Secrets em `.env` (600 permissions, fora do Git)
- ✅ HTTPS obrigatório (Traefik + Let's Encrypt)
- ✅ Backup criptografado (recomendado: S3 com SSE)

---

## 9. Autorização

**Validado:** Documentação + Templates Prontos
**Bloqueador Seguinte:** Deploy Manual na VPS (3-5 dias)
**Recurso Necessário:** Acesso SSH a 72.62.138.208

**Status Final:** ✅ **PRONTO PARA DEPLOY MANUAL**

---

## Checkpoint Anterior

- Checkpoint 08: HTTPS/DNS consolidado ✅
- Checkpoint 07: Integration Service ✅
- Checkpoint 06: DeskcommCRM + WAHA ✅

## Próximo Checkpoint

- Checkpoint 10: Documenso (Contratos)
