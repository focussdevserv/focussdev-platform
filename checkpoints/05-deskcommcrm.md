# CHECKPOINT 05 — DeskcommCRM

Data: 2026-09-20
Estado: bloqueado por dependência externa obrigatória

> Checkpoint histórico, superado pelo `06-supabase-deskcomm.md`: o Supabase dedicado e a stack
> DeskcommCRM foram instalados depois deste bloqueio. Este arquivo preserva a evidência da decisão
> de não reutilizar o banco do `credmaisapp`.

## 1. O que foi analisado

- Repositório upstream `melgarafael/DeskcommCRM` clonado somente para leitura em `runtime/deskcommcrm`.
- Instalador oficial `hostgator-setup-kit/install.sh` e os compose de produção revisados.
- A instalação oficial usa imagens publicadas do projeto, worker, scheduler, WAHA e Redis.

## 2. Inventário preservado

- EasyPanel e Traefik existentes.
- Supabase do projeto `credmaisapp`.
- Evolution API, PostgreSQL e Redis existentes.
- Authentik, Uptime Kuma, Vaultwarden e respectivos volumes.

Nenhum container, volume, rede, banco ou domínio de outro projeto foi alterado.

## 3. Por que não foi iniciado

O DeskcommCRM exige um Supabase dedicado ou um projeto Supabase externo próprio, com URL, anon key,
service role key e conexão de banco. O Supabase já instalado pertence a outro projeto e não será
reutilizado para tabelas, autenticação ou storage do CRM, pois isso criaria acoplamento não suportado.

Também falta definir o domínio final (proposto: `crm.focussdev.space`) e suas credenciais oficiais.

## 4. Recursos que serão criados quando liberado

- Diretório e compose isolados do DeskcommCRM.
- Rede interna própria e conexão ao proxy existente sem expor portas adicionais.
- Volumes exclusivos para WAHA/sessões e mídia.
- Domínio HTTPS dedicado.
- Aplicação upstream, worker e scheduler nas versões publicadas pelo projeto.

## 5. Integrações previstas

- Authentik via OIDC somente se suportado pela versão instalada.
- Evolution API não substitui automaticamente o WAHA oficial exigido pelo CRM; essa compatibilidade
  será verificada antes de qualquer troca.
- Webhooks oficiais do CRM serão preparados depois que o banco estiver funcional.

## 6. Testes pendentes

Frontend, backend, banco, login, persistência, HTTPS, permissões e webhook ainda não podem ser
testados sem uma instância Supabase dedicada.

## 7. Próximo passo

Fornecer um projeto Supabase dedicado (cloud ou self-host isolado) e os dados de conexão por canal
seguro. Nenhum segredo deve ser enviado no chat. Depois disso, o instalador oficial será executado
na VPS sem tocar nos demais projetos.
