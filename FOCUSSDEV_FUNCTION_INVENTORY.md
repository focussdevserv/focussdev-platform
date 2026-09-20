# FOCUSSDEV — Inventário funcional e responsabilidade

Data-base: 20/09/2026  
Regra: o Focussdev relaciona, consulta, resume, autoriza e direciona. O registro operacional continua
no sistema oficial responsável.

## Como ler

- **JÁ EXISTE E ESTÁ FUNCIONANDO**: há serviço/tela/fluxo comprovado no ambiente atual.
- **JÁ EXISTE MAS PRECISA SER INTEGRADO**: a capacidade ou base já existe, mas ainda falta vínculo,
  API, webhook, SSO, rota, BFF ou validação ponta a ponta.
- **SERÁ FORNECIDO PELOS OPEN SOURCE ESCOLHIDOS**: não pertence ao Core; deve ser usado na interface
  original do produto responsável.
- **PRECISA SER DESENVOLVIDO NO FOCUSSDEV**: lacuna transversal que nenhum produto escolhido resolve.
- **INTEGRAÇÃO EXTERNA**: provedor fora dos open source self-hosted ou da VPS.
- **DUPLICADO / DESNECESSÁRIO**: não criar, manter ou instalar como novo módulo.
- **PENDENTE DE DECISÃO**: não ativar até o proprietário decidir ou uma versão/API ser comprovada.

## 1. JÁ EXISTE E ESTÁ FUNCIONANDO

| Função | Responsável oficial | Papel atual do Focussdev | Evidência/limite |
|---|---|---|---|
| Entrada visual do ecossistema | Focussdev Hub / Cloudflare Pages | Shell, menu inicial e links | `app.focussdev.space` responde; ainda sem BFF autenticado |
| Monitoramento de disponibilidade | Uptime Kuma | acesso pelo Hub e futura agregação | `status.focussdev.space`, versão 2.5.5, PoC embedded aprovada |
| Cofre de senhas | Vaultwarden | link seguro e referência de credencial | `cofre.focussdev.space`, OIDC Authentik e backup aprovados |
| Identidade central | Authentik | IdP para SSO futuro e grupos | `auth.focussdev.space`, API/health/backup aprovados |
| Banco/Auth/Storage da stack própria | Supabase Focussdev | infraestrutura usada pelo CRM e pelo Core futuro | containers saudáveis; Studio/admin ainda deve ser restrito |
| Fila durável básica de integrações | Focussdev Integration Service | inbox, jobs, retry, dead-letter e auditoria | API/worker/Postgres instalados; conectores ainda não implementados |
| WhatsApp do CRM | WAHA dentro da stack DeskcommCRM | nenhuma duplicação de inbox | container saudável; sessão/QR e jornada real ainda pendentes |
| Deploy do Hub | Cloudflare Pages + GitHub Actions | publicação do shell | workflow e domínio funcionando |
| Backup de Authentik/Uptime/Vaultwarden | scripts/cron das próprias stacks | futura Central de Backups lerá o estado | backups existem; restore de todas as stacks ainda não concluído |

## 2. JÁ EXISTE MAS PRECISA SER INTEGRADO

