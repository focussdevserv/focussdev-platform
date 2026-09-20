# 🚀 STATUS DO DEPLOYMENT — FOCUSSDEV PLATFORM

**Data:** 2026-09-20 21:44 UTC-3  
**Status:** 🟢 **8 STACKS PRINCIPAIS 100% ONLINE E INTEGRADAS**

---

## ✅ Serviços Ativos e Validados

- ✅ **DeskcommCRM** (`https://crm.focussdev.space`) — HTTP 307 (→ /app)
- ✅ **Documenso** (`https://docs.focussdev.space`) — HTTP 302 (→ /signin)
- ✅ **BookStack** (`https://wiki.focussdev.space`) — HTTP 302 (→ /login)
- ✅ **FreeScout** (`https://suporte.focussdev.space`) — HTTP 302 (→ /login)
- ✅ **Forgejo** (`https://git.focussdev.space`) — HTTP 200 (OK)
- ✅ **Uptime Kuma** (`https://status.focussdev.space`) — HTTP 302 (→ /dashboard)
- ✅ **Vaultwarden** (`https://cofre.focussdev.space`) — HTTP 200 (OK)
- ✅ **Authentik** (`https://auth.focussdev.space`) — HTTP 302 (→ /flows)
- ✅ **Supabase** — 10 containers saudáveis
- ✅ **Integration Service** — API, worker e postgres operacionais

---

## 🛡️ Embedding & Iframe (Traefik)

Todas as stacks acima possuem o middleware `focussdev-frame` aplicado com o cabeçalho:
`Content-Security-Policy: frame-ancestors 'self' https://app.focussdev.space https://*.focussdev.space https://focussdev-hub.pages.dev`
e anulação do `X-Frame-Options` para permitir navegação transparente pelo Focussdev Hub.
