# Arquitetura do ecossistema Focussdev

O Hub é somente a porta de entrada. Ele nunca substitui os dashboards das aplicações. Os links
ativos levam ao frontend upstream completo em subdomínios independentes; Authentik fornece SSO
somente onde o protocolo oficial da aplicação for compatível.

```mermaid
flowchart LR
  U[Equipe Focussdev] --> A[Cloudflare Access / Authentik]
  A --> H[Focussdev Hub\nCloudflare Pages]
  H --> I[Authentik]
  H --> K[Uptime Kuma]
  H --> V[Vaultwarden]
  H -. ativado após checkpoint .-> X[Demais aplicações upstream]
  X --> N[n8n / APIs / webhooks]
  N --> X
```

## Regras do mapa

- Entrada: usuário autenticado acessa `app.focussdev.space`.
- Saída: cada módulo disponível abre o domínio da aplicação original.
- Módulo não concluído: visível como `Em implantação`, sem link enganoso.
- Operação: mudanças em `hub/` na `main` publicam automaticamente no Cloudflare Pages.
- Segredos: Cloudflare API Token existe somente no cofre local criptografado e no GitHub Actions
  Secrets; nunca no Git.
