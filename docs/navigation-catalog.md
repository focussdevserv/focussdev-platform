# Catálogo desejado de navegação

Este arquivo registra a intenção de produto. Ele **não autoriza inventar rotas**. Antes de ativar
qualquer item no menu mestre é obrigatório registrar no checkpoint da stack: versão instalada,
rota real, papel autorizado, comportamento de autenticação e resultado do teste no navegador.

| Área Focussdev | Aplicação de origem | Itens candidatos a validar |
|---|---|---|
| CRM e Comercial | DeskcommCRM | Dashboard, leads, clientes, contatos, empresas, funil, oportunidades, follow-ups, atividades, campanhas, inbox, conversas e WhatsApp |
| Financeiro | AureusERP | Dashboard, receitas, despesas, contas a receber/pagar, cobranças, recorrências, assinaturas, fluxo de caixa, categorias, centros de custo, contas bancárias e relatórios |
| Pagamentos | Mercado Pago | Cobranças, pagamentos, PIX, links, pendentes, aprovados, cancelados, reembolsos e webhooks; apenas produtos habilitados na conta |
| Documentos | Documenso | Dashboard, documentos, propostas, contratos, templates, enviados, aguardando assinatura, concluídos e configurações |
| Projetos | Plane | Dashboard, workspaces, projetos, issues, ciclos, módulos, views, atividades, equipe e configurações |
| Desenvolvimento | Forgejo | Dashboard, repositórios, organizações, issues, pull requests, commits, branches, tags, releases, Actions/CI e configurações |
| GitHub | GitHub | Repositórios, issues, pull requests, commits, Actions, releases e organizações |
| Suporte | FreeScout | Dashboard, inbox, conversas/tickets, clientes, histórico e configurações |
| Documentação | BookStack | Início, estantes, livros, capítulos, páginas, recentes e pesquisa |
| Monitoramento | Uptime Kuma | Dashboard, monitores, incidentes, status pages, notificações e configurações conforme a versão |
| Dados e Backend | Supabase Studio | Table Editor, SQL Editor, Database, Authentication, Storage, API, logs e configurações; somente Admin/Desenvolvedor |
| WhatsApp | WAHA ou Evolution dedicada | Instâncias, conexão, QR Code, status, webhooks, eventos e configurações; vendedores usam o inbox do CRM |
| Cofre | Vaultwarden | Meu cofre, logins, favoritos, organizações, coleções, compartilhados e administração |
| Administração | Authentik | Usuários, grupos, aplicações, providers, policies, flows, eventos e segurança; somente administradores |
| Marketing | Meta e Google Ads | Contas, campanhas, conjuntos, anúncios, leads, conversões, resultados e relatórios conforme APIs/produtos habilitados |

## Central de integrações

`Configurações → Integrações` agrupa conectores por Comercial, Financeiro, Desenvolvimento,
Marketing, Comunicação e Infraestrutura. Cada item exibe estado real, configuração ausente, teste
de conexão, última sincronização, logs sanitizados e erros/dead letters.

Um item pode existir como catálogo `not_implemented`, mas não pode aparecer como conectado nem
apontar para uma rota até a validação correspondente existir.