| Função | Sistema responsável | O que falta integrar | Classificação de integração |
|---|---|---|---|
| CRM, contatos, funis e conversas | DeskcommCRM | corrigir rota HTTPS CRM, onboarding, catalogar rotas e ligar Registry | DeskcommCRM + Focussdev BFF |
| Atendimento WhatsApp | DeskcommCRM + WAHA | QR, envio/recebimento, persistência, eventos e vínculo ao cliente | WAHA/CRM; não criar inbox paralelo |
| Login único | Authentik + cada app compatível | provider, callback, logout, grupos e teste por versão | SSO oficial individual |
| Menu mestre | Focussdev Hub | catálogo versionado com rotas reais, permissões e modo visual | Core |
| Conteúdo original na área central | cada upstream | decidir embed, reverse proxy ou mesma aba por app | integração visual individual |
| Estado de integrações | Integration Service | BFF autenticado, conectores, testes, logs e configurações | Core + APIs oficiais |
| Identidade do cliente | Registry Focussdev | criar IDs globais e vincular IDs do CRM/ERP/contratos/suporte | Core |
| Identidade do projeto | Registry Focussdev | relacionar Plane, repo, domínio, banco, contrato e deploy | Core |
| Métricas executivas | fontes de cada módulo | consultas autorizadas, cache/freshness e agregadores | Core + APIs |
| Notificações transversais | Focussdev Core | normalizar eventos e definir canais/escalonamento | Core + Resend/Calendar conforme decisão |
| Monitoramento de apps | Uptime Kuma | criar monitores e relacionar monitor→ativo→cliente/projeto | Uptime Kuma + Registry |
| Backups operacionais | cada stack + S3 externo | metadados, checksums, restore drills e alertas | Core + S3 |
| Deploys | GitHub/Forgejo/CI/Cloudflare | webhooks, release/commit/ambiente e resultado | Core + APIs |
| Erros de aplicações próprias | provedor de erros a decidir | fonte, SDK/webhook, fingerprint, release e owner | integração externa + Core |
| Domínios e DNS Focussdev | Hostinger/Cloudflare/EasyPanel | confirmar contas, zonas, ownership, rotas e vencimentos | integração externa |
| Auditoria administrativa | Focussdev Core + upstreams | correlacionar ações, ator, alvo e origem | Core |
| Links operacionais | Focussdev Core | catálogo de URLs, ambientes, health e owner | Core |

## 3. SERÁ FORNECIDO PELOS OPEN SOURCE ESCOLHIDOS

Nestas linhas o Focussdev não deve recriar telas nem armazenar uma cópia operacional. O menu mestre
apenas aponta para a página original ou abre um link autorizado.

### CRM e atendimento — DeskcommCRM

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Leads/prospecção | DeskcommCRM | ID, origem, status e link |
| Contatos e pessoas | DeskcommCRM | vínculo ao ID Global e resumo |
| Empresas/organizações | DeskcommCRM | vínculo ao Cliente Global |
| Funil e etapas | DeskcommCRM | etapa e contagem do funil |
| Oportunidades | DeskcommCRM | valor/status/origem e link |
| Tarefas comerciais | DeskcommCRM | pendência agregada e próximo passo |
| Follow-ups | DeskcommCRM | prazo/estado no Meu Dia |
| Atividades comerciais | DeskcommCRM | evento na Timeline Unificada |
| Campanhas CRM | DeskcommCRM | referência à campanha e leads |
| Inbox/caixa de entrada | DeskcommCRM | link e contagem |
| Conversas | DeskcommCRM + WAHA | resumo, último evento e link |
| Agenda comercial | DeskcommCRM/Google Calendar | evento e relação ao cliente |
| Produtos/comandas | DeskcommCRM | referência quando fizer parte da venda |
| Agentes de IA de atendimento | DeskcommCRM | status e handoff; não duplicar agente |

### Contratos — Documenso

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Propostas | Documenso | status, cliente e link |
| Documentos/envelopes | Documenso | ID, status e versão |
| Templates | Documenso | referência ao template |
| Envio e destinatários | Documenso | evento e pendência |
| Assinatura | Documenso | signer/status/data |
| Auditoria/certificado do documento | Documenso | evidência/link, sem recriar trilha |
| Webhooks de assinatura | Documenso → Integration Service | evento idempotente e Timeline |

### Financeiro — AureusERP

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Receitas | AureusERP | totais autorizados e origem |
| Despesas | AureusERP | custo por competência/cliente quando rateado |
| Contas a receber | AureusERP | aberto/pago/vencido |
| Contas a pagar | AureusERP | vencimento e status |
| Fluxo de caixa | AureusERP | indicador e link |
| Categorias/centros de custo | AureusERP | referência usada no rateio |
| Contas bancárias | AureusERP | saldo/estado permitido, sem credencial bancária |
| Relatórios financeiros | AureusERP | link e indicadores derivados |
| Recorrências/mensalidades | AureusERP | obrigação e vencimento |
| NFS-e contabilizada | AureusERP + provedor fiscal | status/número/link |

