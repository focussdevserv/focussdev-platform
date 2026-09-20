# Ordem oficial das stacks

1. Infraestrutura Base
2. Authentik
3. Uptime Kuma
4. Vaultwarden
5. FOCUSSDEV HUB (frontend estático no Cloudflare Pages)
6. Supabase Self-Hosted
7. n8n
8. Evolution API
9. DeskcommCRM
10. AureusERP
11. Documenso
12. Mercado Pago
13. Plane
14. Forgejo
15. BookStack
16. FreeScout
17. Integrações complementares
18. Validação ponta a ponta

Uma stack só avança quando seu checkpoint registra testes, limitações e problemas pendentes.

## Decisão de hospedagem do Hub

- `app.focussdev.space` será publicado no Cloudflare Pages para retirar da VPS o custo do portal.
- O Hub será somente a porta de entrada, menu e navegação; não duplicará dashboards.
- Authentik e todas as aplicações upstream permanecem completas e independentes em seus próprios serviços.
- APIs, webhooks, bancos e dados privados não serão movidos para o frontend estático.
- Cloudflare Access poderá ser uma camada externa de proteção, mas não substituirá o Authentik como identidade central do ecossistema.
