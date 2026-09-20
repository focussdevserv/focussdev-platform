# Ordem oficial das stacks

1. Infraestrutura Base
2. Authentik
3. Uptime Kuma
4. Vaultwarden
5. FOCUSSDEV HUB (frontend estático no Cloudflare Pages)
6. Supabase Self-Hosted
7. DeskcommCRM + WAHA
8. AureusERP
9. Documenso
10. Mercado Pago
11. Plane
12. Forgejo
13. FreeScout
14. BookStack
15. n8n
16. Integrações complementares (Resend, Google Calendar, BrasilAPI/ReceitaWS e NFS-e)
17. Validação ponta a ponta

Uma stack só avança quando seu checkpoint registra testes, limitações e problemas pendentes.

O WAHA é o provedor de WhatsApp do DeskcommCRM e faz parte do checkpoint da própria stack.
A instalação Evolution API que já existe na VPS pertence a outro projeto protegido: ela não será
removida, reutilizada nem contabilizada como componente do novo Focussdev.

## Decisão de hospedagem do Hub

- `app.focussdev.space` será publicado no Cloudflare Pages para retirar da VPS o custo do portal.
- O Hub será somente a porta de entrada, menu e navegação; não duplicará dashboards.
- Authentik e todas as aplicações upstream permanecem completas e independentes em seus próprios serviços.
- APIs, webhooks, bancos e dados privados não serão movidos para o frontend estático.
- Cloudflare Access poderá ser uma camada externa de proteção, mas não substituirá o Authentik como identidade central do ecossistema.