### Projetos — Plane

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Workspaces | Plane | workspace e owner |
| Projetos | Plane | projeto ligado ao ID Global |
| Tarefas/work items | Plane | quantidade, status, atrasos e link |
| Bugs/issues | Plane | contagem e prioridade |
| Ciclos | Plane | ciclo atual e progresso |
| Módulos | Plane | agrupamento e link |
| Views/boards | Plane | URL original |
| Atividades | Plane | eventos da Timeline |
| Equipe do projeto | Plane | membros autorizados |
| Arquivos/anexos | Plane/storage oficial | link, sem cópia indevida |

### Código — GitHub/Forgejo

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Repositórios | GitHub ou Forgejo | repo, owner, URL e projeto |
| Código/branches/tags | GitHub/Forgejo | branch principal e release atual |
| Commits | GitHub/Forgejo | último commit e autor |
| Issues | GitHub/Forgejo | contagem e vínculo ao Plane |
| Pull Requests | GitHub/Forgejo | estado, revisão e link |
| Actions/CI | GitHub Actions ou Forgejo Actions | workflow, status e duração |
| Releases | GitHub/Forgejo | versão e artefatos |
| Deploy associado | CI/Cloudflare/EasyPanel | commit, ambiente e resultado |

### Suporte — FreeScout

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Caixas de entrada/mailboxes | FreeScout | estado e link |
| Tickets/conversas | FreeScout | pendentes/atribuídos/resolvidos |
| Clientes de suporte | FreeScout | vínculo ao Cliente Global |
| Histórico de atendimento | FreeScout | eventos e link |
| Respostas/e-mail | FreeScout + SMTP | status, nunca caixa paralela |
| SLA/prioridade | FreeScout ou módulo aprovado | indicadores e escalonamento |
| API/webhooks | módulo oficial FreeScout | Integration Service, se licenciado |

### Documentação — BookStack

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Estantes/shelves | BookStack | link e contagem |
| Livros | BookStack | livro do cliente/projeto |
| Capítulos/páginas | BookStack | links e recentes |
| Pesquisa | BookStack | resultado ou link original |
| Procedimentos e manuais | BookStack | relação com ativo/projeto |
| Webhooks/API de documentação | BookStack | eventos no Integration Service |

### Dados e infraestrutura de aplicação — Supabase

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Database/tabelas/SQL | Supabase Studio | link admin; não copiar editor |
| Authentication de cada app | Supabase Auth | estado e relação, sem substituir Authentik automaticamente |
| Storage | Supabase Storage | bucket/URL autorizada |
| REST/Realtime | Supabase | endpoint e saúde |
| Logs/analytics | Supabase | estado operacional autorizado |
| Edge Functions | Supabase | somente quando realmente usadas |

### Monitoramento, senhas e identidade

| Função | Sistema responsável | Focussdev mostra/relaciona |
|---|---|---|
| Monitores/status/incidentes | Uptime Kuma | status, duração e link |
| Status pages | Uptime Kuma | página e disponibilidade |
| Notificações de monitor | Uptime Kuma | incidente e escalonamento |
| Logins e credenciais | Vaultwarden | apenas referência/owner; nunca segredo |
| Organizações/coleções do cofre | Vaultwarden | acesso administrativo limitado |
| Usuários e grupos | Authentik | ID, grupo e aplicação |
| Providers/policies/flows | Authentik | estado administrativo |
| Eventos de identidade | Authentik | auditoria agregada |

## 4. PRECISA SER DESENVOLVIDO NO FOCUSSDEV

Estas funções não devem ser empurradas para CRM, Plane, ERP ou outro upstream porque cruzam vários
sistemas.

