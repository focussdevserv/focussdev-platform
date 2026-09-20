# CHECKPOINT — Uptime Kuma

Status: concluído, funcional e publicado em HTTPS.

## 1. O que foi instalado

- Uptime Kuma upstream `2.5.5`, imagem fixa `louislam/uptime-kuma:2.5.5`.
- Um container oficial, sem forks ou alterações no código visual.
- Dashboard, monitores, status pages, incidentes, notificações e configurações originais preservados.

## 2. O que foi configurado

- Stack em `/opt/focussdev/stacks/uptime-kuma`.
- Porta `127.0.0.1:3001`, sem exposição direta à internet.
- Rota Traefik exclusiva em `https://status.focussdev.space`.
- HTTP redirecionado para HTTPS.
- Usuário administrativo criado pelo proprietário; senha não foi compartilhada ou registrada.

## 3. Integrações realizadas

- Rede externa `easypanel`, alias `focuss-uptime-kuma`.
- Traefik → aplicação validado com HTTPS e WebSocket.
- Webhook para n8n/FreeScout fica deliberadamente pendente até essas stacks existirem.

## 4. Banco e volumes

- SQLite oficial em `/app/data/kuma.db`.
- Volume exclusivo `focuss-uptime-kuma-data`.
- Backup online consistente usando o utilitário SQLite da própria imagem.
- Arquivo completo compactado, checksum SHA-256 e `PRAGMA integrity_check` aprovados.
- Backups em `/var/backups/focussdev/uptime-kuma`, modo `600`, retenção de sete dias.
- Cron diário às 02:30 UTC em `/etc/cron.d/focuss-uptime-kuma-backup`.

## 5. SSO configurado ou limitação encontrada

- Uptime Kuma 2.5.5 não oferece login OIDC/SAML nativo; a solicitação OpenID oficial permanece aberta no upstream.
- Foi mantido o login oficial do Kuma, sem hacks, compartilhamento de senha ou alteração upstream.
- A limitação será reavaliada em futuras versões.

## 6. APIs e webhooks disponíveis

- API interna baseada principalmente em Socket.IO; não é contrato estável para integração externa.
- API Keys oficiais podem autenticar `/metrics` quando habilitadas pela interface.
- Push monitors e status pages possuem endpoints próprios.
- Para automação de incidentes serão usadas notificações/webhooks oficiais configuradas pela interface.

## 7. Testes realizados

- `docker compose config --quiet`: aprovado.
- Container: `healthy`, zero reinícios inesperados.
- `/api/entry-page`: HTTP 200.
- HTTP → HTTPS: 301.
- WebSocket por Traefik: `101 Switching Protocols`.
- Banco SQLite e migrations: aprovados.
- Usuário: uma conta persistente confirmada sem expor identificador ou senha.
- Reinício: uma conta antes e depois; container voltou saudável.
- Backup: criação, listagem, checksum e integridade do banco restaurado aprovados.
- Consumo observado: aproximadamente 136 MiB de RAM.
- EasyPanel, Traefik e Evolution: `1/1`; Supabase protegido: 13/13 containers em execução.

## 8. Problemas pendentes

- Criar monitores somente após definir os endpoints reais das stacks instaladas.
- Configurar destinatários e webhook para incidentes depois de n8n e FreeScout.
- Habilitar API key para métricas somente quando houver consumidor real.
- Capacidade restante da VPS: aproximadamente 3,0 GiB disponíveis, 2 vCPU e sem swap; medir novamente antes de cada stack.

## 9. Estado atual da arquitetura

- Authentik e Uptime Kuma são independentes, com containers, persistência, backups e domínios próprios.
- Uptime Kuma usa autenticação nativa por limitação oficial de SSO.
- O painel original está disponível em `https://status.focussdev.space`.
- Nenhum recurso de `credmaisapp`, `evolutions`, `botscassino`, EasyPanel ou Traefik compartilhado foi removido ou substituído.

## Living System Checklist

1. Entrada: heartbeats dos monitores reais a serem cadastrados.
2. Saída: notificações oficiais; futuramente webhook n8n → ticket FreeScout.
3. Registro: heartbeats, eventos e incidentes do próprio Kuma.
4. Tela: dashboard, histórico, status pages e incidentes originais.
5. Porta: `https://status.focussdev.space` e, futuramente, menu do Hub.
6. Anti-morte: notificações e escalada; conexão final pendente de n8n/FreeScout.
7. Configuração: interface original completa do Kuma.
8. Continuidade: incidente entrega contexto para humano; resolução retorna como recovery.
9. Retorno: recovery encerra indisponibilidade; pós-incidente será documentado no BookStack.
10. Mapa: registrado na arquitetura externa; arestas finais serão adicionadas no checkpoint de integrações.
