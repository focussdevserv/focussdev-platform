# Catálogo desejado de navegação

Este arquivo registra a intenção de produto. Ele **não autoriza inventar rotas**. Antes de ativar
qualquer item no menu mestre é obrigatório registrar no checkpoint da stack: versão instalada,
rota real, papel autorizado, comportamento de autenticação e resultado do teste no navegador.

| Área Focussdev | Aplicação de origem | Itens candidatos a validar |
|---|---|---|
| Início | Focussdev | Dashboard executivo, Meu Dia, pendências, atalhos e notificações |
| CRM e Comercial | DeskcommCRM | Dashboard, leads, clientes, contatos, empresas, funil, oportunidades, follow-ups, atividades, campanhas, inbox, conversas e WhatsApp |
| Atendimento | DeskcommCRM + WAHA; Evolution dedicada no futuro | Caixa de entrada, conversas, contatos, WhatsApp e histórico |
| Comercial | DeskcommCRM + Documenso | Oportunidades, propostas, negociações, follow-ups e histórico |
| Financeiro | AureusERP | Dashboard, receitas, despesas, contas a receber/pagar, cobranças, recorrências, assinaturas, fluxo de caixa, categorias, centros de custo, contas bancárias e relatórios |
| Cobranças | AureusERP + Mercado Pago | Dashboard, cobranças, pagamentos, PIX, pendentes, pagos, vencidos e recorrências |
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
| Agenda | Google Calendar | Calendário, reuniões e eventos |
| Configurações | Focussdev | Empresa, equipe, integrações, segurança, domínios e infraestrutura |

Não haverá a área n8n. Processamento automático, webhooks, filas, retries e logs pertencem ao
Focussdev Integration Service e aparecem em `Configurações → Integrações`.

## Central de integrações

`Configurações → Integrações` agrupa conectores por Comercial, Financeiro, Desenvolvimento,
Marketing, Comunicação e Infraestrutura. Cada item exibe estado real, configuração ausente, teste
de conexão, última sincronização, logs sanitizados e erros/dead letters.

Um item pode existir como catálogo `not_implemented`, mas não pode aparecer como conectado nem
apontar para uma rota até a validação correspondente existir.

## Bibliotecas internas sob demanda

PDFKit, pdf-lib, React-PDF, Puppeteer, QRCode, bwip-js, JsBarcode, Sharp, Canvas, Chart.js,
ECharts, Recharts, ExcelJS, SheetJS, PapaParse, docx, Handlebars, Nodemailer, Zod, date-fns,
Decimal.js, libphonenumber-js e validadores brasileiros são candidatos de implementação, não
serviços da arquitetura. Só entram quando uma função concreta precisar deles, após verificar
manutenção, licença, compatibilidade e impacto na imagem. Para valores financeiros, a regra é
inteiro em centavos ou decimal exato; ponto flutuante binário não é aceito.
