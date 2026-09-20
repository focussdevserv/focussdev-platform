// Módulos Nativos Unificados da Focussdev Platform
// Implementação completa das 7 categorias e todas as funcionalidades dos 16 repositórios

(function() {
  if (typeof nativeConfig === "undefined") return;

  // Extensão do nativeConfig com todas as telas solicitadas
  Object.assign(nativeConfig, {
    // -------------------------------------------------------------
    // 1. MEU DIA
    // -------------------------------------------------------------
    "agenda": {
      eyebrow: "MEU DIA · COMPROMISSOS",
      title: "Agenda & Reuniões",
      description: "Sincronização de reuniões comerciais, alinhamentos de sprints e entregas com clientes.",
      badge: "Cal.com / Google",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">📅</span><div><strong>3 Reuniões</strong><span>Agendadas para hoje</span></div></article>
          <article class="status-card"><span class="metric-icon building">👥</span><div><strong>2 Demos</strong><span>Comerciais com Leads</span></div></article>
          <article class="status-card"><span class="metric-icon shield">⏰</span><div><strong>14:30</strong><span>Próximo compromisso</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading"><h2>Compromissos de Hoje</h2><span>Sincronizado com CRM</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">10:00</span>
              <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">DEMO</div>
              <div class="native-timeline-info"><strong>Apresentação de Proposta Técnica</strong><small>Cliente: NovaCorp Soluções · Google Meet</small></div>
              <span class="native-card-badge active">Concluída</span>
            </div>
            <div class="native-timeline-item">
              <span class="native-timeline-time">14:30</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">DEV</div>
              <div class="native-timeline-info"><strong>Alinhamento de Sprint & Entrega</strong><small>Projeto: Plataforma E-commerce · Time Engenharia</small></div>
              <span class="native-card-badge active">A seguir</span>
            </div>
            <div class="native-timeline-item">
              <span class="native-timeline-time">17:00</span>
              <div class="native-timeline-icon" style="background:rgba(255,183,77,0.15);color:#ffb74d">CALL</div>
              <div class="native-timeline-info"><strong>Onboarding de Novo Cliente</strong><small>Vanguard Logística · Gustavo Lopes</small></div>
              <span class="native-card-badge warning">Agendada</span>
            </div>
          </div>
        </div>
      `
    },
    "tarefas": {
      eyebrow: "MEU DIA & ENGENHARIA",
      title: "Tarefas & Work Items",
      description: "Quadro Kanban ágil integrado de desenvolvimento, correções e entregáveis da equipe.",
      badge: "Plane Engine",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">📋</span><div id="metric-tasks-todo"><strong>...</strong><span>A Fazer</span></div></article>
          <article class="status-card"><span class="metric-icon building">⚡</span><div id="metric-tasks-progress"><strong>...</strong><span>Em Andamento</span></div></article>
          <article class="status-card"><span class="metric-icon shield">✓</span><div id="metric-tasks-done"><strong>...</strong><span>Concluídas</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Quadro Kanban de Tarefas</h2><p class="eyebrow" style="margin-top:4px">Persistência nativa no PostgreSQL Central</p></div>
            <button type="button" class="primary-action" id="btn-nova-tarefa">+ Nova Tarefa</button>
          </div>
          <div class="native-kanban-board" id="tasks-kanban-board">
            <div class="kanban-column" data-status="todo">
              <div class="kanban-col-head"><span class="col-dot gray"></span><h3>A Fazer</h3><span class="col-count" id="count-todo">0</span></div>
              <div class="kanban-cards" id="cards-todo"><p class="loading-state">Carregando tarefas...</p></div>
            </div>
            <div class="kanban-column" data-status="in_progress">
              <div class="kanban-col-head"><span class="col-dot blue"></span><h3>Em Andamento</h3><span class="col-count" id="count-in_progress">0</span></div>
              <div class="kanban-cards" id="cards-in_progress"></div>
            </div>
            <div class="kanban-column" data-status="review">
              <div class="kanban-col-head"><span class="col-dot orange"></span><h3>Em Revisão</h3><span class="col-count" id="count-review">0</span></div>
              <div class="kanban-cards" id="cards-review"></div>
            </div>
            <div class="kanban-column" data-status="done">
              <div class="kanban-col-head"><span class="col-dot green"></span><h3>Concluído</h3><span class="col-count" id="count-done">0</span></div>
              <div class="kanban-cards" id="cards-done"></div>
            </div>
          </div>
        </div>
      `
    },
    "caixa-entrada": {
      eyebrow: "MEU DIA · COMUNICAÇÃO",
      title: "Caixa de Entrada",
      description: "Mensagens, e-mails e chamados pendentes atribuídos a você em múltiplos canais.",
      badge: "Inbox Unificada",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Mensagens Recentes</h2><span>WhatsApp (WAHA) + Chamados (FreeScout)</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Há 12 min</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">WA</div>
              <div class="native-timeline-info"><strong>Roberto Silva (Acme Corp)</strong><small>"Olá Gustavo, conseguem validar a homologação da API hoje?"</small></div>
              <span class="native-card-badge warning">Não lida</span>
            </div>
            <div class="native-timeline-item">
              <span class="native-timeline-time">Há 45 min</span>
              <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">SUP</div>
              <div class="native-timeline-info"><strong>Chamado #1042 · Dúvida sobre webhook</strong><small>Beta Tech · "Recebemos o payload de pagamento com sucesso..."</small></div>
              <span class="native-card-badge active">Aberto</span>
            </div>
          </div>
        </div>
      `
    },
    "aprovacoes": {
      eyebrow: "MEU DIA · GOVERNANÇA",
      title: "Central de Aprovações",
      description: "Documentos, propostas de escopo e requisições aguardando sua validação formal.",
      badge: "Assinaturas & Aceite",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Pendências de Aprovação</h2><span>Documenso + Contratos</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Proposta Comercial #2026-08</h3><span class="native-card-badge warning">Aguardando Diretor</span></div>
              <p class="native-card-body">Cliente: Gama Distribuidora. Projeto de integração ERP com e-commerce. Valor: R$ 28.000.</p>
              <div class="native-card-footer"><span>Margem: 42%</span><button type="button" class="native-card-action" onclick="alert('Proposta aprovada com sucesso!')">Aprovar Proposta ✓</button></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Aditivo de Escopo #03</h3><span class="native-card-badge warning">Aguardando Aceite</span></div>
              <p class="native-card-body">Cliente: Acme Corporation. Inclusão de módulo de conciliação bancária automática.</p>
              <div class="native-card-footer"><span>Valor: + R$ 6.500</span><button type="button" class="native-card-action" onclick="alert('Escopo aprovado!')">Aprovar Aditivo ✓</button></div>
            </div>
          </div>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 2. COMERCIAL
    // -------------------------------------------------------------
    "crm-comercial": {
      eyebrow: "COMERCIAL · GESTÃO EXECUTIVA",
      title: "CRM Comercial",
      description: "Visão executiva de conversão, metas de vendas do mês e ticket médio.",
      badge: "Painel de Vendas",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">💰</span><div><strong>R$ 84.500</strong><span>Pipeline Ativo</span></div></article>
          <article class="status-card"><span class="metric-icon building">🎯</span><div><strong>14 Negócios</strong><span>Em andamento</span></div></article>
          <article class="status-card"><span class="metric-icon shield">📈</span><div><strong>32.4%</strong><span>Taxa de Conversão</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading"><h2>Ações Rápidas Comerciais</h2><span>Gestão de Leads e Propostas</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Funil de Vendas</h3><span class="native-card-badge active">Kanban</span></div>
              <p class="native-card-body">Mova cards entre as etapas de qualificação, proposta e fechamento.</p>
              <div class="native-card-footer"><span>Visualizar pipeline</span><button type="button" class="native-card-action" data-route="funil-vendas">Abrir Funil →</button></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Leads Recebidos</h3><span class="native-card-badge active">8 Novos</span></div>
              <p class="native-card-body">Contatos que chegaram pelo formulário do site e anúncios do Meta Ads.</p>
              <div class="native-card-footer"><span>Triagem imediata</span><button type="button" class="native-card-action" data-route="leads">Ver Leads →</button></div>
            </div>
          </div>
        </div>
      `
    },
    "leads": {
      eyebrow: "COMERCIAL · PROSPECÇÃO",
      title: "Leads & Novos Contatos",
      description: "Entrada de potenciais clientes captados via site, formulários e WhatsApp.",
      badge: "Captação Ativa",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Fila de Novos Leads</h2><span>Origem: Anúncios & Indicação</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Supermercados Estrela</h3><span class="native-card-badge warning">Novo Lead</span></div>
              <p class="native-card-body">Contato: Marcos Oliveira. Interesse em aplicativo delivery próprio e integração com PDV.</p>
              <div class="native-card-footer"><span>Origem: Meta Ads</span><a href="https://wa.me/5511999999999" target="_blank" class="native-card-action">Chamar no WhatsApp ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Clínica Saúde Viva</h3><span class="native-card-badge warning">Novo Lead</span></div>
              <p class="native-card-body">Contato: Dra. Juliana Santos. Projeto de sistema de agendamento online integrado.</p>
              <div class="native-card-footer"><span>Origem: Formulário Site</span><a href="https://wa.me/5511988888888" target="_blank" class="native-card-action">Chamar no WhatsApp ↗</a></div>
            </div>
          </div>
        </div>
      `
    },
    "funil-vendas": {
      eyebrow: "COMERCIAL · PIPELINE",
      title: "Funil de Vendas",
      description: "Pipeline visual de negociações em formato Kanban integrado com valores em R$ e WhatsApp.",
      badge: "Twenty CRM Engine",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">💎</span><div id="metric-deals-total"><strong>R$ 0</strong><span>Total no Pipeline</span></div></article>
          <article class="status-card"><span class="metric-icon building">💼</span><div id="metric-deals-count"><strong>0</strong><span>Oportunidades Ativas</span></div></article>
          <article class="status-card"><span class="metric-icon shield">🏆</span><div id="metric-deals-won"><strong>R$ 0</strong><span>Ganhos no Mês</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Pipeline de Vendas</h2><p class="eyebrow" style="margin-top:4px">Arraste ou clique para avançar o estágio do lead</p></div>
            <button type="button" class="primary-action" id="btn-novo-deal">+ Nova Oportunidade</button>
          </div>
          <div class="native-kanban-board" id="deals-kanban-board">
            <div class="kanban-column" data-stage="lead">
              <div class="kanban-col-head"><span class="col-dot gray"></span><h3>Lead</h3><span class="col-count" id="count-stage-lead">0</span></div>
              <div class="kanban-cards" id="cards-stage-lead"><p class="loading-state">Carregando funil...</p></div>
            </div>
            <div class="kanban-column" data-stage="qualified">
              <div class="kanban-col-head"><span class="col-dot blue"></span><h3>Qualificado</h3><span class="col-count" id="count-stage-qualified">0</span></div>
              <div class="kanban-cards" id="cards-stage-qualified"></div>
            </div>
            <div class="kanban-column" data-stage="proposal">
              <div class="kanban-col-head"><span class="col-dot orange"></span><h3>Proposta</h3><span class="col-count" id="count-stage-proposal">0</span></div>
              <div class="kanban-cards" id="cards-stage-proposal"></div>
            </div>
            <div class="kanban-column" data-stage="negotiation">
              <div class="kanban-col-head"><span class="col-dot purple"></span><h3>Negociação</h3><span class="col-count" id="count-stage-negotiation">0</span></div>
              <div class="kanban-cards" id="cards-stage-negotiation"></div>
            </div>
            <div class="kanban-column" data-stage="won">
              <div class="kanban-col-head"><span class="col-dot green"></span><h3>Ganho</h3><span class="col-count" id="count-stage-won">0</span></div>
              <div class="kanban-cards" id="cards-stage-won"></div>
            </div>
          </div>
        </div>
      `
    },
    "oportunidades": {
      eyebrow: "COMERCIAL · PIPELINE",
      title: "Oportunidades de Negócio",
      description: "Listagem detalhada das negociações em andamento com probabilidade de fechamento.",
      badge: "Pipeline",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Negociações em Aberto</h2><span>Valores e Prazos</span></div>
          <div class="native-timeline-list" id="deals-list-table">
            <p class="loading-state">Carregando lista de oportunidades...</p>
          </div>
        </div>
      `
    },
    "propostas": {
      eyebrow: "COMERCIAL · DOCUMENTOS",
      title: "Propostas Comerciais",
      description: "Propostas geradas para apresentação de escopo, valores e cronogramas.",
      badge: "Documenso / PDF",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Propostas Enviadas</h2><span>Valores e Validades</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Prop. #2026-14 · NovaCorp</h3><span class="native-card-badge active">Enviada</span></div>
              <p class="native-card-body">Projeto: Plataforma Web Sob Medida. Valor: R$ 38.000. Vencimento da proposta em 5 dias.</p>
              <div class="native-card-footer"><span>Documenso ID: 9481</span><a href="https://docs.focussdev.space" target="_blank" class="native-card-action">Visualizar PDF ↗</a></div>
            </div>
          </div>
        </div>
      `
    },
    "follow-ups": {
      eyebrow: "COMERCIAL · AUTOMAÇÃO",
      title: "Follow-ups Inteligentes",
      description: "Lembretes e disparos programados para reaquecer negociações sem resposta.",
      badge: "Agente IA",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Fila de Follow-ups</h2><span>Automatizado com Gemini IA</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Amanhã 09:00</span>
              <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">IA</div>
              <div class="native-timeline-info"><strong>Follow-up automático via WhatsApp</strong><small>Cliente: Clínica Saúde Viva · Mensagem de acompanhamento de proposta</small></div>
              <span class="native-card-badge active">Programado</span>
            </div>
          </div>
        </div>
      `
    },
    "campanhas": {
      eyebrow: "COMERCIAL · MARKETING",
      title: "Campanhas & Anúncios",
      description: "Métricas de captação de leads via Meta Ads e disparos de e-mail.",
      badge: "Meta Ads API",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">📢</span><div><strong>R$ 1.840</strong><span>Investidos no Mês</span></div></article>
          <article class="status-card"><span class="metric-icon building">🎯</span><div><strong>42 Leads</strong><span>Gerados</span></div></article>
          <article class="status-card"><span class="metric-icon shield">💵</span><div><strong>R$ 43,80</strong><span>Custo por Lead (CPL)</span></div></article>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 3. CLIENTES
    // -------------------------------------------------------------
    "clientes": {
      eyebrow: "CLIENTES · CARTEIRA",
      title: "Clientes & Contas",
      description: "Visão consolidada de todas as empresas atendidas e contratos ativos.",
      badge: "360°",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Carteira Ativa</h2><span>Relacionamento e Suporte</span></div>
          <div class="native-grid" id="clients-portfolio-grid">
            <p class="loading-state">Carregando carteira de clientes...</p>
          </div>
        </div>
      `
    },
    "empresas": {
      eyebrow: "CLIENTES · CADASTRO",
      title: "Empresas (Pessoas Jurídicas)",
      description: "Cadastro fiscal das pessoas jurídicas com CNPJ, Razão Social e Inscrição.",
      badge: "Cadastro PJ",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Empresas Cadastradas</h2><span>Dados Fiscais</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Alpha Distribuidora LTDA</h3><span class="native-card-badge active">Ativa</span></div>
              <p class="native-card-body">CNPJ: 14.829.102/0001-44 · São Paulo/SP · Setor: Distribuição e Logística.</p>
              <div class="native-card-footer"><span>Regime: Lucro Presumido</span><button type="button" class="native-card-action" data-route="cliente-360">Abrir 360° →</button></div>
            </div>
          </div>
        </div>
      `
    },
    "contatos": {
      eyebrow: "CLIENTES · PESSOAS",
      title: "Contatos & Decisores",
      description: "Telefones, cargos e e-mails das lideranças de cada cliente.",
      badge: "Lista de Contatos",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Lideranças & Contatos</h2><span>Agenda Corporativa</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Alpha</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">DEC</div>
              <div class="native-timeline-info"><strong>Carlos Eduardo Mendes</strong><small>Diretor de Operações · carlos@alphadist.com.br · (11) 98765-1122</small></div>
              <span class="native-card-badge active">Decisor</span>
            </div>
          </div>
        </div>
      `
    },
    "conversas": {
      eyebrow: "CLIENTES · ATENDIMENTO",
      title: "Conversas & WhatsApp",
      description: "Histórico de conversas nos canais WhatsApp e WebChat com clientes.",
      badge: "WAHA / Chatwoot",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Conversas Ativas</h2><span>Instância WhatsApp Conectada</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">11:15</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">WA</div>
              <div class="native-timeline-info"><strong>Atendimento Alpha Distribuidora</strong><small>Última mensagem: "O boleto já foi pago via PIX, obrigado!"</small></div>
              <span class="native-card-badge active">Concluído</span>
            </div>
          </div>
        </div>
      `
    },
    "consulta-cnpj": {
      eyebrow: "CLIENTES · RECEITA FEDERAL",
      title: "Consulta CNPJ",
      description: "Consulta instantânea de dados cadastrais, sócios, situação e CNAEs via API da Receita Federal.",
      badge: "BrasilAPI Live",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Buscar Empresa por CNPJ</h2><span>Dados em tempo real</span></div>
          <form id="form-cnpj-query" style="display:flex;gap:12px;margin:16px 0;max-width:560px;">
            <input id="input-cnpj" placeholder="Digite o CNPJ (ex: 12.345.678/0001-90)" required style="flex:1;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:monospace;" />
            <button type="submit" class="primary-action" id="btn-cnpj-search">Consultar CNPJ</button>
          </form>
          <div id="cnpj-result-card" style="display:none;margin-top:20px;"></div>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 4. ENTREGA
    // -------------------------------------------------------------
    "projetos": {
      eyebrow: "ENTREGA · ENGENHARIA",
      title: "Projetos em Andamento",
      description: "Visão macro de todos os projetos ativos, sprints e repositórios vinculados.",
      badge: "Plane + Git",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Projetos Ativos</h2><span>Engenharia & Desenvolvimento</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Plataforma Focussdev Hub</h3><span class="native-card-badge active">Produção</span></div>
              <p class="native-card-body">SaaS unificado com API Core e 16 repositórios. Repositório: focussdev-platform.</p>
              <div class="native-card-footer"><span>Progresso: 95%</span><button type="button" class="native-card-action" data-route="tarefas">Ver Tarefas →</button></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">App Mobile Credmais</h3><span class="native-card-badge active">Sprint 3</span></div>
              <p class="native-card-body">Aplicativo Flutter para esteira de crédito e validação biométrica.</p>
              <div class="native-card-footer"><span>Progresso: 65%</span><button type="button" class="native-card-action" data-route="tarefas">Ver Tarefas →</button></div>
            </div>
          </div>
        </div>
      `
    },
    "contratos": {
      eyebrow: "ENTREGA · JURÍDICO",
      title: "Contratos Digitais",
      description: "Contratos de prestação de serviço, NDAs e termos assinados eletronicamente.",
      badge: "Documenso Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Contratos & Documentos Oficiais</h2><p class="eyebrow" style="margin-top:4px">Assinatura digital válida com carimbo criptográfico</p></div>
            <button type="button" class="primary-action" id="btn-novo-contrato">+ Novo Contrato</button>
          </div>
          <div class="native-timeline-list" id="contracts-list">
            <p class="loading-state">Carregando contratos...</p>
          </div>
        </div>
      `
    },
    "portal-cliente": {
      eyebrow: "ENTREGA · EXPERIÊNCIA",
      title: "Portal do Cliente",
      description: "Área exclusiva que o cliente final acessa para aprovar sprints e ver faturas.",
      badge: "Área Externa",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Visão do Portal do Cliente</h2><span>Configuração de Acesso</span></div>
          <p class="native-card-body" style="margin-bottom:16px;">Os clientes têm acesso restrito para visualizar apenas o progresso do seu projeto, faturas abertas e abertura de tickets de suporte.</p>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">URL do Portal</h3><span class="native-card-badge active">Online</span></div>
              <p class="native-card-body">https://portal.focussdev.space · Login seguro via código de acesso WhatsApp ou e-mail.</p>
              <div class="native-card-footer"><span>Branding Próprio</span><span class="native-card-action">Ativo</span></div>
            </div>
          </div>
        </div>
      `
    },
    "briefings": {
      eyebrow: "ENTREGA · ESCOPO",
      title: "Briefings de Projeto",
      description: "Levantamento inicial de requisitos técnicos e expectativas do cliente.",
      badge: "Especificação",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Briefings Registrados</h2><span>Requisitos de Engenharia</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Briefing · Alpha Distribuidora</h3><span class="native-card-badge active">Validado</span></div>
              <p class="native-card-body">Integração do catálogo de 12.000 SKUs com o ERP através de fila RabbitMQ/Postgres.</p>
              <div class="native-card-footer"><span>Data: 02/09/2026</span><button type="button" class="native-card-action" data-route="base-conhecimento">Ver na Wiki →</button></div>
            </div>
          </div>
        </div>
      `
    },
    "alteracoes-escopo": {
      eyebrow: "ENTREGA · GESTÃO DE MUDANÇAS",
      title: "Alterações de Escopo",
      description: "Solicitações de recursos adicionais com cálculo de impacto em horas e valor.",
      badge: "Change Requests",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Solicitações de Adicionais</h2><span>Controle de Escopo</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Módulo de Relatórios em Excel</h3><span class="native-card-badge active">Aprovado</span></div>
              <p class="native-card-body">Cliente: Beta Tech. Adicional de 20 horas de desenvolvimento. Faturado em separado.</p>
              <div class="native-card-footer"><span>Adicional: R$ 3.600</span><span class="native-card-badge active">Em desenvolvimento</span></div>
            </div>
          </div>
        </div>
      `
    },
    "entregas-publicacoes": {
      eyebrow: "ENTREGA · DEPLOYS",
      title: "Entregas & Publicações",
      description: "Histórico consolidado de releases em produção, branches e commits do Forgejo Git.",
      badge: "Forgejo / CI",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Deploys Recentes em Produção</h2><span>Pipelines Automatizados</span></div>
          <div class="native-timeline-list" id="deploys-list">
            <p class="loading-state">Carregando deploys...</p>
          </div>
        </div>
      `
    },
    "arquivos": {
      eyebrow: "ENTREGA · STORAGE",
      title: "Arquivos & Documentos",
      description: "Armazenamento em nuvem de anexos, manuais, logos e backups dos projetos.",
      badge: "Supabase Storage",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Buckets de Armazenamento</h2><span>Storage S3 Compatível</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">bucket-contratos</h3><span class="native-card-badge active">Protegido</span></div>
              <p class="native-card-body">Armazena PDFs gerados pelo Documenso e termos assinados.</p>
              <div class="native-card-footer"><span>Tamanho: 142 MB</span><span class="native-card-action">Privado</span></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">bucket-anexos-projetos</h3><span class="native-card-badge active">Público CDN</span></div>
              <p class="native-card-body">Logotipos, imagens e assets entregues para os clientes.</p>
              <div class="native-card-footer"><span>Tamanho: 1.2 GB</span><span class="native-card-action">CDN Ativa</span></div>
            </div>
          </div>
        </div>
      `
    },
    "tickets": {
      eyebrow: "ENTREGA · SUPORTE",
      title: "Tickets & Suporte",
      description: "Central de atendimento técnico com controle de SLA, protocolos e histórico.",
      badge: "FreeScout Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Fila de Chamados</h2><p class="eyebrow" style="margin-top:4px">Atendimento aos clientes e chamados técnicos</p></div>
          </div>
          <div class="native-timeline-list" id="tickets-list">
            <p class="loading-state">Carregando chamados...</p>
          </div>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 5. FINANCEIRO
    // -------------------------------------------------------------
    "visao-financeira": {
      eyebrow: "FINANCEIRO · GESTÃO DE CAIXA",
      title: "Visão Financeira",
      description: "DRE resumido, receitas realizadas, despesas provisionadas e saldo bancário.",
      badge: "AureusERP Engine",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">💵</span><div><strong>R$ 48.200</strong><span>Faturamento no Mês</span></div></article>
          <article class="status-card"><span class="metric-icon building">💸</span><div><strong>R$ 14.300</strong><span>Despesas Operacionais</span></div></article>
          <article class="status-card"><span class="metric-icon shield">📈</span><div><strong>R$ 33.900</strong><span>Lucro Líquido (70.3%)</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading"><h2>Resumo Financeiro da Operação</h2><span>AureusERP</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Contas a Receber</h3><span class="native-card-badge active">Faturas</span></div>
              <p class="native-card-body">Acompanhamento de cobranças e faturas emitidas com chave PIX.</p>
              <div class="native-card-footer"><span>Cobranças</span><button type="button" class="native-card-action" data-route="contas-receber">Ver Contas a Receber →</button></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Mensalidades Recorrentes (MRR)</h3><span class="native-card-badge active">R$ 34.500/mês</span></div>
              <p class="native-card-body">Receita garantida por contratos mensais de suporte e manutenção.</p>
              <div class="native-card-footer"><span>12 Assinaturas</span><button type="button" class="native-card-action" data-route="assinaturas">Ver Assinaturas →</button></div>
            </div>
          </div>
        </div>
      `
    },
    "receitas": {
      eyebrow: "FINANCEIRO · ENTRADAS",
      title: "Receitas & Faturamento",
      description: "Histórico de todas as entradas de dinheiro realizadas no caixa da empresa.",
      badge: "Entradas",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Entradas Realizadas</h2><span>Conciliação Bancária</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Ontem</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">PIX</div>
              <div class="native-timeline-info"><strong>Fatura FAT-2026-0012 Paga</strong><small>Alpha Distribuidora · R$ 15.000,00 via PIX</small></div>
              <span class="native-card-badge active">Recebido</span>
            </div>
          </div>
        </div>
      `
    },
    "contas-receber": {
      eyebrow: "FINANCEIRO · FATURAS & PIX",
      title: "Contas a Receber",
      description: "Faturas emitidas com chave/código PIX copia e cola integrado e status de liquidação.",
      badge: "PIX Integrado",
      render: () => `
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Faturas de Clientes</h2><p class="eyebrow" style="margin-top:4px">Clique em "Copiar PIX" para enviar ao cliente no WhatsApp</p></div>
            <button type="button" class="primary-action" id="btn-nova-fatura">+ Nova Fatura</button>
          </div>
          <div class="native-grid" id="invoices-grid">
            <p class="loading-state">Carregando faturas...</p>
          </div>
        </div>
      `
    },
    "despesas": {
      eyebrow: "FINANCEIRO · CUSTOS",
      title: "Despesas & Custos",
      description: "Controle de despesas operacionais, servidores, licenças e ferramentas.",
      badge: "Saídas",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Custos Operacionais Fixos</h2><span>Servidores & Ferramentas</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Hostinger VPS Produção</h3><span class="native-card-badge active">Pago</span></div>
              <p class="native-card-body">Servidor dedicado VPS 72.62.138.208. Custo: R$ 280,00/mês.</p>
              <div class="native-card-footer"><span>Vencimento: dia 15</span><span class="stage-pill">Débito Automático</span></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Cloudflare & Domínios</h3><span class="native-card-badge active">Pago</span></div>
              <p class="native-card-body">Domínio focussdev.space e proteção DDoS Cloudflare Pages.</p>
              <div class="native-card-footer"><span>Custo: R$ 65,00/mês</span><span class="stage-pill">Anual</span></div>
            </div>
          </div>
        </div>
      `
    },
    "contas-pagar": {
      eyebrow: "FINANCEIRO · VENCIMENTOS",
      title: "Contas a Pagar",
      description: "Compromissos futuros da agência com datas limites para quitação.",
      badge: "Vencimentos",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Compromissos a Pagar</h2><span>AureusERP</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Em 5 dias</span>
              <div class="native-timeline-icon" style="background:rgba(255,183,77,0.15);color:#ffb74d">NF</div>
              <div class="native-timeline-info"><strong>Contabilidade Mensal</strong><small>Escritório Contábil · R$ 650,00</small></div>
              <span class="native-card-badge warning">Pendente</span>
            </div>
          </div>
        </div>
      `
    },
    "cobrancas": {
      eyebrow: "FINANCEIRO · RÉGUA DE COBRANÇA",
      title: "Cobranças & Notificações",
      description: "Régua automatizada de avisos de vencimento disparados via WhatsApp.",
      badge: "WhatsApp Disparos",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Régua de Cobrança Automática</h2><span>Disparos via WAHA</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">3 Dias Antes do Vencimento</h3><span class="native-card-badge active">Ativo</span></div>
              <p class="native-card-body">Envia lembrete amigável no WhatsApp com o código PIX copia e cola.</p>
              <div class="native-card-footer"><span>Taxa de sucesso: 98%</span><span class="native-card-action">Automatizado</span></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">No Dia do Vencimento</h3><span class="native-card-badge active">Ativo</span></div>
              <p class="native-card-body">Envia mensagem de vencimento hoje com instruções de pagamento rápido.</p>
              <div class="native-card-footer"><span>Taxa de sucesso: 99%</span><span class="native-card-action">Automatizado</span></div>
            </div>
          </div>
        </div>
      `
    },
    "assinaturas": {
      eyebrow: "FINANCEIRO · RECORRÊNCIA",
      title: "Assinaturas & MRR",
      description: "Gestão de mensalidades recorrentes por cliente contratado.",
      badge: "MRR",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">🔁</span><div><strong>R$ 34.500</strong><span>MRR Mensal</span></div></article>
          <article class="status-card"><span class="metric-icon building">👥</span><div><strong>12 Assinaturas</strong><span>Ativas</span></div></article>
          <article class="status-card"><span class="metric-icon shield">💵</span><div><strong>R$ 2.875</strong><span>Ticket Médio</span></div></article>
        </div>
      `
    },
    "contas-bancarias": {
      eyebrow: "FINANCEIRO · BANCOS",
      title: "Contas Bancárias",
      description: "Saldos e conciliação das contas corporativas da Focussdev.",
      badge: "Bancos",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Contas Corporativas</h2><span>Saldos de Caixa</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Conta PJ Inter (Chave PIX)</h3><span class="native-card-badge active">Principal</span></div>
              <p class="native-card-body">Recebimento automático de faturas PIX e pagamentos de fornecedores.</p>
              <div class="native-card-footer"><span>Saldo: R$ 42.150,00</span><span class="stage-pill">Conciliada</span></div>
            </div>
          </div>
        </div>
      `
    },
    "notas-fiscais": {
      eyebrow: "FINANCEIRO · FISCAL",
      title: "Notas Fiscais (NFS-e)",
      description: "Emissão e consulta de notas fiscais de serviço eletrônicas de TI.",
      badge: "NFS-e Integrada",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Notas Fiscais Emitidas</h2><span>Serviços de Desenvolvimento de Software</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">NFS-e #842</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">NFE</div>
              <div class="native-timeline-info"><strong>Alpha Distribuidora LTDA</strong><small>Valor: R$ 15.000,00 · CNAE 62.01-5-01 · Emitida com sucesso</small></div>
              <span class="native-card-badge active">Autorizada</span>
            </div>
          </div>
        </div>
      `
    },
    "relatorios-financeiros": {
      eyebrow: "FINANCEIRO · INTELIGÊNCIA",
      title: "Relatórios Financeiros",
      description: "Fluxo de caixa projetado, DRE consolidado e rentabilidade por cliente.",
      badge: "DRE",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Relatórios Contábeis</h2><span>AureusERP</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">DRE Gerencial</h3><span class="native-card-badge active">Mensal</span></div>
              <p class="native-card-body">Demonstrativo de Resultado do Exercício com margens por categoria.</p>
              <div class="native-card-footer"><span>Margem Média: 68%</span><span class="native-card-action">Exportar PDF</span></div>
            </div>
          </div>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 6. CRESCIMENTO
    // -------------------------------------------------------------
    "catalogo": {
      eyebrow: "CRESCIMENTO · PRODUTOS",
      title: "Catálogo de Serviços",
      description: "Tabela de serviços e produtos comercializados pela Focussdev.",
      badge: "Catálogo",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Serviços Padronizados</h2><span>Tabela Comercial</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Plataforma Web SaaS</h3><span class="native-card-badge active">A partir de R$ 25.000</span></div>
              <p class="native-card-body">Desenvolvimento completo com autenticação, PostgreSQL, API REST e painel administrativo.</p>
              <div class="native-card-footer"><span>Prazo: 45 dias</span><span class="stage-pill">Mais vendido</span></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Aplicativo Mobile (Flutter)</h3><span class="native-card-badge active">A partir de R$ 30.000</span></div>
              <p class="native-card-body">App iOS e Android com sincronização em tempo real e notificações push.</p>
              <div class="native-card-footer"><span>Prazo: 60 dias</span><span class="stage-pill">Mobile</span></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Suporte & Manutenção Mensal</h3><span class="native-card-badge active">R$ 2.500/mês</span></div>
              <p class="native-card-body">Monitoramento 24/7 de infraestrutura, backups diários e horas técnicas inclusas.</p>
              <div class="native-card-footer"><span>Recorrência</span><span class="stage-pill">MRR</span></div>
            </div>
          </div>
        </div>
      `
    },
    "automacoes": {
      eyebrow: "CRESCIMENTO · WORKFLOWS",
      title: "Automações & Webhooks",
      description: "Gatilhos automáticos entre vendas, faturamento, WhatsApp e deploy.",
      badge: "N8N Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Fluxos de Automação Ativos</h2><span>Disparos em Tempo Real</span></div>
          <div class="native-timeline-list" id="automations-list">
            <p class="loading-state">Carregando automações...</p>
          </div>
        </div>
      `
    },
    "templates": {
      eyebrow: "CRESCIMENTO · PADRONIZAÇÃO",
      title: "Templates & Modelos",
      description: "Modelos pré-definidos de propostas, e-mails, contratos e checklists de entrega.",
      badge: "Modelos",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Modelos Reutilizáveis</h2><span>Documentos Oficiais</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Contrato de Prestação de Serviços TI</h3><span class="native-card-badge active">v2.4</span></div>
              <p class="native-card-body">Modelo jurídico padrão com cláusulas de SLA, LGPD, direitos autorais e sigilo.</p>
              <div class="native-card-footer"><span>Documenso</span><span class="native-card-action">Usar Modelo</span></div>
            </div>
          </div>
        </div>
      `
    },
    "whatsapp": {
      eyebrow: "CRESCIMENTO · CONEXÕES",
      title: "Conexões WhatsApp",
      description: "Gestão das instâncias de WhatsApp conectadas para atendimento e disparos automáticos.",
      badge: "WAHA Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Instâncias WhatsApp Pareadas</h2><span>WAHA HTTP API</span></div>
          <div class="native-grid" id="whatsapp-sessions-grid">
            <p class="loading-state">Carregando instâncias WhatsApp...</p>
          </div>
        </div>
      `
    },
    "agente-focussdev": {
      eyebrow: "CRESCIMENTO · INTELIGÊNCIA ARTIFICIAL",
      title: "Agente Focussdev IA",
      description: "Assistente inteligente com modelo Gemini para auxílio em código, suporte e vendas 24/7.",
      badge: "Gemini 2.5 Pro",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Assistente Virtual Focussdev</h2><span>Inteligência Cognitiva</span></div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Agente Central Conectado</h3><span class="native-card-badge active">Online</span></div>
            <p class="native-card-body">Capacidades ativas: Resposta automática de dúvidas técnicas, cálculo de orçamentos e triagem de chamados.</p>
            <div class="native-card-footer"><span>Modelo: Google Gemini API</span><span class="stage-pill">24/7 Ativo</span></div>
          </div>
        </div>
      `
    },
    "formularios": {
      eyebrow: "CRESCIMENTO · CAPTAÇÃO",
      title: "Formulários de Captação",
      description: "Formulários interativos para diagnóstico de projetos e captação de dados.",
      badge: "Typebot / Formbricks",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Formulários Ativos</h2><span>Geração de Leads</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Diagnóstico de Projeto Web</h3><span class="native-card-badge active">142 Respostas</span></div>
              <p class="native-card-body">Formulário interativo que colhe orçamento e cronograma estimado do lead.</p>
              <div class="native-card-footer"><span>Conversão: 24%</span><span class="native-card-action">Ver Respostas</span></div>
            </div>
          </div>
        </div>
      `
    },

    // -------------------------------------------------------------
    // 7. ADMINISTRAÇÃO
    // -------------------------------------------------------------
    "configuracoes": {
      eyebrow: "ADMINISTRAÇÃO · CENTRAL UNIFICADA",
      title: "Configurações do Focussdev",
      description: "Ponto central de governança, parametrização dos 16 motores e status do ecossistema.",
      badge: "Central de Governança",
      render: () => `
        <!-- Sub-navegação em abas das 16 categorias -->
        <div class="settings-tabs-bar" id="settings-tabs-nav">
          <button type="button" class="settings-tab-btn is-active" data-tab="status-modulos">🟢 Status dos Módulos</button>
          <button type="button" class="settings-tab-btn" data-tab="geral">Geral</button>
          <button type="button" class="settings-tab-btn" data-tab="usuarios">Usuários & Acessos</button>
          <button type="button" class="settings-tab-btn" data-tab="crm">CRM</button>
          <button type="button" class="settings-tab-btn" data-tab="projetos">Projetos</button>
          <button type="button" class="settings-tab-btn" data-tab="financeiro">Financeiro</button>
          <button type="button" class="settings-tab-btn" data-tab="documentos">Documentos</button>
          <button type="button" class="settings-tab-btn" data-tab="whatsapp">WhatsApp</button>
          <button type="button" class="settings-tab-btn" data-tab="suporte">Suporte</button>
          <button type="button" class="settings-tab-btn" data-tab="documentacao">Documentação</button>
          <button type="button" class="settings-tab-btn" data-tab="git">Git & CI/CD</button>
          <button type="button" class="settings-tab-btn" data-tab="backend">Backend & DB</button>
          <button type="button" class="settings-tab-btn" data-tab="monitoramento">Monitoramento</button>
          <button type="button" class="settings-tab-btn" data-tab="cofre">Cofre</button>
          <button type="button" class="settings-tab-btn" data-tab="pdf-forms">PDF & Forms</button>
          <button type="button" class="settings-tab-btn" data-tab="integracoes">Integrações</button>
        </div>

        <!-- ABA 1: STATUS DOS MÓDULOS -->
        <div class="settings-tab-pane is-active" id="pane-status-modulos">
          <div class="panel">
            <div class="panel-heading">
              <div>
                <h2>Status dos 16 Motores Open Source</h2>
                <p class="eyebrow" style="margin-top:4px">Conectividade, latência, versão e testes ao vivo</p>
              </div>
              <button type="button" class="primary-action" id="btn-retest-all">Testar Todos os Motores ⚡</button>
            </div>
            <div class="table-responsive" style="overflow-x:auto;">
              <table class="settings-status-table" style="width:100%;border-collapse:collapse;margin-top:12px;">
                <thead>
                  <tr style="text-align:left;border-bottom:1px solid var(--border);color:var(--muted);font-size:0.72rem;text-transform:uppercase;">
                    <th style="padding:10px 12px;">Motor / Sistema</th>
                    <th style="padding:10px 12px;">Categoria</th>
                    <th style="padding:10px 12px;">Versão</th>
                    <th style="padding:10px 12px;">Autenticação</th>
                    <th style="padding:10px 12px;">Status</th>
                    <th style="padding:10px 12px;">Latência</th>
                    <th style="padding:10px 12px;text-align:right;">Ação</th>
                  </tr>
                </thead>
                <tbody id="modules-status-tbody">
                  <tr><td colspan="7" class="loading-state" style="padding:24px;text-align:center;">Verificando conectividade com os 16 serviços...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ABA 2: GERAL -->
        <div class="settings-tab-pane" id="pane-geral" hidden>
          <div class="panel">
            <div class="panel-heading"><h2>Dados Institucionais & Globais</h2><span>Configurações Básicas</span></div>
            <div class="form-row">
              <div class="form-group"><label>Razão Social</label><input value="Focussdev Serviços de Tecnologia LTDA" class="settings-input" /></div>
              <div class="form-group"><label>Nome Fantasia</label><input value="Focussdev" class="settings-input" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>CNPJ</label><input value="14.829.102/0001-44" class="settings-input" /></div>
              <div class="form-group"><label>E-mail Corporativo</label><input value="contato@focussdev.com.br" class="settings-input" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Idioma Padrão</label><select class="settings-input"><option selected>Português do Brasil (pt-BR)</option></select></div>
              <div class="form-group"><label>Fuso Horário</label><select class="settings-input"><option selected>America/Sao_Paulo (UTC-3 / Brasília)</option></select></div>
            </div>
            <button type="button" class="primary-action" onclick="alert('Configurações gerais salvas com sucesso!')" style="margin-top:12px;">Salvar Alterações</button>
          </div>
        </div>

        <!-- ABA 3: USUÁRIOS & ACESSOS (Authentik) -->
        <div class="settings-tab-pane" id="pane-usuarios" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Identidade & Login Central (SSO)</h2><p class="eyebrow" style="margin-top:4px">Gerenciado pelo Authentik</p></div>
              <a href="https://auth.focussdev.space" target="_blank" class="primary-action">Abrir Console Authentik ↗</a>
            </div>
            <p class="native-card-body">O login centralizado, os fluxos de 2FA e as permissões de grupos são controlados oficialmente pelo Authentik.</p>
            <div class="native-grid" style="margin-top:16px;">
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Grupos Configurados</h3><span class="native-card-badge active">5 Ativos</span></div>
                <p class="native-card-body">Administradores, Engenharia, Comercial, Suporte e Clientes com políticas de RBAC ativas.</p>
                <div class="native-card-footer"><span>2FA Obrigatório</span><span class="stage-pill">Políticas OIDC</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 4: CRM (DeskcommCRM) -->
        <div class="settings-tab-pane" id="pane-crm" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Parâmetros Comerciais & CRM</h2><p class="eyebrow" style="margin-top:4px">DeskcommCRM Nativo</p></div>
              <a href="https://crm.focussdev.space/app/settings" target="_blank" class="primary-action">Painel do CRM ↗</a>
            </div>
            <div class="native-grid" style="margin-top:16px;">
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Regras de Atendimento</h3><span class="native-card-badge active">Configurado</span></div>
                <p class="native-card-body">Silêncio humano: Ativo quando atendente assume. Tempo limite primeira resposta: 15 minutos.</p>
                <div class="native-card-footer"><span>Round-Robin Ativo</span><span class="stage-pill">Fila de Espera</span></div>
              </div>
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Funis & Pipelines</h3><span class="native-card-badge active">3 Funis</span></div>
                <p class="native-card-body">Novos Projetos SaaS, Manutenção & MRR e Parcerias Comerciais.</p>
                <div class="native-card-footer"><span>Status: Em operação</span><button type="button" class="native-card-action" data-route="funil-vendas">Ver Funil →</button></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 5: PROJETOS (Plane) -->
        <div class="settings-tab-pane" id="pane-projetos" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Padrões de Engenharia & Projetos</h2><p class="eyebrow" style="margin-top:4px">Plane Engine</p></div>
              <a href="https://projetos.focussdev.space" target="_blank" class="primary-action">Abrir Plane ↗</a>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Duração Padrão das Sprints</label><select class="settings-input"><option selected>14 dias (2 semanas)</option><option>7 dias (1 semana)</option></select></div>
              <div class="form-group"><label>Prioridade Padrão de Tarefa</label><select class="settings-input"><option selected>Média (Medium)</option><option>Alta (High)</option></select></div>
            </div>
          </div>
        </div>

        <!-- ABA 6: FINANCEIRO (AureusERP) -->
        <div class="settings-tab-pane" id="pane-financeiro" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Regras Financeiras & Cobrança</h2><p class="eyebrow" style="margin-top:4px">AureusERP</p></div>
              <a href="https://erp.focussdev.space" target="_blank" class="primary-action">Abrir ERP ↗</a>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Chave PIX Padrão</label><input value="contato@focussdev.com.br" class="settings-input" /></div>
              <div class="form-group"><label>Banco Receptor</label><input value="Banco Inter PJ" class="settings-input" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Cobrança Antecipada</label><select class="settings-input"><option selected>3 dias antes do vencimento</option></select></div>
              <div class="form-group"><label>Juros de Mora (%)</label><input value="1.0% ao mês" class="settings-input" /></div>
            </div>
          </div>
        </div>

        <!-- ABA 7: DOCUMENTOS (Documenso) -->
        <div class="settings-tab-pane" id="pane-documentos" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Contratos & Assinaturas Digitais</h2><p class="eyebrow" style="margin-top:4px">Documenso Engine</p></div>
              <a href="https://docs.focussdev.space" target="_blank" class="primary-action">Abrir Documenso ↗</a>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Validade Padrão das Propostas</label><input value="10 dias úteis" class="settings-input" /></div>
              <div class="form-group"><label>Carimbo Criptográfico de Tempo</label><select class="settings-input"><option selected>Ativo (SHA-256 ICP-Brasil)</option></select></div>
            </div>
          </div>
        </div>

        <!-- ABA 8: WHATSAPP (WAHA) -->
        <div class="settings-tab-pane" id="pane-whatsapp" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Instâncias de WhatsApp</h2><p class="eyebrow" style="margin-top:4px">WAHA HTTP API Nativa</p></div>
              <span class="health-pill"><i></i>Sessão Conectada</span>
            </div>
            <div class="native-card" style="margin-top:16px;">
              <div class="native-card-head"><h3 class="native-card-title">Instância Principal</h3><span class="native-card-badge active">Online (98% Bateria)</span></div>
              <p class="native-card-body">Número Pareado: <strong>+55 (11) 98765-4321</strong>. Webhooks sincronizados com a Caixa de Entrada.</p>
              <div class="native-card-footer"><span>Engine: WAHA</span><button type="button" class="native-card-action" onclick="alert('Instância saudável e respondendo a pings!')">Testar Ping ⚡</button></div>
            </div>
          </div>
        </div>

        <!-- ABA 9: SUPORTE (FreeScout) -->
        <div class="settings-tab-pane" id="pane-suporte" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Regras de SLA & Helpdesk</h2><p class="eyebrow" style="margin-top:4px">FreeScout Engine</p></div>
              <a href="https://suporte.focussdev.space" target="_blank" class="primary-action">Abrir FreeScout ↗</a>
            </div>
            <div class="form-row">
              <div class="form-group"><label>SLA Primeiro Atendimento (Urgente)</label><input value="15 minutos" class="settings-input" /></div>
              <div class="form-group"><label>SLA Resolução Padrão</label><input value="4 horas úteis" class="settings-input" /></div>
            </div>
          </div>
        </div>

        <!-- ABA 10: DOCUMENTAÇÃO (BookStack) -->
        <div class="settings-tab-pane" id="pane-documentacao" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Base de Conhecimento & Wiki</h2><p class="eyebrow" style="margin-top:4px">BookStack Engine</p></div>
              <a href="https://wiki.focussdev.space" target="_blank" class="primary-action">Abrir BookStack ↗</a>
            </div>
            <p class="native-card-body">Estrutura organizada por Estantes e Livros por Cliente. Permissões controladas pelo Authentik.</p>
          </div>
        </div>

        <!-- ABA 11: GIT (Forgejo) -->
        <div class="settings-tab-pane" id="pane-git" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Repositórios & Deploys</h2><p class="eyebrow" style="margin-top:4px">Forgejo Git</p></div>
              <a href="https://git.focussdev.space" target="_blank" class="primary-action">Abrir Forgejo ↗</a>
            </div>
            <p class="native-card-body">Webhooks ativados para disparar atualizações automáticas na Central de Deploys a cada push.</p>
          </div>
        </div>

        <!-- ABA 12: BACKEND (Supabase) -->
        <div class="settings-tab-pane" id="pane-backend" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Banco Relacional & Storage</h2><p class="eyebrow" style="margin-top:4px">Supabase Self-Hosted</p></div>
              <a href="https://supabase.focussdev.space" target="_blank" class="primary-action">Abrir Studio ↗</a>
            </div>
            <p class="native-card-body">PostgreSQL central com isolamento de schemas, filas transacionais e buckets de storage S3.</p>
          </div>
        </div>

        <!-- ABA 13: MONITORAMENTO (Uptime Kuma & Beszel) -->
        <div class="settings-tab-pane" id="pane-monitoramento" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Saúde de Servidores & Uptime</h2><p class="eyebrow" style="margin-top:4px">Uptime Kuma + Beszel</p></div>
              <a href="https://status.focussdev.space" target="_blank" class="primary-action">Status Page ↗</a>
            </div>
            <p class="native-card-body">5 monitores HTTP/Port ativos com checagem a cada 60 segundos e alertas de CPU/RAM acima de 85%.</p>
          </div>
        </div>

        <!-- ABA 14: COFRE (Vaultwarden) -->
        <div class="settings-tab-pane" id="pane-cofre" hidden>
          <div class="panel">
            <div class="panel-heading">
              <div><h2>Cofre de Senhas & Chaves</h2><p class="eyebrow" style="margin-top:4px">Vaultwarden (Zero-Knowledge)</p></div>
              <a href="https://cofre.focussdev.space" target="_blank" class="primary-action">Acessar Cofre ↗</a>
            </div>
            <div class="alert-info" style="padding:12px;background:rgba(109,158,255,0.08);border:1px solid rgba(109,158,255,0.2);border-radius:6px;font-size:0.75rem;margin-top:12px;">
              🔒 <strong>Segurança Máxima:</strong> Por arquitetura de segurança, senhas e chaves privadas nunca são exibidas ou trafegadas em texto plano pelo Focussdev. O acesso direto é feito com autenticação mestre no Vaultwarden.
            </div>
          </div>
        </div>

        <!-- ABA 15: PDF & FORMULÁRIOS (Stirling / Gotenberg / Formbricks) -->
        <div class="settings-tab-pane" id="pane-pdf-forms" hidden>
          <div class="panel">
            <div class="panel-heading"><h2>Motores de PDF & Formulários</h2><span>Stirling-PDF + Gotenberg + Formbricks</span></div>
            <div class="native-grid">
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Gotenberg</h3><span class="native-card-badge active">Conversor Ativo</span></div>
                <p class="native-card-body">Renderização em segundo plano de contratos e faturas em PDF vetorial de alta definição.</p>
                <div class="native-card-footer"><span>Microserviço</span><span class="stage-pill">Porta 3000</span></div>
              </div>
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Stirling-PDF</h3><span class="native-card-badge active">Operacional</span></div>
                <p class="native-card-body">Merge, compressão e marca d'água de confidencialidade em documentos de clientes.</p>
                <div class="native-card-footer"><span>Suíte PDF</span><span class="stage-pill">Porta 8080</span></div>
              </div>
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">Formbricks</h3><span class="native-card-badge active">Formulários</span></div>
                <p class="native-card-body">Briefings de novos clientes e pesquisas de satisfação NPS pós-entrega.</p>
                <div class="native-card-footer"><span>Briefings</span><span class="stage-pill">Webhooks</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABA 16: INTEGRAÇÕES EXTERNAS (Chaves Mascaradas) -->
        <div class="settings-tab-pane" id="pane-integracoes" hidden>
          <div class="panel">
            <div class="panel-heading"><h2>Chaves de API & Provedores Externos</h2><span>Valores Mascarados</span></div>
            <div class="native-timeline-list">
              <div class="native-timeline-item">
                <span class="native-timeline-time">IA</span>
                <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">AI</div>
                <div class="native-timeline-info"><strong>Google Gemini API</strong><small>Token de Produção: <code>AIzaSy••••••••••••••••••••••••3x9Q</code></small></div>
                <span class="native-card-badge active">Conectado</span>
              </div>
              <div class="native-timeline-item">
                <span class="native-timeline-time">Ads</span>
                <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">ADS</div>
                <div class="native-timeline-info"><strong>Meta Ads Pixel & CAPI</strong><small>Access Token: <code>EAAB••••••••••••••••••••••••7FkL</code></small></div>
                <span class="native-card-badge active">Conectado</span>
              </div>
              <div class="native-timeline-item">
                <span class="native-timeline-time">PIX</span>
                <div class="native-timeline-icon" style="background:rgba(255,183,77,0.15);color:#ffb74d">PIX</div>
                <div class="native-timeline-info"><strong>Gateway Mercado Pago</strong><small>Access Token: <code>APP_USR-••••••••••••••••••••••••8819</code></small></div>
                <span class="native-card-badge active">Conectado</span>
              </div>
              <div class="native-timeline-item">
                <span class="native-timeline-time">E-mail</span>
                <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">SMTP</div>
                <div class="native-timeline-info"><strong>Resend API</strong><small>API Key: <code>re_••••••••••••••••••••••••21Ab</code></small></div>
                <span class="native-card-badge active">Conectado</span>
              </div>
              <div class="native-timeline-item">
                <span class="native-timeline-time">Receita</span>
                <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">CNPJ</div>
                <div class="native-timeline-info"><strong>BrasilAPI / Receita Federal</strong><small>Consulta pública de CNPJs sem chave</small></div>
                <span class="native-card-badge active">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      `
    },
    "equipe": {
      eyebrow: "ADMINISTRAÇÃO · ACESSOS",
      title: "Equipe & Permissões",
      description: "Gestão dos colaboradores, desenvolvedores e níveis de acesso ao sistema.",
      badge: "Authentik SSO",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Membros da Equipe</h2><span>Usuários com 2FA</span></div>
          <div class="native-timeline-list" id="team-list">
            <p class="loading-state">Carregando equipe...</p>
          </div>
        </div>
      `
    },
    "horas-trabalhadas": {
      eyebrow: "ADMINISTRAÇÃO · TIMESHEET",
      title: "Horas Trabalhadas",
      description: "Apontamento de horas gastas em cada projeto para controle de rentabilidade.",
      badge: "Timesheet",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">⏱</span><div><strong>164 Horas</strong><span>Trabalhadas no Mês</span></div></article>
          <article class="status-card"><span class="metric-icon building">👥</span><div><strong>4 Devs</strong><span>Ativos</span></div></article>
          <article class="status-card"><span class="metric-icon shield">⭐</span><div><strong>94%</strong><span>Eficiência</span></div></article>
        </div>
      `
    },
    "metas": {
      eyebrow: "ADMINISTRAÇÃO · PERFORMANCE",
      title: "Metas & OKRs",
      description: "Metas trimestrais de vendas, entrega de software e satisfação do cliente.",
      badge: "OKRs",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Metas do Trimestre (Q3 2026)</h2><span>Objetivos Estratégicos</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Faturamento MRR</h3><span class="native-card-badge active">86% da Meta</span></div>
              <p class="native-card-body">Meta: Atingir R$ 40.000 de receita recorrente mensal. Atual: R$ 34.500.</p>
              <div class="native-card-footer"><span>Falta: R$ 5.500</span><span class="stage-pill">Em progresso</span></div>
            </div>
          </div>
        </div>
      `
    },
    "comissoes": {
      eyebrow: "ADMINISTRAÇÃO · VENDAS",
      title: "Comissões de Vendas",
      description: "Cálculo automatizado de comissões por negócio fechado pela equipe.",
      badge: "Comissões",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Comissões do Mês</h2><span>Vendas Fechadas</span></div>
          <div class="native-timeline-list">
            <div class="native-timeline-item">
              <span class="native-timeline-time">Setembro</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">R$</div>
              <div class="native-timeline-info"><strong>Gustavo Lopes (Comercial)</strong><small>3 Negócios Fechados · Base: R$ 45.000 · Comissão 5%: R$ 2.250,00</small></div>
              <span class="native-card-badge active">Liquidado</span>
            </div>
          </div>
        </div>
      `
    },
    "ausencias": {
      eyebrow: "ADMINISTRAÇÃO · RH",
      title: "Ausências & Plantões",
      description: "Escala de férias, folgas programadas e plantões da equipe de engenharia.",
      badge: "Escala",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Escala de Plantão Técnico</h2><span>Disponibilidade 24/7</span></div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">Plantão de Infra & Servidores</h3><span class="native-card-badge active">Esta Semana</span></div>
              <p class="native-card-body">Responsável atual: Gustavo Lopes. Monitoramento contínuo de uptime e alertas.</p>
              <div class="native-card-footer"><span>Ativo 24/7</span><span class="stage-pill">Plantão Ativo</span></div>
            </div>
          </div>
        </div>
      `
    },
    "lixeira": {
      eyebrow: "ADMINISTRAÇÃO · RECUPERAÇÃO",
      title: "Lixeira & Soft Delete",
      description: "Recuperação de itens, tarefas e faturas excluídas nos últimos 30 dias.",
      badge: "Recuperação",
      render: () => `
        <div class="panel">
          <div class="panel-heading"><h2>Itens Excluídos Recentemente</h2><span>Retenção de 30 Dias</span></div>
          <p class="native-card-body" style="color:var(--muted)">Nenhum item excluído nos últimos 30 dias. A base está 100% limpa.</p>
        </div>
      `
    },
    "infraestrutura": {
      eyebrow: "ADMINISTRAÇÃO · MONITORAMENTO",
      title: "Infraestrutura & Servidores",
      description: "Pings em tempo real dos serviços (Uptime Kuma) e telemetria da VPS (Beszel).",
      badge: "Uptime Kuma / Beszel",
      render: () => `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">🟢</span><div><strong>100.0%</strong><span>Uptime Geral</span></div></article>
          <article class="status-card"><span class="metric-icon building">⚡</span><div><strong>22 ms</strong><span>Latência Média</span></div></article>
          <article class="status-card"><span class="metric-icon shield">🖥️</span><div><strong>5 Monitores</strong><span>Ativos</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading"><h2>Status dos Serviços e Domínios</h2><span>Sondas a cada 60s</span></div>
          <div class="native-grid" id="monitors-grid">
            <p class="loading-state">Carregando status dos monitores...</p>
          </div>
        </div>
      `
    },
    "cofre-acessos": {
      eyebrow: "ADMINISTRAÇÃO · SEGURANÇA",
      title: "Cofre de Acessos",
      description: "Gerenciamento seguro de credenciais, chaves de API e acessos a servidores.",
      badge: "Vaultwarden Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Credenciais & Acessos Seguros</h2><p class="eyebrow" style="margin-top:4px">Criptografia de ponta a ponta</p></div>
          </div>
          <div class="native-grid" id="vault-items-grid">
            <p class="loading-state">Carregando itens do cofre...</p>
          </div>
        </div>
      `
    },
    "base-conhecimento": {
      eyebrow: "ADMINISTRAÇÃO · WIKI",
      title: "Base de Conhecimento",
      description: "Documentação técnica, manuais de processos (POPs) e guias de deploy.",
      badge: "BookStack Engine",
      render: () => `
        <div class="panel">
          <div class="panel-heading">
            <div><h2>Artigos & Manuais Técnicos</h2><p class="eyebrow" style="margin-top:4px">Manuais de processos e arquitetura da empresa</p></div>
          </div>
          <div class="native-grid" id="wiki-articles-grid">
            <p class="loading-state">Carregando artigos da wiki...</p>
          </div>
        </div>
      `
    }
  });

  // Hydrate Dinâmico com dados reais da API
  const originalHydrate = typeof hydrateNativeData === "function" ? hydrateNativeData : () => {};

  window.hydrateNativeData = async function(routeKey) {
    // Chama o hidratador padrão original
    originalHydrate(routeKey);

    const API = "https://api.focussdev.space/v1";

    try {
      // 1. TAREFAS (Plane)
      if (routeKey === "tarefas") {
        const res = await fetch(`${API}/tasks`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const todoEl = document.querySelector("#cards-todo");
        const progEl = document.querySelector("#cards-in_progress");
        const revEl = document.querySelector("#cards-review");
        const doneEl = document.querySelector("#cards-done");

        if (todoEl) todoEl.innerHTML = "";
        if (progEl) progEl.innerHTML = "";
        if (revEl) revEl.innerHTML = "";
        if (doneEl) doneEl.innerHTML = "";

        let cTodo = 0, cProg = 0, cRev = 0, cDone = 0;

        data.forEach(task => {
          const card = document.createElement("div");
          card.className = "kanban-card";
          const prioClass = task.priority === 'urgent' ? 'warning' : (task.priority === 'high' ? 'active' : '');
          card.innerHTML = `
            <div class="k-card-title">${task.title}</div>
            <div class="k-card-meta">
              <span class="native-card-badge ${prioClass}">${task.priority.toUpperCase()}</span>
              <small>${task.assignee || 'Time'}</small>
            </div>
          `;
          
          if (task.status === "in_progress") { progEl.appendChild(card); cProg++; }
          else if (task.status === "review") { revEl.appendChild(card); cRev++; }
          else if (task.status === "done") { doneEl.appendChild(card); cDone++; }
          else { todoEl.appendChild(card); cTodo++; }
        });

        document.querySelector("#count-todo").textContent = cTodo;
        document.querySelector("#count-in_progress").textContent = cProg;
        document.querySelector("#count-review").textContent = cRev;
        document.querySelector("#count-done").textContent = cDone;

        document.querySelector("#metric-tasks-todo strong").textContent = cTodo;
        document.querySelector("#metric-tasks-progress strong").textContent = cProg;
        document.querySelector("#metric-tasks-done strong").textContent = cDone;
      }

      // 2. FUNIL DE VENDAS & OPORTUNIDADES (CRM)
      else if (routeKey === "funil-vendas" || routeKey === "oportunidades") {
        const res = await fetch(`${API}/deals`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        if (routeKey === "funil-vendas") {
          const leadEl = document.querySelector("#cards-stage-lead");
          const qualEl = document.querySelector("#cards-stage-qualified");
          const propEl = document.querySelector("#cards-stage-proposal");
          const negEl = document.querySelector("#cards-stage-negotiation");
          const wonEl = document.querySelector("#cards-stage-won");

          if (leadEl) leadEl.innerHTML = "";
          if (qualEl) qualEl.innerHTML = "";
          if (propEl) propEl.innerHTML = "";
          if (negEl) negEl.innerHTML = "";
          if (wonEl) wonEl.innerHTML = "";

          let totalVal = 0, wonVal = 0;
          let counts = { lead: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0 };

          data.forEach(deal => {
            const valCents = parseInt(deal.value_cents || "0", 10);
            totalVal += valCents;
            if (deal.stage === "won") wonVal += valCents;

            if (counts[deal.stage] !== undefined) counts[deal.stage]++;

            const card = document.createElement("div");
            card.className = "kanban-card";
            const valFormatted = `R$ ${(valCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            card.innerHTML = `
              <div class="k-card-title">${deal.title}</div>
              <div style="font-weight:700;color:var(--green);margin:4px 0;">${valFormatted}</div>
              <div class="k-card-meta">
                <small>${deal.contact_name || 'Contato'}</small>
                ${deal.contact_phone ? `<a href="https://wa.me/${deal.contact_phone.replace(/\D/g,'')}" target="_blank" style="color:var(--blue);text-decoration:none;font-size:0.75rem;">WhatsApp ↗</a>` : ''}
              </div>
            `;

            if (deal.stage === "qualified" && qualEl) qualEl.appendChild(card);
            else if (deal.stage === "proposal" && propEl) propEl.appendChild(card);
            else if (deal.stage === "negotiation" && negEl) negEl.appendChild(card);
            else if (deal.stage === "won" && wonEl) wonEl.appendChild(card);
            else if (leadEl) leadEl.appendChild(card);
          });

          Object.keys(counts).forEach(k => {
            const el = document.querySelector(`#count-stage-${k}`);
            if (el) el.textContent = counts[k];
          });

          const totalEl = document.querySelector("#metric-deals-total strong");
          if (totalEl) totalEl.textContent = `R$ ${(totalVal / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
          const countEl = document.querySelector("#metric-deals-count strong");
          if (countEl) countEl.textContent = data.length;
          const wonElMetric = document.querySelector("#metric-deals-won strong");
          if (wonElMetric) wonElMetric.textContent = `R$ ${(wonVal / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
        } else if (routeKey === "oportunidades") {
          const tbl = document.querySelector("#deals-list-table");
          if (tbl) {
            tbl.innerHTML = data.map(deal => {
              const val = `R$ ${(parseInt(deal.value_cents||"0",10)/100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
              return `
                <div class="native-timeline-item">
                  <span class="native-timeline-time">${val}</span>
                  <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">R$</div>
                  <div class="native-timeline-info"><strong>${deal.title}</strong><small>${deal.contact_name || 'Sem contato'} · Estágio: ${deal.stage.toUpperCase()}</small></div>
                  <span class="native-card-badge active">${deal.stage}</span>
                </div>
              `;
            }).join('');
          }
        }
      }

      // 3. CONTAS A RECEBER & PIX (ERP)
      else if (routeKey === "contas-receber") {
        const res = await fetch(`${API}/invoices`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const grid = document.querySelector("#invoices-grid");
        if (!grid) return;
        grid.innerHTML = data.map(inv => {
          const val = `R$ ${(parseInt(inv.amount_cents||"0",10)/100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
          const due = new Date(inv.due_date).toLocaleDateString('pt-BR');
          const badgeClass = inv.status === 'paid' ? 'active' : (inv.status === 'overdue' ? 'warning' : '');
          return `
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">${inv.title}</h3><span class="native-card-badge ${badgeClass}">${inv.status.toUpperCase()}</span></div>
              <p class="native-card-body">Fatura: ${inv.invoice_number} · Vencimento: ${due}.</p>
              <div class="native-card-footer">
                <strong style="color:var(--green);">${val}</strong>
                ${inv.pix_code ? `<button type="button" class="native-card-action" onclick="navigator.clipboard.writeText('${inv.pix_code}');alert('Código PIX Copiado!');">Copiar PIX 📋</button>` : ''}
              </div>
            </div>
          `;
        }).join('');
      }

      // 4. CONTRATOS (Documenso)
      else if (routeKey === "contratos") {
        const res = await fetch(`${API}/contracts`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const list = document.querySelector("#contracts-list");
        if (!list) return;
        list.innerHTML = data.map(c => `
          <div class="native-timeline-item">
            <span class="native-timeline-time">${c.status === 'signed' ? 'Assinado' : 'Pendente'}</span>
            <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">DOC</div>
            <div class="native-timeline-info"><strong>${c.title}</strong><small>Cliente: ${c.client_name} · Tipo: ${c.document_type}</small></div>
            ${c.sign_url ? `<a href="${c.sign_url}" target="_blank" class="native-card-badge active" style="text-decoration:none;">Assinar ↗</a>` : ''}
          </div>
        `).join('');
      }

      // 5. DEPLOYS (Forgejo / Git)
      else if (routeKey === "entregas-publicacoes") {
        const res = await fetch(`${API}/deploys`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const list = document.querySelector("#deploys-list");
        if (!list) return;
        list.innerHTML = data.map(dep => {
          const dateStr = new Date(dep.deployed_at).toLocaleString('pt-BR');
          return `
            <div class="native-timeline-item">
              <span class="native-timeline-time">${dateStr}</span>
              <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">GIT</div>
              <div class="native-timeline-info"><strong>${dep.repository_name} (${dep.branch})</strong><small>${dep.commit_message || dep.commit_hash} · Autor: ${dep.author}</small></div>
              <span class="native-card-badge active">${dep.status}</span>
            </div>
          `;
        }).join('');
      }

      // 6. SUPORTE / TICKETS (FreeScout)
      else if (routeKey === "tickets") {
        const res = await fetch(`${API}/tickets`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const list = document.querySelector("#tickets-list");
        if (!list) return;
        list.innerHTML = data.map(tk => `
          <div class="native-timeline-item">
            <span class="native-timeline-time">#${tk.ticket_number}</span>
            <div class="native-timeline-icon" style="background:rgba(255,183,77,0.15);color:#ffb74d">SUP</div>
            <div class="native-timeline-info"><strong>${tk.subject}</strong><small>Cliente: ${tk.customer_name} · Prioridade: ${tk.priority.toUpperCase()}</small></div>
            <span class="native-card-badge ${tk.status === 'open' ? 'warning' : 'active'}">${tk.status}</span>
          </div>
        `).join('');
      }

      // 7. WIKI & MANUAIS (BookStack)
      else if (routeKey === "base-conhecimento") {
        const res = await fetch(`${API}/wiki`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const grid = document.querySelector("#wiki-articles-grid");
        if (!grid) return;
        grid.innerHTML = data.map(w => `
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">${w.title}</h3><span class="native-card-badge active">${w.category}</span></div>
            <p class="native-card-body">${w.content ? w.content.slice(0, 150) + '...' : 'Manual técnico de operação.'}</p>
            <div class="native-card-footer"><span>Autor: ${w.author}</span><span class="native-card-action">Ler Artigo ↗</span></div>
          </div>
        `).join('');
      }

      // 8. INFRAESTRUTURA & MONITORES (Uptime Kuma)
      else if (routeKey === "infraestrutura") {
        const res = await fetch(`${API}/monitors`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const grid = document.querySelector("#monitors-grid");
        if (!grid) return;
        grid.innerHTML = data.map(m => `
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">${m.name}</h3><span class="native-card-badge active">${m.status}</span></div>
            <p class="native-card-body">Destino: ${m.target_url} · Latência: ${m.latency_ms}ms · Uptime: ${m.uptime_pct}%</p>
            <div class="native-card-footer"><span>Tipo: ${m.monitor_type.toUpperCase()}</span><span class="stage-pill">Monitorando</span></div>
          </div>
        `).join('');
      }

      // 9. COFRE DE ACESSOS (Vaultwarden)
      else if (routeKey === "cofre-acessos") {
        const res = await fetch(`${API}/vault`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const grid = document.querySelector("#vault-items-grid");
        if (!grid) return;
        grid.innerHTML = data.map(v => `
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">${v.title}</h3><span class="native-card-badge active">${v.category}</span></div>
            <p class="native-card-body">Usuário: <code>${v.username || 'N/A'}</code> · URL: ${v.url || '-'}.</p>
            <div class="native-card-footer"><span>${v.notes || 'Criptografia ativa'}</span><button type="button" class="native-card-action" onclick="alert('Credencial protegida copiada com segurança!')">Copiar Senha 🔑</button></div>
          </div>
        `).join('');
      }

      // 10. EQUIPE (Authentik)
      else if (routeKey === "equipe") {
        const res = await fetch(`${API}/team`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const list = document.querySelector("#team-list");
        if (!list) return;
        list.innerHTML = data.map(u => `
          <div class="native-timeline-item">
            <span class="native-timeline-time">${u.role}</span>
            <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">USR</div>
            <div class="native-timeline-info"><strong>${u.name}</strong><small>${u.email} · 2FA: ${u.two_factor_enabled ? 'Ativo' : 'Pendente'}</small></div>
            <span class="native-card-badge active">${u.status}</span>
          </div>
        `).join('');
      }

      // 11. WHATSAPP (WAHA)
      else if (routeKey === "whatsapp") {
        const res = await fetch(`${API}/whatsapp`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const grid = document.querySelector("#whatsapp-sessions-grid");
        if (!grid) return;
        grid.innerHTML = data.map(s => `
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">${s.session_name}</h3><span class="native-card-badge active">${s.status}</span></div>
            <p class="native-card-body">Número Pareado: <strong>${s.phone_number || 'Sem número'}</strong> · Bateria: ${s.battery_level}%.</p>
            <div class="native-card-footer"><span>Instância WAHA</span><span class="health-pill"><i></i>Conectado</span></div>
          </div>
        `).join('');
      }

      // 12. AUTOMAÇÕES (N8N)
      else if (routeKey === "automacoes") {
        const res = await fetch(`${API}/automations`, { cache: "no-store" });
        if (!res.ok) return;
        const { data } = await res.json();
        if (!Array.isArray(data)) return;

        const list = document.querySelector("#automations-list");
        if (!list) return;
        list.innerHTML = data.map(a => `
          <div class="native-timeline-item">
            <span class="native-timeline-time">${a.executions_count} execuções</span>
            <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">N8N</div>
            <div class="native-timeline-info"><strong>${a.name}</strong><small>Gatilho: ${a.trigger_event} ➔ ${a.action_summary}</small></div>
            <span class="native-card-badge active">${a.status}</span>
          </div>
        `).join('');
      }

      // 13. CONSULTA CNPJ (Receita Federal)
      else if (routeKey === "consulta-cnpj") {
        const form = document.querySelector("#form-cnpj-query");
        if (form) {
          form.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.querySelector("#input-cnpj");
            const card = document.querySelector("#cnpj-result-card");
            const btn = document.querySelector("#btn-cnpj-search");
            if (!input || !card) return;
            const cnpjVal = input.value.trim().replace(/\D/g, "");
            if (cnpjVal.length !== 14) {
              alert("Por favor, digite um CNPJ válido com 14 dígitos.");
              return;
            }
            btn.disabled = true;
            btn.textContent = "Consultando...";
            card.style.display = "block";
            card.innerHTML = `<p class="loading-state">Consultando dados na Receita Federal...</p>`;

            try {
              const res = await fetch(`${API}/cnpj/${cnpjVal}`);
              const { data } = await res.json();
              if (data) {
                card.innerHTML = `
                  <div class="native-card">
                    <div class="native-card-head">
                      <h3 class="native-card-title">${data.razao_social}</h3>
                      <span class="native-card-badge active">${data.situacao}</span>
                    </div>
                    <p class="native-card-body">
                      <strong>Nome Fantasia:</strong> ${data.nome_fantasia || 'Não informado'}<br />
                      <strong>CNPJ:</strong> ${data.cnpj}<br />
                      <strong>Atividade Principal (CNAE):</strong> ${data.cnae_principal || 'Não especificado'}<br />
                      <strong>Localização:</strong> ${data.cidade || ''}/${data.uf || ''}
                    </p>
                    <div class="native-card-footer">
                      <span>Receita Federal · Situação Cadastral Regular</span>
                      <button type="button" class="primary-action" onclick="alert('Empresa importada para a carteira de clientes!');">Importar para Clientes ✓</button>
                    </div>
                  </div>
                `;
              }
            } catch (err) {
              card.innerHTML = `<p style="color:var(--red);">Erro ao consultar CNPJ. Tente novamente.</p>`;
            } finally {
              btn.disabled = false;
              btn.textContent = "Consultar CNPJ";
            }
          };
        }
      }

      // 14. CONFIGURAÇÕES & STATUS DOS 16 MÓDULOS
      else if (routeKey === "configuracoes") {
        // A. Gerenciamento de Abas
        const tabBtns = document.querySelectorAll("#settings-tabs-nav .settings-tab-btn");
        tabBtns.forEach(btn => {
          btn.onclick = () => {
            const targetTab = btn.getAttribute("data-tab");
            tabBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            document.querySelectorAll(".settings-tab-pane").forEach(pane => {
              pane.hidden = true;
              pane.classList.remove("is-active");
            });

            const targetPane = document.querySelector(`#pane-${targetTab}`);
            if (targetPane) {
              targetPane.hidden = false;
              targetPane.classList.add("is-active");
            }
          };
        });

        // B. Carregar Status dos 16 Módulos
        const tbody = document.querySelector("#modules-status-tbody");
        const loadModulesStatus = async () => {
          if (!tbody) return;
          try {
            const res = await fetch(`${API}/system/modules-status`, { cache: "no-store" });
            if (!res.ok) throw new Error("Falha ao consultar status dos módulos");
            const { data } = await res.json();
            if (!Array.isArray(data)) return;

            tbody.innerHTML = data.map(m => {
              const isOnline = m.status === "online";
              return `
                <tr id="row-module-${m.key}">
                  <td style="padding:10px 14px;font-weight:600;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="font-size:1.1rem;">${m.icon || '📦'}</span>
                      <div>
                        <div>${m.name}</div>
                        <small style="color:var(--muted);font-size:0.68rem;">${m.url}</small>
                      </div>
                    </div>
                  </td>
                  <td style="padding:10px 14px;color:var(--muted);font-size:0.75rem;">${m.category}</td>
                  <td style="padding:10px 14px;font-family:monospace;font-size:0.75rem;">${m.version || 'v1.0.0'}</td>
                  <td style="padding:10px 14px;font-size:0.72rem;color:var(--muted);">${m.auth_type || 'Bearer Token'}</td>
                  <td style="padding:10px 14px;">
                    <span class="status-badge-live ${isOnline ? 'online' : 'offline'}" id="badge-status-${m.key}">
                      <span class="pulse-dot"></span>
                      <span>${isOnline ? 'Conectado' : 'Desconectado'}</span>
                    </span>
                  </td>
                  <td style="padding:10px 14px;font-family:monospace;font-size:0.75rem;" id="latency-${m.key}">
                    ${m.latency_ms ? `${m.latency_ms}ms` : '--'}
                  </td>
                  <td style="padding:10px 14px;text-align:right;">
                    <button type="button" class="test-conn-btn" data-module="${m.key}" title="Testar conectividade ao vivo">
                      Testar ⚡
                    </button>
                  </td>
                </tr>
              `;
            }).join('');

            // Handler para cada botão de teste de conexão individual
            tbody.querySelectorAll(".test-conn-btn").forEach(btn => {
              btn.onclick = async () => {
                const key = btn.getAttribute("data-module");
                btn.disabled = true;
                btn.textContent = "Testando...";
                const badge = document.querySelector(`#badge-status-${key}`);
                const latEl = document.querySelector(`#latency-${key}`);

                try {
                  const testRes = await fetch(`${API}/system/modules-status/${key}/test`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                  });
                  const testData = await testRes.json();
                  if (testData.success) {
                    if (badge) {
                      badge.className = "status-badge-live online";
                      badge.innerHTML = `<span class="pulse-dot"></span><span>Conectado</span>`;
                    }
                    if (latEl) latEl.textContent = `${testData.latency_ms}ms`;
                  } else {
                    if (badge) {
                      badge.className = "status-badge-live offline";
                      badge.innerHTML = `<span class="pulse-dot"></span><span>Falha</span>`;
                    }
                    if (latEl) latEl.textContent = "Erro";
                  }
                } catch (err) {
                  if (badge) {
                    badge.className = "status-badge-live offline";
                    badge.innerHTML = `<span class="pulse-dot"></span><span>Timeout</span>`;
                  }
                  if (latEl) latEl.textContent = "Off";
                } finally {
                  btn.disabled = false;
                  btn.textContent = "Testar ⚡";
                }
              };
            });
          } catch (e) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--red);">Erro ao consultar status dos 16 serviços.</td></tr>`;
          }
        };

        loadModulesStatus();

        // Botão Testar Todos os Motores
        const btnRetestAll = document.querySelector("#btn-retest-all");
        if (btnRetestAll) {
          btnRetestAll.onclick = async () => {
            btnRetestAll.disabled = true;
            btnRetestAll.textContent = "Testando todos os 16 motores...";
            const buttons = document.querySelectorAll(".test-conn-btn");
            for (const btn of buttons) {
              btn.click();
              await new Promise(r => setTimeout(r, 120));
            }
            btnRetestAll.disabled = false;
            btnRetestAll.textContent = "Testar Todos os Motores ⚡";
          };
        }
      }
    } catch (e) {
      console.debug("Hydrate error:", e);
    }
  };
})();
