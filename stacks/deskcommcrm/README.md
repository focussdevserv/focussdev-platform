# Stack DeskcommCRM — plano de implantação

Estado atual: Supabase dedicado e stack instalados; aguardando publicação HTTPS e validação
funcional completa. O estado verificável mais recente está em
`checkpoints/06-supabase-deskcomm.md`.

## Preparado

- Repositório upstream clonado em `/opt/focussdev/deskcommcrm`.
- Commit upstream verificado: `6eceb0e`.
- Swap de 2 GB habilitado em `/swapfile` porque a VPS estava sem swap.
- EasyPanel, Traefik, Supabase `credmaisapp`, Evolution API e demais projetos preservados.

## Instalado

- Supabase self-hosted exclusivo no projeto Docker `focussdev_supabase`.
- DeskcommCRM upstream em `/opt/focussdev/deskcommcrm`.
- App, worker, scheduler, Redis, adaptador HTTP do Redis e WAHA no projeto `focussdevcrm`.
- Chaves operacionais geradas localmente na VPS, sem segredos versionados.

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

## Pendências atuais

- Publicar `crm.focussdev.space` e `supabase.focussdev.space` com rotas Traefik e HTTPS; os dois
  registros DNS já apontam para a VPS.
- Retirar a porta temporária `3005` depois da validação pelo domínio.
- Concluir o onboarding do primeiro usuário.
- Conectar e provar uma sessão real do WhatsApp no WAHA.
- Configurar backup, restauração ensaiada e monitores do Uptime Kuma.
- Fechar o checkpoint com login, persistência, healthcheck e jornada real validados.

As chaves permanecem somente na VPS e nunca aparecem no Git ou no chat. Não usar o Supabase do
`credmaisapp` nem compartilhar o Postgres com outra aplicação.
