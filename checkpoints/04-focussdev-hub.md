# CHECKPOINT 04 — Focussdev Hub

Data: 2026-09-20

## 1. O que foi instalado

- Portal estático próprio em `hub/`.
- Projeto Cloudflare Pages `focussdev-hub`.
- Workflow GitHub Actions para publicação automática da `main`.

O Hub não reimplementa funções de CRM, ERP, projetos, contratos, Git, suporte, documentação,
monitoramento, cofre, WhatsApp ou banco. Ele é o shell visual e preserva as aplicações originais.

## 2. O que foi configurado

- Repositório privado `focussdevserv/focussdev-platform`.
- Domínio solicitado: `https://app.focussdev.space`.
- Subdomínio técnico: `https://focussdev-hub.pages.dev`.
- Cabeçalhos CSP, HSTS, anti-iframe, referrer e permissions policy.
- Deploy sem build e sem runtime persistente na VPS.

## 3. Integrações realizadas

- Links ativos para Authentik, Uptime Kuma e Vaultwarden.
- GitHub Actions → Cloudflare Pages.
- Demais stacks exibidas como `Em implantação`, sem destinos simulados.

## 4. Banco/volumes utilizados

- Nenhum banco.
- Nenhum volume.
- Conteúdo estático distribuído pelo Cloudflare Pages.

## 5. SSO configurado ou limitação encontrada

- O Hub não mantém sessão própria nem banco de usuários.
- A proteção externa do domínio por Cloudflare Access + Authentik será fechada na etapa de acesso
  central; ela exige configuração específica de Zero Trust e não será simulada no frontend.

## 6. APIs/webhooks disponíveis

- Não aplicável ao frontend estático.
- Deploy via API oficial do Cloudflare Pages e token de escopo mínimo.

## 7. Testes realizados

- Token Cloudflare verificado pela API como ativo.
- Escopo revisado: Cloudflare Pages Edit na conta e DNS Edit somente em `focussdev.space`.
- Primeiro deploy direto concluído no Pages.
- Varredura de arquivos: nenhum token Cloudflare armazenado no Git.
- Links ativos apontam para serviços reais já validados nos checkpoints anteriores.

## 8. Problemas pendentes

- Proteger `app.focussdev.space` com autenticação central antes do checkpoint final da plataforma.
- Uptime Kuma 2.5.5 mantém login próprio porque não oferece OIDC/SAML nativo.
- Validar cada nova aplicação separadamente; não presumir que todas aceitam incorporação segura.

## 9. Estado atual da arquitetura

- Hub independente da VPS, reduzindo consumo de CPU, RAM e armazenamento do servidor.
- Aplicações upstream continuam independentes e sem alterações visuais.
- Deploy futuro automatizado por push na `main`.

## Living System Checklist — Hub

1. Quem alimenta: repositório privado, branch `main`, diretório `hub/`.
2. Quem alimenta: usuários encaminhados às aplicações upstream concluídas.
3. Registro emitido: histórico de commits, execução GitHub Actions e deploy Cloudflare.
4. Onde aparece: tela inicial do Hub e badges de estado de cada módulo.
5. Porta: `https://app.focussdev.space`.
6. Anti-morte: módulos incompletos ficam visíveis como implantação, sem link quebrado; o próximo
   passo é o checkpoint da respectiva stack.
7. Configuração: arquivos versionados em `hub/`; falha aparece no job de deploy.
8. Continuidade: não aplicável a handoff IA/humano; o Hub apenas roteia o usuário.
9. Laço de retorno: falha no deploy bloqueia a publicação; monitoramento HTTP será ligado no Uptime
   Kuma quando o domínio estiver ativo.
10. Mapa atualizado: `docs/architecture.md`.

## Decisao de acesso

Cloudflare Zero Trust/Access nao foi ativado porque esta conta exige cartao ou PayPal mesmo no
plano Free. Nao houve assinatura ou cobranca. O Hub permanece estatico no Cloudflare Pages;
cada aplicacao protege seu proprio acesso e SSO oficial quando suportado.

Estado: stack concluida. Proxima stack: DeskcommCRM.

## Atualizacao do painel central

- Menu principal com `Meu dia`, `Aplicacoes` e `Administracao`.
- Secao `Meu dia` com atalhos reais para Authentik, Uptime Kuma e Vaultwarden.
- Proxima etapa do CRM mostrada como pendente, sem numeros ou dados simulados.
- QA visual aprovado em desktop (1440px) e mobile (Pixel 7 emulacao Playwright).

## Prova de conceito do shell único — Uptime Kuma

- Commit base: `1213fcb`; endurecimento CSP: `cdeaa4d` e `ccc154c`.
- Menu lateral persistente publicado em `https://app.focussdev.space`.
- Conteúdo original de `https://status.focussdev.space/dashboard` carregado na área central.
- Nenhum componente, dashboard ou navegação interna do Uptime Kuma foi recriado.
- A navegação interna do upstream não foi ocultada: manipular DOM entre origens quebraria o
  isolamento do navegador e dificultaria atualizações.
- Uptime Kuma restringe `frame-ancestors` a `'self'` e `https://app.focussdev.space`.
- Playwright em produção: iframe acessível, formulário original presente, Socket.IO conectado,
  requests `200`, telemetria `204` e zero erros/avisos de console.
- QA visual aprovado em desktop e viewport móvel `390x844`.
- Rollback: restaurar os arquivos em
  `/var/backups/focussdev/uptime-kuma/poc-shell/` e recriar somente a stack Uptime Kuma.