| Função Core | Responsabilidade do Focussdev | Fontes consultadas | Critério de não duplicação |
|---|---|---|---|
| ID Global do Cliente | gerar `fc_customer_*`, resolver colisões e guardar vínculos | CRM, ERP, Documenso, FreeScout, Authentik | não copia cadastro operacional completo |
| ID Global do Projeto | gerar `fc_project_*` e vincular projeto/contrato/repo/ativo | Plane, Documenso, Git, Registry | Plane continua source of truth de tarefas |
| Cliente 360° | montar visão por seções e freshness | todos os sistemas vinculados | edição ocorre na origem |
| Projeto 360° | montar visão de escopo, execução e operação | Plane, ERP, Documenso, Git, Cloudflare, infra | não cria quadro/tarefa próprio |
| Mapa do Cliente | árvore Cliente→Projetos→Ativos→documentos/financeiro/suporte | Registry + links | referências, não cópias |
| Central de Ativos | metadados de site, domínio, banco, repo, servidor, API, monitor etc. | Cloudflare, Hostinger, EasyPanel, Supabase, Git, Uptime | segredo só no Vaultwarden |
| Relacionamentos | tabela de vínculos canônicos e cardinalidade | APIs externas | cada vínculo tem origem e auditoria |
| Timeline Unificada | normalizar eventos em ordem cronológica | webhooks/APIs dos apps | eventos imutáveis com `source_system` |
| Central de Links/Acessos | catálogo de URLs por ambiente/owner/health | apps e infraestrutura | nenhum bypass nem credencial |
| Central de Vencimentos | obrigações, owner, alertas e confirmação | ERP, Documenso, Hostinger, Cloudflare, certificados, contratos | vencimento não duplica cobrança |
| Custos por cliente/projeto | ratear custos e calcular margem | AureusERP + ativos/fornecedores | lançamento financeiro continua no ERP |
| Central de Backups | projeção de execução, tamanho, destino, checksum, restore drill | jobs, S3, EasyPanel, stacks | backup original continua na stack |
| Central de Deploys | consolidar ambiente, commit, release, resultado e rollback | GitHub/Forgejo, CI, Cloudflare, EasyPanel | deploy continua no executor |
| Central de Erros | agrupar e relacionar erro→release→cliente/projeto | Sentry/provedor escolhido, logs e deploys | não substituir logs do app |
| Auditoria transversal | registrar alterações de integração, permissão, exclusão e finanças sensíveis | Core + eventos dos apps | não reescrever audit trail do upstream |
| Busca Global | federar resultados autorizados e links | APIs pesquisáveis dos apps | não indexar segredo/PII excessiva |
| Meu Dia agregado | combinar pendências, prazos, tickets, follow-ups e falhas | CRM, Plane, FreeScout, ERP, Calendar, Core | cada pendência mantém owner/origem |
| Visão da Carteira | listar clientes/projetos com estado atual | Registry + agregadores | sem novo CRM/ERP |
| Onboarding de Projeto | executar checklist idempotente e registrar progresso | CRM, Documenso, ERP, Plane, Git, infra | criação efetiva nos sistemas donos |
| Templates por tipo de projeto | checklist para site, SaaS, app, automação etc. | configurações Core | template não duplica configuração upstream |
| Encerramento/Entrega | checklist de aceite, acessos, backups, docs, suporte e renovação | todas as fontes | não apagar dados dos apps |
| Portal do Cliente | mostrar somente dados e ações autorizadas | Cliente/Projeto 360° | escopo separado por cliente |
| Central de Integrações | status, config, teste, sync, logs, erros e reprocessamento | Integration Service | não esconder falha no banco |
| BFF e RBAC transversal | sessão, escopo e autorização para agregadores | Authentik + apps | validar novamente na origem |
| Agente Focussdev | consultar/operar dados autorizados com confirmação | Core + APIs oficiais | não agir sem permissão/approvação |
| Relatórios executivos | agregar métricas com fonte e timestamp | CRM/ERP/Plane/Ads/GA4/Search Console | não virar fonte operacional |

## 5. INTEGRAÇÃO EXTERNA

