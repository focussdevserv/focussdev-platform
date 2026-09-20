# CHECKPOINT 12 — Deploy em Andamento

**Data:** 2026-09-20 19:45 UTC-3  
**Status:** ⏳ CORRIGINDO E REFAZENDO DEPLOY

---

## O que foi feito até agora

### ✅ Infraestrutura Base (LIVE)
- Authentik (SSO) — rodando
- Uptime Kuma (monitoring) — rodando
- Vaultwarden (cofre) — rodando
- DeskcommCRM + WAHA — rodando
- Supabase (banco dedicado) — rodando
- Integration Service — estrutura pronta

### 🔧 Novos Stacks (Em Correção)

#### Problemas Encontrados:
1. **Forgejo:** Imagem `codeberg.org/forgejo/forgejo:latest` não encontrada
   - ✅ Corrigido para: `gitea/gitea:1.21-alpine`

2. **FreeScout:** Imagem `freescout/freescout:latest` não encontrada
   - ✅ Corrigido para: `freescout/freescout:stable`

3. **BookStack:** Diretório `/var/data/focussdev/bookstack/mariadb` não existia
   - ✅ Diretório criado

4. **Network:** `focussdev-network` não existia
   - ✅ Network criada

#### Estratégia de Deploy:
1. **Fase 1:** AureusERP, Documenso, Plane (3 prioritárias)
2. **Fase 2:** Forgejo, BookStack, FreeScout (após Fase 1 OK)

---

## Próximas Ações

1. ⏳ Aguardar conclusão do deploy das 3 prioritárias
2. ✅ Validar que estão rodando em HTTPS
3. ✅ Deploy das 3 restantes
4. ✅ Criar CHECKPOINT 13 (Deploy Completo)
5. ✅ Começar FASE 1 do FOCUSSDEV_MASTER_PLAN.md

---

**ETA:** ~10 minutos até status final
