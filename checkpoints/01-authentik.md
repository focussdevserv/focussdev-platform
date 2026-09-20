# CHECKPOINT — Authentik

Status: concluído, funcional e publicado em HTTPS.

## 1. O que foi instalado

- Authentik upstream `2026.8.3`, imagem fixa `ghcr.io/goauthentik/server:2026.8.3`.
- PostgreSQL 16 Alpine exclusivo desta stack.
- Serviços originais `server` e `worker`; nenhuma interface foi recriada ou alterada.
- Método oficial Docker Compose, adequado a uma instalação pequena.

## 2. O que foi configurado

- Diretório: `/opt/focussdev/stacks/authentik`.
- Portas no host: `127.0.0.1:9000` (HTTP) e `127.0.0.1:9443` (HTTPS), sem exposição pública direta.
- Segredos gerados na própria VPS; `.env` com modo `600`. Valores não foram exibidos nem copiados para o repositório.
- Servidor conectado à rede externa `easypanel` por alias próprio para o Traefik.
- Diretórios persistentes com proprietário UID/GID 1000 e modo `750`, compatíveis com o usuário oficial `authentik` da imagem.
- Domínio reservado: `auth.focussdev.space`.

## 3. Integrações realizadas

- Caminho interno EasyPanel Traefik → `focuss-authentik-server:9000` validado.
- Manifesto dinâmico exclusivo ativado no Traefik da VPS.
- `auth.focussdev.space` resolve para `72.62.138.208`; HTTPS e redirecionamento HTTP → HTTPS validados.
- O domínio usa nameservers Hostinger (`ns1.dns-parking.com` e `ns2.dns-parking.com`); não será migrado para evitar impacto em outros projetos.

## 4. Banco e volumes

- Volume nomeado: `focuss-authentik-database`.
- Rede privada: `focuss-authentik_default`.
- Diretórios: `data`, `certs` e `custom-templates`, exclusivos desta stack.
- Banco inicializado com 230 tabelas públicas.
- Backup validado em `/var/backups/focussdev/authentik/`, formato custom do PostgreSQL, checksum SHA-256 e modo `600`.
- Backup automático diário às 02:15 UTC, retenção de sete dias, definido em `/etc/cron.d/focuss-authentik-backup`.

## 5. SSO configurado ou limitação encontrada

- O Authentik é o provedor central planejado para OIDC/OAuth2/SAML.
- Os providers das demais aplicações serão criados somente durante o checkpoint de cada stack, após confirmar o mecanismo oficialmente suportado na versão instalada.
- O usuário administrador inicial definiu a própria senha pela interface original; nenhuma senha foi compartilhada ou registrada fora do Authentik.

## 6. APIs e webhooks disponíveis

- API original `/api/v3/` ativa; `/api/v3/root/config/` respondeu HTTP 200.
- Endpoints de saúde `/-/health/live/` e `/-/health/ready/` responderam HTTP 200.
- Tokens/API não foram criados antes da conta administrativa e da definição de finalidade.

## 7. Testes realizados

- `docker compose config --quiet`: aprovado.
- PostgreSQL: health check e `pg_isready` aprovados.
- `server` e `worker`: ambos `healthy`.
- Tela original `/if/flow/initial-setup/`: HTTP 200 após correção das permissões dos templates.
- API original: HTTP 200.
- Reinício de `server` e `worker`: aprovado; 230 tabelas antes e depois.
- Caminho pela rede overlay a partir do container do Traefik: aprovado.
- Dump de backup validado com `pg_restore -l` e checksum aprovado.
- Administrador `akadmin`: ativo, com login real confirmado pelo campo `last_login` e pelo proprietário.
- EasyPanel, Traefik e os três serviços Evolution permanecem `1/1`; containers protegidos não foram alterados.

## 8. Problemas pendentes

- Criar grupos, providers e políticas de cada aplicação durante o checkpoint da respectiva stack, após confirmar seu suporte oficial a SSO.
- A VPS possui 2 vCPU, 7,8 GiB de RAM e não tem swap. Após Authentik há cerca de 3,3 GiB disponíveis; a capacidade deve ser reavaliada a cada stack e é insuficiente para instalar com segurança todo o ecossistema pesado sem ampliação ou distribuição.

## 9. Estado atual da arquitetura

- Infraestrutura compartilhada preservada: Docker, EasyPanel e Traefik.
- Projetos protegidos preservados: `credmaisapp`, `evolutions` e recursos de `botscassino`.
- Authentik isolado em três containers, banco e persistência próprios.
- Rota pública ativa em `https://auth.focussdev.space`, servida pelo Traefik com HTTPS.
- O Hub será hospedado futuramente no Cloudflare Pages como frontend estático; isso não altera nem substitui o dashboard do Authentik.
