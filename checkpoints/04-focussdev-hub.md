# CHECKPOINT 04 — Focussdev Hub

Data: 2026-09-20

## 1. O que foi instalado

- Portal estático próprio em `hub/`.
- Projeto Cloudflare Pages `focussdev-hub`.
- Workflow GitHub Actions para publicação automática da `main`.

O Hub não implementa funções de CRM, ERP, projetos, contratos, Git, suporte, documentação,
monitoramento, cofre, automação, WhatsApp ou banco. Ele é apenas navegação.

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

- Aguardar ativação do domínio personalizado e certificado TLS do Cloudflare.
- Proteger `app.focussdev.space` com autenticação central antes do checkpoint final da stack.
- Validar visualmente desktop e mobile no domínio definitivo.

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
