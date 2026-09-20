# Checkpoint 06 — Supabase Focussdev + DeskcommCRM

Data: 2026-09-20
Estado: em andamento; instalação concluída, publicação e jornada real pendentes

## Concluído

- Projeto EasyPanel `focussapp` antigo removido somente após confirmar serviços exclusivos.
- Projeto EasyPanel `focussdev` criado.
- Supabase self-hosted independente criada com projeto Docker `focussdev_supabase`.
- Banco, Auth, REST, Realtime, Storage, Studio, Kong, Supavisor, Analytics e Vector saudáveis.
- Edge Functions permanece parada porque o diretório de funções está vazio; não é necessária para o CRM inicial.
- DeskcommCRM upstream instalado em `/opt/focussdev/deskcommcrm` sem alterações de código.
- App, worker, scheduler, Redis, serverless Redis HTTP e WAHA iniciados como projeto `focussdevcrm`.
- App e scheduler saudáveis; worker corrigido com chaves de criptografia geradas localmente.
- Supabase e CRM usam volumes/projetos próprios; nenhum recurso do `credmaisapp` foi usado.
- Porta temporária de validação: `http://72.62.138.208:3005`.

## Isolamento preservado

- O Supabase `credmaisapp` e seus containers não foram reutilizados.
- A Evolution API existente pertence a outro projeto e não substitui o WAHA do CRM.
- EasyPanel, Traefik, Authentik, Uptime Kuma e Vaultwarden permanecem independentes.
- Segredos foram gerados e mantidos na VPS; nenhum valor foi versionado neste repositório.

## Pendente

- Criar DNS `crm.focussdev.space` e `supabase.focussdev.space` apontando para a VPS.
- Validar HTTPS via Traefik após DNS.
- Remover a porta temporária 3005 depois do domínio HTTPS.
- Concluir onboarding do primeiro usuário e conectar WhatsApp via QR code.
- Provar envio e recebimento real de mensagem e persistência da sessão WAHA após reinício.
- Validar login, criação de organização, contato, lead e conversa pela interface original.
- Configurar backups automáticos e executar um ensaio de restauração.
- Criar monitores do CRM e do Supabase no Uptime Kuma.
- Medir CPU, memória e disco depois da stack completa.
- Remover o status `Em implantação` do Hub somente depois dessas provas.

## Acessos operacionais pendentes

- Autorizar a chave pública `focussdev-platform-deploy` na VPS para operação sem senha.
- Disponibilizar um token da API Hostinger fora do Git e do chat para gerenciar o DNS.
