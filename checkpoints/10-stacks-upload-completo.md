# CHECKPOINT 10 — Upload de Stacks Completo

**Data:** 2026-09-20 19:30 (UTC-3)  
**Status:** ✅ Todos os docker-composes na VPS, prontos para deploy  
**Próximo:** Deploy manual com credenciais corretas

---

## 1. O que foi feito

### Upload de 6 Stacks para VPS

```
✅ AureusERP (ERPNext v15)         → /opt/focussdev/stacks/aureusrp/
✅ Documenso (Propostas/Contratos) → /opt/focussdev/stacks/documenso/
✅ Plane (Projetos/Tarefas)        → /opt/focussdev/stacks/plane/
✅ Forgejo (Git Self-Hosted)       → /opt/focussdev/stacks/forgejo/
✅ BookStack (Documentação)        → /opt/focussdev/stacks/bookstack/
✅ FreeScout (Suporte)             → /opt/focussdev/stacks/freescout/
```

### Arquivos Copiados
- ✅ docker-compose.yml para cada stack
- ✅ .env.example para stacks que tem (AureusERP)
- ⚠️ Outros stacks usam defaults nos composes

### Validação
- ✅ Conectividade SSH com VPS OK
- ✅ Diretórios criados em `/opt/focussdev/stacks/`
- ✅ Arquivos entregues com sucesso
- ✅ Nenhum container de outros projetos foi tocado

---

## 2. Estado da VPS (Isolado Focussdev)

### Rodando (LIVE)
```
DeskcommCRM (focussdevcrm-app-1, worker, scheduler) ✅
Supabase dedicado (DB, auth, storage, realtime)      ✅
Authentik (auth.focussdev.space)                     ✅
Uptime Kuma (status.focussdev.space)                 ✅
Vaultwarden (cofre.focussdev.space)                  ✅
```

### Pronto para Deploy (STAGED)
```
AureusERP (ERPNext v15)            - docker-compose.yml ✅
Documenso                          - docker-compose.yml ✅
Plane                              - docker-compose.yml ✅
Forgejo                            - docker-compose.yml ✅
BookStack                          - docker-compose.yml ✅
FreeScout                          - docker-compose.yml ✅
```

### Não Tocado (Outros Projetos)
```
credmaisapp (EasyPanel)            - Intacto ✅
evolutions                         - Intacto ✅
Firewall/Docker global             - Intacto ✅
Sistema operacional                - Intacto ✅
```

---

## 3. Próximas Ações

### OPÇÃO A: Deploy Automático (⚠️ Requer Decisão de Credenciais)

Para cada stack, executar na VPS:

```bash
cd /opt/focussdev/stacks/<stack>

# 1. Criar .env a partir do exemplo (se existir)
cp .env.example .env

# 2. Editar com valores reais
# Credenciais necessárias por stack:

# AureusERP (CRÍTICO)
#   - FRAPPE_ADMIN_PASSWORD
#   - AUREUSRP_DB_PASSWORD
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)
#   - SUPABASE_ANON_KEY (copiar de DeskcommCRM)

# Documenso
#   - DATABASE_URL
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)

# Plane
#   - POSTGRES_PASSWORD
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)

# Forgejo
#   - DB_PASSWD
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)

# BookStack
#   - DB_PASSWORD
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)

# FreeScout
#   - DB_PASSWORD
#   - OIDC_CLIENT_ID + OIDC_CLIENT_SECRET (Authentik)

# 3. Deploy
docker compose -f docker-compose.yml up -d

# 4. Validar
docker logs focussdev_<stack> -f
curl https://<stack>.focussdev.space/api/health
```

### OPÇÃO B: Deploy Guiado Step-by-Step (Recomendado)

Executar etapas em ordem:
1. ✅ FASE 1.1: Validar e ativar Authentik OIDC
2. ✅ FASE 1.2: Validar Supabase + criar tabelas
3. **PRÓXIMA:** Deploy AureusERP (dependência crítica)
4. **DEPOIS:** Deploy Documenso, Plane, Forgejo, BookStack, FreeScout (paralelo)

---

## 4. Fluxo Recomendado (Sem Risco)

### Pré-Deploy na VPS
```bash
ssh root@72.62.138.208

# Validar acesso a Authentik
curl -s https://auth.focussdev.space/.well-known/openid-configuration | jq .issuer

# Validar acesso a Supabase
curl -s https://supabase.focussdev.space/health | jq .

# Validar acesso a DeskcommCRM (verificar SUPABASE_ANON_KEY)
curl -s https://crm.focussdev.space/api/v1/health | jq .
```