| Função solicitada | Sistema externo responsável | O Focussdev fará | Estado |
|---|---|---|---|
| Pagamentos PIX/cartão/links | Mercado Pago | enviar cobrança autorizada, receber webhook, reconciliar | integração futura |
| Emissão de NFS-e | provedor oficial da prefeitura/empresa fiscal | emitir após pagamento conforme regra, consultar, baixar e auditar | provedor/município pendente |
| Campanhas e investimento | Meta Ads | consultar contas/campanhas/custos/métricas | conta/permissão pendente |
| Entrada automática de leads | Meta Lead Ads | receber lead assinado, deduplicar e criar no CRM | integração futura |
| Campanhas e custos | Google Ads | consultar campanhas, investimento e conversões | conta/token pendente |
| Tráfego e conversões | Google Analytics 4 | consultar eventos, sessões e conversões | propriedade/consentimento pendente |
| SEO e tráfego orgânico | Google Search Console | consultar cliques, impressões, CTR, posição e páginas | propriedades pendentes |
| Reuniões/compromissos/prazos | Google Calendar | sincronizar eventos autorizados e criar lembretes | OAuth pendente |
| Arquivos externos | Google Drive | relacionar pastas/arquivos autorizados | OAuth/política pendente |
| DNS, zonas e domínios | Hostinger API | consultar domínio, renovação, DNS e alertas; mutações com aprovação | token/conta a confirmar |
| Deploy/DNS/edge | Cloudflare | relacionar Pages/Workers, domínio, certificado e deploy | integração parcial do Hub |
| Aplicações e infraestrutura | EasyPanel API | consultar projetos/serviços/deploys/backups; operar somente Focussdev aprovado | API disponível; escopo pendente |
| CNPJ/CEP/cadastros auxiliares | BrasilAPI/ReceitaWS | preencher/validar com confirmação humana | integração futura |
| Backup externo | S3 compatível | receber backups criptografados e metadados de restore | provedor pendente |
| E-mail transacional | Resend ou SMTP escolhido | envio de notificações/templates | domínio/política pendente |
| Código externo | GitHub | source of truth para repos existentes, PRs, Issues, Actions e releases | GitHub App pendente |
| WhatsApp alternativo | Evolution API dedicada | somente se WAHA não atender e após decisão | não usar `evolutions` protegido |

## 6. DUPLICADO / DESNECESSÁRIO

| Não criar | Motivo | Sistema que já atende |
|---|---|---|
| Novo CRM, leads, clientes, pipeline ou inbox | duplicaria vendas e atendimento | DeskcommCRM |
| Novo gerenciador de projetos/tarefas/bugs/ciclos | duplicaria execução e contagens | Plane |
| Novo ERP, contas a receber/pagar ou caixa | risco financeiro e divergência | AureusERP |
| Novo motor de cobrança/pagamento | duplicaria estado financeiro | AureusERP + Mercado Pago |
| Novo sistema de contratos/assinaturas | risco jurídico e documentos divergentes | Documenso |
| Novo help desk/tickets | fragmenta suporte | FreeScout |
| Nova wiki/base de conhecimento | fragmenta documentação | BookStack |
| Novo Git, issue tracker ou CI | fragmenta código e histórico | GitHub/Forgejo |
| Novo monitor de uptime | múltiplos estados contraditórios | Uptime Kuma |
| Novo cofre de senhas | risco crítico | Vaultwarden |
| Novo IdP independente | fragmenta identidade | Authentik |
| Novo banco/Storage paralelo para dados dos apps | quebra source of truth e backup | Supabase e bancos próprios |
| n8n | decisão explícita de remoção; Integration Service substitui | Focussdev Integration Service |
| Evolution API existente | pertence a outro projeto e está protegida | WAHA do Deskcomm hoje |
| Copiar todos os dashboards | viola preservação upstream e cria dívida | interfaces originais |
| Copiar senha/token no Cadastro de Ativos | risco de vazamento | Vaultwarden |
| Copiar valores financeiros em tabelas próprias | divergência e auditoria dupla | AureusERP/Mercado Pago |
| Instalar todas as bibliotecas de documentos agora | peso sem função concreta | adicionar sob demanda |

## 7. PENDENTE DE DECISÃO

