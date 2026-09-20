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
- DNS `crm.focussdev.space` confirmado em `72.62.138.208`.
- DNS `supabase.focussdev.space` criado pela API Hostinger em `72.62.138.208`.
- Hub publicado com WAHA no lugar da Evolution API; deploy e resposta HTTP 200 validados.

## Isolamento preservado

- O Supabase `credmaisapp` e seus containers não foram reutilizados.
- A Evolution API existente pertence a outro projeto e não substitui o WAHA do CRM.
- EasyPanel, Traefik, Authentik, Uptime Kuma e Vaultwarden permanecem independentes.
- Segredos foram gerados e mantidos na VPS; nenhum valor foi versionado neste repositório.

## Pendente

- Criar a rota Traefik do CRM: o domínio ainda recebe 404 do proxy.
- Emitir certificados TLS confiáveis para CRM e Supabase: o Supabase já chega ao Kong, mas ainda
  apresenta o certificado padrão não confiável do proxy.
- Remover a porta temporária 3005 depois do domínio HTTPS.
- Concluir onboarding do primeiro usuário e conectar WhatsApp via QR code.
- Provar envio e recebimento real de mensagem e persistência da sessão WAHA após reinício.
- Validar login, criação de organização, contato, lead e conversa pela interface original.
- Configurar backups automáticos e executar um ensaio de restauração.
- Criar monitores do CRM e do Supabase no Uptime Kuma.
- Medir CPU, memória e disco depois da stack completa.
- Remover o status `Em implantação` do Hub somente depois dessas provas.

## Acessos operacionais pendentes

- Aplicar a chave pública `focussdev-platform-deploy` no sistema operacional da VPS. Ela foi criada
  e anexada à VPS `1257466` pela API Hostinger, mas o servidor existente ainda a recusa; anexar na
  conta não alterou o `authorized_keys` da instalação atual.
- Rotacionar os tokens temporários da Hostinger depois de concluir o acesso automatizado.
- Não trocar a senha root nem usar um atalho que altere o host inteiro: a autorização vigente
  alcança somente o projeto Focussdev e seus recursos exclusivos.
