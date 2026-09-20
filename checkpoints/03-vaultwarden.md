# CHECKPOINT — Vaultwarden

Status: concluído, funcional e testado com login nativo e SSO OIDC pelo Authentik.

## 1. O que foi instalado

- Vaultwarden upstream `1.37.3`, imagem fixa `vaultwarden/server:1.37.3`.
- Um container oficial, sem fork, cópia ou alteração da interface Web Vault.
- Cofre, organizações, coleções, itens, anexos e configurações originais preservados.

## 2. O que foi configurado

- Stack em `/opt/focussdev/stacks/vaultwarden`.
- Porta `127.0.0.1:8082`, sem exposição direta à internet.
- URL pública `https://cofre.focussdev.space`, com certificado Let's Encrypt válido.
- HTTP redirecionado para HTTPS pelo Traefik existente.
- Painel administrativo desabilitado (`DISABLE_ADMIN_TOKEN=true`).
- Primeira conta criada diretamente pelo proprietário; senha-mestra não foi lida nem armazenada.
- Cadastro público fechado (`SIGNUPS_ALLOWED=false`).

## 3. Integrações realizadas

- Rede externa `easypanel`, alias exclusivo `focuss-vaultwarden`.
- Traefik → aplicação validado com HTTPS e redirecionamento 308.
- OIDC oficial integrado ao Authentik, sem proxy de senhas ou alteração do upstream.
- Aplicação Authentik `Vaultwarden`, grupo visual `Focussdev` e provider `Focussdev Vaultwarden OIDC`.
- Acesso inicial do aplicativo restrito ao usuário administrador `akadmin`; futuros usuários devem ser concedidos por grupo/política no Authentik.

## 4. Banco e volumes

- SQLite oficial em `/data/db.sqlite3`.
- Volume exclusivo `focuss-vaultwarden-data`.
- Backup consistente pelo comando oficial `/vaultwarden backup`.
- Arquivo compactado, checksum SHA-256 e `PRAGMA integrity_check` aprovados.
- Backups em `/var/backups/focussdev/vaultwarden`, modo `600`, retenção de sete dias.
- Cron diário às 02:45 UTC em `/etc/cron.d/focuss-vaultwarden-backup`.
- Backup pós-SSO validado: `vaultwarden-20260920T140417Z.tar.gz`.

## 5. SSO configurado ou limitação encontrada

- OIDC oficial habilitado com authority `https://auth.focussdev.space/application/o/vaultwarden/`.
- Client ID não secreto: `focussdev-vaultwarden`.
- Callback estrito: `https://cofre.focussdev.space/identity/connect/oidc-signin`.
- Grants habilitados: Authorization Code e Refresh Token.
- Escopos: `openid profile email offline_access`.
- Criação automática de novas contas via SSO desabilitada; vínculo permitido somente para conta existente com e-mail correspondente.
- Login nativo mantido como contingência (`SSO_ONLY=false`).
- A senha-mestra continua pertencendo ao usuário e nunca é compartilhada com Hub, Authentik ou automações.

## 6. APIs e webhooks disponíveis

- API compatível com clientes Bitwarden suportados.
- Endpoint de saúde `/alive`.
- Discovery OIDC do Authentik validado em `/application/o/vaultwarden/.well-known/openid-configuration`.
- O Focussdev Integration Service não receberá permissão para ler segredos do cofre; receberá
  somente as credenciais estritamente necessárias a cada conector por injeção segura.

## 7. Testes realizados

- `docker compose config`: aprovado.
- Imagem fixa e processo: `1.37.3`.
- Container recriado após SSO e confirmado `healthy`.
- `/alive` interno e público: HTTP 200.
- Web Vault e dashboard original: carregados pela interface real.
- Login nativo: aprovado antes da ativação do SSO.
- Fluxo OIDC completo: botão SSO → consentimento Authentik → callback → cofre original aberto.
- Restrição de acesso no Authentik: vínculo habilitado apenas para `akadmin`.
- Cadastro público e cadastro automático por SSO: bloqueados.
- Persistência: volume preservado após recriação do container.
- Backup pós-configuração: criação e integridade aprovadas.
- EasyPanel, Traefik, Evolution e os 13 containers Supabase existentes permaneceram preservados.

## 8. Problemas pendentes

- Nenhum bloqueio funcional desta stack.
- SMTP será configurado somente quando a infraestrutura de e-mail transacional estiver definida.
- Ao criar equipe, substituir o vínculo direto de `akadmin` por um grupo específico de acesso ao cofre no Authentik.

## 9. Estado atual da arquitetura

- Authentik, Uptime Kuma e Vaultwarden permanecem independentes, com containers, persistência, backups e rotas próprias.
- Vaultwarden concluído em `https://cofre.focussdev.space`, com dashboard upstream completo, HTTPS, conta inicial, cadastro fechado, SSO e backup consistente.
- Nenhum recurso de `credmaisapp`, `evolutions`, `botscassino`, EasyPanel ou Traefik compartilhado foi removido ou substituído.
