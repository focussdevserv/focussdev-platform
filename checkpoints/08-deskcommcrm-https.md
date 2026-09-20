# CHECKPOINT 08 — DeskcommCRM publicado em HTTPS

Data: 20/09/2026  
Status: correção de publicação concluída; jornada funcional ainda pendente  
Stack: `/opt/focussdev/deskcommcrm`  
Projeto Compose: `focussdevcrm`

## O que foi alterado

- Aplicado somente o override `/opt/focussdev/deskcommcrm/docker-compose.focussdev.yml` versionado
  em `stacks/deskcommcrm/docker-compose.focussdev.yml`.
- O override liga a aplicação às redes exclusivas e define os entrypoints reais do Traefik:
  `http` para redirect e `https` para TLS.
- O container `app` foi recriado com `docker compose -p focussdevcrm ... up -d --no-deps app`.
- O override anterior foi preservado em `/var/backups/focussdev/deskcommcrm/20260920T174354Z/` com
  checksum SHA-256.
- Uma primeira tentativa sem `-p focussdevcrm` criou temporariamente uma cópia `deskcommcrm-*`;
  ela foi removida com `docker compose -p deskcommcrm ... down --remove-orphans`. A instância
  original `focussdevcrm-*` permaneceu ativa.

## Versão e containers

- App: imagem `ghcr.io/melgarafael/deskcommcrm:stable`, metadado upstream `1.41.0`, revisão
  `7acf480fd9db330295b0fd6d33ae30a8acd9cc58`.
- App saudável após recriação.
- Worker, scheduler, Redis, SRH e WAHA não foram recriados nesta etapa; permaneceram ativos.
- Supabase Focussdev permaneceu separado e saudável conforme inventário anterior.

## Domínio, proxy e cabeçalhos

- DNS: `crm.focussdev.space` → `72.62.138.208`.
- TLS: certificado Let's Encrypt válido já existente.
- HTTP: `301` para HTTPS.
- HTTPS raiz: `307` para `/app`.
- Seguindo redirects sem sessão: `200` em `/login?next=%2Fapp`.
- Título original observado: `Entrar · DeskcommCRM`.
- `x-frame-options: DENY` e `x-content-type-options: nosniff` permanecem do upstream.
- `x-request-id` e `x-pathname` presentes.

## Onboarding e WhatsApp concluídos

- A conta administrativa foi criada pelo fluxo original; a chave de IA não foi inventada e os passos opcionais foram pulados.
- A primeira tentativa de WhatsApp revelou `401` no WAHA porque `WAHA_API_KEY_SHA512` estava vazio.
- O override do CRM passou a fixar o digest correspondente à chave existente no app; o override anterior foi salvo em `/var/backups/focussdev/deskcommcrm/20260920T175434Z/`.
- Uma nova sessão foi pareada por QR, validada como `Conectado` e os webhooks `state.change` chegaram ao CRM com HTTP 200.
- A sessão inválida de teste foi removida pela interface; nenhuma sessão da Evolution API externa foi tocada.
- Backup concluído em `/var/backups/focussdev/deskcommcrm/20260920T180221Z/`: dump completo do Postgres dedicado e volume `waha-data.tar.gz`, ambos com SHA-256 registrado no host.
- A porta temporária `3005` foi removida do override; o app permanece `healthy` e o domínio HTTPS continua respondendo `307 /app`.

Rotas originais confirmadas após login: `/app/inbox` (Inbox), `/app/contacts` (Contatos), `/app/kanban` (Funis), `/app/connections` (Conexões/QR), `/app/tasks` (Tarefas), `/app/ai/agents` (Agentes), `/app/ai/followups` (Follow-ups), `/app/metrics` (Desempenho), `/app/ads/meta` (Meta Ads) e `/app/settings` (Configurações).

## Segurança e escopo

- Nenhum segredo foi exibido, versionado ou alterado.
- `credmaisapp` e seus containers permaneceram ativos, com aproximadamente 28 horas de atividade.
- `evolutions` e seus três serviços permaneceram ativos, com aproximadamente duas semanas de atividade.
- Não houve mudança em EasyPanel, Traefik global, Docker, Swarm, portas globais ou firewall.
- A porta temporária `3005` continua apenas para validação e será removida depois da jornada aprovada.

## Testes realizados

- Compose combinado com os três manifests: aprovado.
- Recriação somente do serviço `app`: concluída.
- Healthcheck do app: `healthy`.
- HTTP/HTTPS, redirect, login e título original: aprovados.
- Labels efetivos: `deskcomm=https`, `deskcomm-http=http`, `deskcomm-waha-block=https`.
- Containers protegidos: nomes, imagens e atividade preservados; nenhum foi recriado.

## Pendências antes de marcar CRM como disponível

- concluir onboarding do primeiro usuário/organização;
- conectar e provar QR, envio, recebimento e persistência de uma sessão WAHA;
- validar contato, funil, conversa, permissões e logout pela interface original;
- criar backup/restauração do Supabase/CRM/WAHA;
- remover a porta 3005;
- criar monitor do CRM no Uptime Kuma;
- registrar rotas reais do catálogo no menu mestre somente após login e teste;
- implementar o primeiro vínculo DeskcommCRM → Integration Registry.

## Estado do onboarding

- A interface original foi aberta por navegador real em `https://crm.focussdev.space`.
- O fluxo redirecionou corretamente para a tela original `Criar conta` (`/signup`).
- A empresa `focussdev` aparece pré-preenchida.
- O cadastro está aguardando e-mail e senha definidos diretamente pelo proprietário no navegador.
- Nenhuma credencial foi criada, compartilhada ou registrada pelo agente.

## Rollback

Restaurar o override salvo em `/var/backups/focussdev/deskcommcrm/20260920T174354Z/`, validar os três
manifests e recriar somente `app` com `-p focussdevcrm --no-deps`. Não executar `down -v`, prune ou
remoção de volumes.

## Próxima etapa

Concluir a jornada original do CRM e o backup antes de instalar qualquer nova aplicação.
