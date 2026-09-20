# Matriz de Reutilização e Governança Arquitetural da Plataforma Focussdev

## Princípio Fundamental de Arquitetura

> **REUTILIZAR PRIMEIRO. INTEGRAR SEGUNDO. CRIAR POR ÚLTIMO.**  
> Nenhuma função, tela, formulário ou configuração deve ser desenvolvida do zero antes de verificar se ela já existe pronta em um dos 16 repositórios da plataforma.

---

## 1. Ordem de Preferência Técnica

1. **Utilizar o aplicativo original:**  
   Aproveitar o front-end, fluxos e telas já maduras do sistema open source via incorporação segura (iframe com SSO Authentik) ou atalho direto no menu.
2. **Utilizar suas APIs e Webhooks:**  
   Consumir endpoints oficiais e registrar webhooks para sincronização de dados e disparo de automações.
3. **Reutilizar componentes internos:**  
   Quando a arquitetura e a licença de código permitirem, reaproveitar componentes e esquemas de dados mantendo os avisos e créditos de licença originais.
4. **Adaptar apenas a camada visual e navegação:**  
   Aplicar o design system corporativo do Focussdev (Dark Mode, topologia de menu, topbar de busca global, central de notificações e controle de tenant).
5. **Criar código novo somente para o que for exclusivo do Focussdev:**  
   Desenvolver código nativo apenas para os componentes agregadores e integradores que não existem isoladamente em nenhum open source.

---

## 2. Matriz de Mapeamento: Necessidade vs. Sistema

| Necessidade do Ecossistema | Já existe pronto? | Sistema de Origem | Estratégia de Ação | Protocolo de Integração |
| :--- | :---: | :--- | :--- | :--- |
| **Clientes & Empresas** | **Sim** | DeskcommCRM | Reutilizar | API REST + Visualizador Nativo Hub |
| **Leads & Prospecção** | **Sim** | DeskcommCRM | Reutilizar | API REST + Webhooks de Captação |
| **Pipeline & Funil de Vendas** | **Sim** | DeskcommCRM | Reutilizar | Visualizador Kanban no Hub + Painel CRM |
| **Oportunidades & Follow-ups** | **Sim** | DeskcommCRM | Reutilizar | API REST + Alertas de Follow-up |
| **WhatsApp & Atendimento Comercial** | **Sim** | DeskcommCRM (WAHA) | Reutilizar | WAHA HTTP API + Webhooks em tempo real |
| **Tarefas & Work Items** | **Sim** | Plane | Reutilizar | API Plane + Kanban Board Integrado |
| **Projetos, Ciclos & Módulos** | **Sim** | Plane | Reutilizar | API Plane + Embed Plane App |
| **Contratos & Propostas** | **Sim** | Documenso | Reutilizar | API Documenso + Assinatura Digital |
| **Assinatura Eletrônica & Templates** | **Sim** | Documenso | Reutilizar | Documenso Embedding + Webhooks de Conclusão |
| **Financeiro (Receitas / Despesas)** | **Sim** | AureusERP | Reutilizar | API ERP + Dashboard Financeiro Hub |
| **Contas a Pagar / Receber / Cobranças** | **Sim** | AureusERP | Reutilizar | API ERP + Gateways Bancários |
| **Tickets, Suporte & Helpdesk** | **Sim** | FreeScout | Reutilizar | FreeScout Core API + Mailbox Webhooks |
| **Base de Conhecimento & Wikis** | **Sim** | BookStack | Reutilizar | API BookStack + Busca Global Integrada |
| **Monitoramento de Uptime & APIs** | **Sim** | Uptime Kuma | Reutilizar | Status Page API + Painel de Incidentes |
| **Monitoramento de Servidores & Docker** | **Sim** | Beszel | Reutilizar | Beszel Hub Agent + Métricas de Hardware |
| **Cofre de Senhas & Chaves de Acesso** | **Sim** | Vaultwarden | Reutilizar | Vaultwarden App (Zero-Knowledge / Criptografia) |
| **Login Central, SSO, 2FA & RBAC** | **Sim** | Authentik | Reutilizar | OpenID Connect (OIDC) + Proxy de Acesso |
| **PostgreSQL, Auth Técnico & Storage** | **Sim** | Supabase | Reutilizar | PostgreSQL Connection + S3 Storage API |
| **Renderização de PDFs em Background** | **Sim** | Gotenberg | Reutilizar | Gotenberg REST API (HTML/Markdown -> PDF) |
| **Edição & Ferramentas Avançadas de PDF** | **Sim** | Stirling-PDF | Reutilizar | Stirling-PDF Web Suite + Microserviço |
| **Formulários de Briefing & Pesquisas NPS**| **Sim** | Formbricks | Reutilizar | Formbricks Community API + Embedding |
| **Repositórios Git, CI/CD & Releases** | **Sim** | Forgejo | Reutilizar | Forgejo API + Git Hooks |
| **Cliente 360° (Visão Unificada)** | **Não** | **Focussdev** | **Criar** | Agregador: CRM + ERP + Suporte + Projetos |
| **Projeto 360° (Engenharia + Contrato)** | **Não** | **Focussdev** | **Criar** | Agregador: Plane + Forgejo + Documenso |
| **Timeline Unificada de Eventos** | **Não** | **Focussdev** | **Criar** | Barramento de Eventos (Event-Driven Gateway) |
| **Central de Ativos do Cliente** | **Não** | **Focussdev** | **Criar** | Unificação: Arquivos Supabase + Docs + Wiki |
| **Busca Global Cruzada** | **Não** | **Focussdev** | **Criar** | Indexador Focussdev consultando os 16 motores |
| **Central de Configurações Unificada** | **Não** | **Focussdev** | **Criar** | Hub de Governança + Status + Proxy de APIs |

---

## 3. Diretrizes para a Central de Configurações do Focussdev

1. **Ponto Único de Governança:**  
   A tela `Configurações` centraliza os 16 motores e as integrações externas em 16 abas organizadas, evitando duplicação e dispersão.
2. **Respeito ao Armazenamento Original:**  
   - Antes de criar qualquer campo, verificar onde aquela configuração é oficialmente armazenada e gerenciada pelo software correspondente.
   - **Com API Oficial:** Quando existir endpoint seguro para leitura e alteração, permitir configurar diretamente pelo Focussdev.
   - **Sem API Oficial Segura:** Não escrever diretamente nas tabelas internas do banco de dados da aplicação. Exibir o estado atual no Focussdev e fornecer um botão direto para a tela de parametrização original do módulo.
3. **Segurança de Secrets:**  
   - Chaves de API, senhas e tokens de provedores externos (Mercado Pago, Meta, Resend, Gemini) **nunca** são expostos em texto plano no front-end. Devem sempre ser retornados mascarados (ex: `AIzaSy••••••••••••3x9Q`).
   - O Vaultwarden opera sob modelo Zero-Knowledge: as credenciais ficam no cofre seguro e não são trafegadas no gateway.
4. **Monitoramento e Status Contínuo:**  
   - A aba `🟢 Status dos Módulos` exibe o diagnóstico em tempo real dos 16 motores (conectado, versão, latência e tipo de autenticação), com botão interativo para "Testar Conexão" a qualquer momento.