| Decisão | Por que bloqueia | Responsável pela decisão |
|---|---|---|
| Upgrade/distribuição da VPS | capacidade atual não comporta todas as stacks com folga | proprietário |
| WAHA ou Evolution dedicada | fluxo atual usa WAHA; Evolution protegida não pode ser reutilizada | proprietário + validação técnica |
| Runtime do BFF autenticado | Hub Pages estático não resolve sessão e tokens sozinho | proprietário + arquitetura |
| Licença/OIDC do Plane | OIDC pode depender do plano da versão | proprietário |
| Módulos API/Webhooks/SAML do FreeScout | integração e SSO dependem deles | proprietário |
| Release/licença/SSO do Documenso | envelope, API e SSO variam por release/plano | proprietário |
| APIs/webhooks finais do AureusERP | snapshot mostra APIs de plugins, não contrato financeiro completo | validação da versão |
| Provedor/município da NFS-e | endpoints, certificado e regras são específicos | proprietário/contador |
| Conta/produtos Mercado Pago | PIX, cartão, assinatura e estorno mudam escopo | proprietário |
| Contas Meta/Google/GitHub | sem autorização não há dados nem lead automático | proprietário |
| Provedor S3, retenção e Object Lock | define RPO/RTO/custo/imutabilidade | proprietário |
| Fonte da Central de Erros | escolher Sentry/observabilidade ou outro provedor | proprietário |
| Conta registradora/DNS | confirmar se domínio está sob Hostinger, Cloudflare ou outra conta | proprietário |
| Política de mutações do agente | ações financeiras, DNS e deploy exigem confirmação | proprietário |
| Portal do cliente | escopo, ações, dados e branding ainda não foram definidos | proprietário |
| Projetos Git padrão | decidir quando usar GitHub, Forgejo ou ambos | proprietário |
| Rotas finais dos apps não instalados | não se pode inventar URL antes da versão | etapa de instalação |

## 8. Regra operacional para a IA

Antes de propor ou criar qualquer função, a IA deve executar esta sequência:

1. Procurar a capacidade nos open source escolhidos e na versão instalada.
2. Identificar a fonte oficial e a rota/API/webhook real.
3. Verificar se o Focussdev precisa apenas de vínculo, agregação, permissão ou link.
4. Se a capacidade já existir, não criar tabela/tela operacional duplicada.
5. Se for uma lacuna transversal, declarar owner, entradas, saídas, registro, tela, porta, anti-morte,
   configuração, continuidade humana e laço de retorno.
6. Marcar como pendente se API, licença, domínio, credencial ou versão ainda não estiver comprovada.
7. Criar checkpoint antes de liberar a função no menu.

## 9. Resultado consolidado por sistema

| Sistema | Responsabilidade oficial | Não deve ser substituído pelo Focussdev |
|---|---|---|
| DeskcommCRM | CRM, clientes, leads, vendas, conversas e atendimento | CRM/inbox/funil/contatos |
| Plane | projetos, tarefas, bugs, ciclos e módulos | gestor de projetos |
| AureusERP | receitas, despesas, contas, caixa e cobranças | ERP/contabilidade operacional |
| Documenso | propostas, documentos, contratos e assinaturas | assinatura/documento |
| Mercado Pago | processamento e estado de pagamentos | gateway de pagamento |
| FreeScout | tickets, caixas e suporte | help desk |
| BookStack | documentação e procedimentos | wiki |
| GitHub/Forgejo | código, commits, PRs, issues, Actions e releases | Git/CI |
| Supabase | banco, Auth, Storage, REST e Realtime dos sistemas próprios | banco/storage paralelo |
| WAHA/Evolution dedicada | WhatsApp e sessões | inbox paralelo |
| Uptime Kuma | monitores, incidentes, status pages e notificações | monitor concorrente |
| Vaultwarden | senhas e credenciais | cofre alternativo |
| Authentik | usuários, grupos, providers, policies e SSO | IdP paralelo |
| Cloudflare/EasyPanel/Hostinger | edge, DNS, deploy e infraestrutura conforme escopo | painel de infraestrutura duplicado |
| Focussdev Core | relações, IDs, visões 360°, vencimentos, ativos, timeline, busca, carteira, onboarding, auditoria e agente autorizado | nenhum dos sistemas especialistas |

## 10. Critério de aceite do inventário

- Nenhuma função listada como fornecida por upstream será recriada no Core.
- Cada cartão Cliente/Projeto 360° mostrará sistema de origem, ID externo, timestamp e link.
- Números agregados serão consultados do owner oficial e não de cópia manual.
- Senhas e tokens jamais aparecerão no cadastro de ativos, timeline, busca ou prompts da IA.
- Pendências de integração serão visíveis e terão responsável/próximo passo.
- Toda mutação do Core terá auditoria, idempotência e rollback apropriado.
- O menu mestre só ativará item cuja rota/API da versão instalada esteja comprovada.
- Qualquer divergência deste inventário exige atualização do documento e checkpoint antes do código.
