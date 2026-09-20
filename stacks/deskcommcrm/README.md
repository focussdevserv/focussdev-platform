# Stack DeskcommCRM — plano de implantação

Estado atual: preparada na VPS, aguardando Supabase dedicado.

## Preparado

- Repositório upstream clonado em `/opt/focussdev/deskcommcrm`.
- Commit upstream verificado: `6eceb0e`.
- Swap de 2 GB habilitado em `/swapfile` porque a VPS estava sem swap.
- EasyPanel, Traefik, Supabase `credmaisapp`, Evolution API e demais projetos preservados.

## Ordem de execução

1. Criar projeto Supabase exclusivo do CRM.
2. Registrar `crm.focussdev.space` apontando para a VPS.
3. Preencher o `.env` somente na VPS, sem versionar segredos.
4. Executar `hostgator-setup-kit/install.sh` do repositório upstream.
5. Usar Traefik existente; não publicar portas novas no host.
6. Aplicar `supabase/baseline.sql` pelo instalador oficial.
7. Subir app, worker, scheduler, WAHA e Redis isolados.
8. Validar HTTPS, login, persistência, healthcheck e onboarding.
9. Configurar Authentik somente se o protocolo oficial da versão permitir.
10. Criar monitor no Uptime Kuma e registrar o checkpoint.

## Dependências obrigatórias ainda não fornecidas

- URL do Supabase dedicado.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `SUPABASE_DB_URL` usando Session Pooler.
- Domínio final confirmado para o CRM.

As chaves serão inseridas diretamente na VPS por canal seguro e nunca aparecerão no Git ou no chat.
Não usar o Supabase do `credmaisapp` nem um Postgres compartilhado entre aplicações.
