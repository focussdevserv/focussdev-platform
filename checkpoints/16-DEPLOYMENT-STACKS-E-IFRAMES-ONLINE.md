# Checkpoint 16 — Stacks Principais e Embedding via Iframe Online

**Data:** 2026-09-20 21:42 UTC-3  
**Status:** 🟢 **8 STACKS ONLINE + CSP FRAME-ANCESTORS VALIDADO**

---

## 🎯 Resumo Executivo

Após aplicação das correções criptográficas de `APP_KEY` (AES-256), roteamento de portas do Traefik (BookStack porta 8080) e deploy automatizado dos middlewares de cabeçalho via `scripts/deploy-frame-headers.sh`, **todas as 8 aplicações principais da Focussdev Platform estão respondendo com sucesso e preparadas para exibição direta ou embutida no Focussdev Hub**.

---

## 📊 Matriz de Status e Validação HTTP Real

| Serviço | Domínio Traefik | Status HTTP | Frame Policy (CSP) | Situação |
|---|---|---|---|---|
| **DeskcommCRM** | `crm.focussdev.space` | **HTTP 307** (→ /app) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **Documenso** | `docs.focussdev.space` | **HTTP 302** (→ /signin) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **BookStack** | `wiki.focussdev.space` | **HTTP 302** (→ /login) | `frame-ancestors 'self' ...` | ✅ Online (Corrigido porta 8080) |
| **FreeScout** | `suporte.focussdev.space` | **HTTP 302** (→ /login) | `frame-ancestors 'self' ...` | ✅ Online (Corrigido APP_KEY) |
| **Forgejo** | `git.focussdev.space` | **HTTP 200** (OK) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **Uptime Kuma** | `status.focussdev.space` | **HTTP 302** (→ /dashboard) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **Vaultwarden** | `cofre.focussdev.space` | **HTTP 200** (OK) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **Authentik SSO** | `auth.focussdev.space` | **HTTP 302** (→ /flows) | `frame-ancestors 'self' ...` | ✅ Online + Saudável |
| **Supabase** | `focussdev-supabase...` | **HTTP 200** | Interno Traefik | ✅ Online + 10 containers |
| **Integration Service** | Portas internas | **HTTP 200** | API + Worker + DB | ✅ Online + Saudável |
| **AureusERP** | `erp.focussdev.space` | Container UP | `frame-ancestors 'self' ...` | 🟡 Aguardando inicialização de site |
| **Plane** | `projetos.focussdev.space` | DB + Redis UP | Configuração em andamento | 🟡 Pendente arquitetura leve de RAM |

---

## 🔧 Correções Críticas Aplicadas

1. **BookStack (`solidnerd/bookstack:latest`)**:
   - Porta interna corrigida no Traefik para **8080** (o Apache do container escuta em 8080, não 80).
   - Gerada `APP_KEY` válida em formato AES-256 (`base64:duvjy1Aw7EIoPBRmHBshmVIzqILQ8pEtPH+BtnVZDGc=`).
   - Mapeamento de volumes de storage e uploads configurado corretamente no path `/var/www/bookstack/`.

2. **FreeScout (`nfrastack/container-freescout:latest`)**:
   - Chave de aplicação corrigida para AES-256 válida gerada pelo artisan (`base64:WEWCgHNnDwAYOU6B2Q6nOgqwOFlCKeLU4iq5qqrR1hQ=`), resolvendo erro 500 de criptografia.
   - Nginx e PHP-FPM 8.5 subiram com status 302 operacional.

3. **Traefik Frame Policy Centralizada**:
   - Configurado middleware `focussdev-frame` / `focussdev-frame-policy` em todas as stacks para sobrescrever `X-Frame-Options` e liberar `Content-Security-Policy: frame-ancestors 'self' https://app.focussdev.space https://*.focussdev.space https://focussdev-hub.pages.dev`.
   - Script `scripts/deploy-frame-headers.sh` executado e homologado com sucesso na VPS.

4. **Uptime Kuma, Vaultwarden e Authentik**:
   - Arquivos estáticos dinâmicos em `/etc/easypanel/traefik/config/` sincronizados com as novas políticas de cabeçalhos.

---

## 📌 Próxima Ação Necessária (DNS Cloudflare)

Para que os novos serviços abram em qualquer navegador externo (além do curl com IP resolvido):
- Adicionar no painel da **Cloudflare** (zona `focussdev.space`):
  - Um registro Wildcard: `*` tipo `A` apontando para `72.62.138.208` (ou registros individuais para `docs`, `wiki`, `suporte`, `git`, `erp`, `projetos`).
  *(Os subdomínios `crm`, `auth`, `status`, `cofre` e `app` já estão configurados e funcionando globalmente).*