### Deploy Sequencial (Recomendado)

#### 1. AureusERP (Prioridade 1)
```bash
cd /opt/focussdev/stacks/aureusrp
cp .env.example .env
# Editar .env com credenciais

# Validar antes de deploy:
cat docker-compose.yml | grep -E 'image|container_name|ports'
# Esperado:
#   image: frappe/erpnext:v15
#   container_name: focussdev_aureusrp
#   ports: 3001:8000

docker compose -f docker-compose.yml up -d
sleep 30
docker logs focussdev_aureusrp | tail -20
curl https://erp.focussdev.space/api/health
```

#### 2. Documenso + Plane + Forgejo + BookStack + FreeScout (Paralelo)
```bash
for stack in documenso plane forgejo bookstack freescout; do
  cd /opt/focussdev/stacks/$stack
  docker compose -f docker-compose.yml up -d &
done
wait
```

#### 3. Validar Tudo
```bash
docker ps --filter 'name=focussdev' --format 'table {{.Names}}\t{{.Status}}'
curl https://erp.focussdev.space/api/health
curl https://docs.focussdev.space/health  # ou equivalent
curl https://projetos.focussdev.space/health
```

---

## 5. Checklist de Deploy

### Antes de Começar
- [ ] SSH funcionando (`ssh root@72.62.138.208`)
- [ ] Authentik validado
- [ ] Supabase validado
- [ ] DeskcommCRM respondendo em HTTPS
- [ ] DNS verificado (`dig erp.focussdev.space +short` → 72.62.138.208)

### Ordem de Deploy (Sequencial)
1. [ ] AureusERP (ERPNext)
2. [ ] Documenso
3. [ ] Plane
4. [ ] Forgejo
5. [ ] BookStack
6. [ ] FreeScout

### Após Cada Deploy
- [ ] `docker logs focussdev_<stack>` — sem errors
- [ ] `curl https://<stack>.focussdev.space/api/health` — 200 OK
- [ ] Container está `healthy` após 2-3 min
- [ ] Volume está montado (sem truncated)

### Após Todo Deploy
- [ ] 12 containers rodando (6 novos + 6 existentes)
- [ ] Zero outros projetos tocados
- [ ] Nenhum volume deletado
- [ ] Nenhum container parado

---

## 6. Credenciais Faltantes (Necessárias ANTES de Deploy)

⚠️ **BLOQUEADOR:** Sem as seguintes credenciais, o deploy vai fail:

```
OBRIGATÓRIO:
  □ FRAPPE_ADMIN_PASSWORD para AureusERP
  □ AUREUSRP_DB_PASSWORD para AureusERP
  □ OIDC_CLIENT_SECRET para CADA stack (criar em Authentik)
  □ SUPABASE_ANON_KEY (copiar de DeskcommCRM)

RECOMENDADO:
  □ Senhas de banco para Documenso, Plane, Forgejo, BookStack, FreeScout
```

**Fonte de verdade:**
- Authentik Client Secrets → `https://auth.focussdev.space/admin/applications`
- Supabase Keys → `/opt/focussdev/stacks/deskcommcrm/.env` (já instalado)

---

## 7. Proteções Aplicadas

✅ **SÓ Focussdev foi tocado:**
- Diretórios: `/opt/focussdev/stacks/`
- Containers: `focussdev_*` apenas
- Redes: `focussdev-network` e `easypanel-focussdev`
- Domínios: `*.focussdev.space` apenas

❌ **Nada de outros projetos foi alterado:**
- credmaisapp — intacto
- evolutions — intacto
- Docker global — intacto
- EasyPanel — intacto
- Firewall — intacto
- SO — intacto

---

## 8. Próximo Checkpoint

**Checkpoint 11:** Deploy e Validação de AureusERP
- [ ] AureusERP rodando em HTTPS
- [ ] OIDC funcionando
- [ ] Primeiro login com Authentik
- [ ] Supabase integrado

---

## Autorização

**Status:** ✅ Pronto para deploy manual  
**Bloqueador:** Credenciais OIDC (criar em Authentik)  
**Tempo estimado:** 2-3 horas (deploy + validação)  
**Risco:** Baixo (apenas novos containers em `/opt/focussdev`)

---

*Criado por: Claude Haiku + Codex Fleet*  
*Data: 2026-09-20*  
*Próximo passo: Criar credenciais OIDC + executar deploy*
