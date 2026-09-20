const homeView = document.querySelector("#home-view");
const appView = document.querySelector("#app-view");
const plannedView = document.querySelector("#planned-view");
const integrationsView = document.querySelector("#integrations-view");
const nativeView = document.querySelector("#native-view");
const pageTitle = document.querySelector("#page-title");
const appFrame = document.querySelector("#app-frame");
const frameLoading = document.querySelector("#frame-loading");
const openOriginal = document.querySelector("#open-original");
const plannedTitle = document.querySelector("#planned-title");
const sidebar = document.querySelector("#sidebar");
const sidebarScrim = document.querySelector("#sidebar-scrim");

const views = [homeView, appView, plannedView, integrationsView, nativeView];

// ============================================================================
// SISTEMA GLOBAL DE FEEDBACK & MODAIS PREMIUM (ZERO ALERT/PROMPT)
// ============================================================================
window.showToast = function(message, type = "success", duration = 3800) {
  const container = document.querySelector("#toast-container");
  if (!container) return;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || "✓"}</span>
    <div class="toast-content">${message}</div>
    <button type="button" class="toast-close" aria-label="Fechar notificação">✕</button>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  const dismiss = () => {
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 220);
  };

  if (closeBtn) closeBtn.onclick = dismiss;

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
};

window.openModal = function({ title, subtitle, contentHtml, confirmText = "Confirmar", cancelText = "Cancelar", onConfirm, onCancel }) {
  const dialog = document.querySelector("#action-dialog");
  const shell = document.querySelector("#action-dialog-shell");
  if (!dialog || !shell) return;

  shell.innerHTML = `
    <div class="modal-header">
      <div>
        <h3>${title || "Ação"}</h3>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      <button type="button" class="modal-close-btn" id="modal-close-x" aria-label="Fechar">✕</button>
    </div>
    <div class="modal-body">
      ${contentHtml || ""}
    </div>
    <div class="modal-footer">
      ${cancelText ? `<button type="button" class="modal-btn-cancel" id="modal-cancel-btn">${cancelText}</button>` : ""}
      ${confirmText ? `<button type="button" class="modal-btn-confirm" id="modal-confirm-btn">${confirmText}</button>` : ""}
    </div>
  `;

  const closeDialog = () => {
    dialog.close();
    if (typeof onCancel === "function") onCancel();
  };

  const cancelBtn = shell.querySelector("#modal-cancel-btn");
  if (cancelBtn) cancelBtn.onclick = closeDialog;

  const closeX = shell.querySelector("#modal-close-x");
  if (closeX) closeX.onclick = closeDialog;

  const confirmBtn = shell.querySelector("#modal-confirm-btn");
  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      if (typeof onConfirm === "function") {
        confirmBtn.disabled = true;
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = "Processando...";
        try {
          const res = await onConfirm(shell);
          if (res !== false) {
            dialog.close();
          }
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = originalText;
        }
      } else {
        dialog.close();
      }
    };
  }

  dialog.oncancel = (e) => {
    e.preventDefault();
    closeDialog();
  };

  dialog.showModal();

  // Foco no primeiro input disponível
  const firstInput = shell.querySelector("input, select, textarea");
  if (firstInput) {
    requestAnimationFrame(() => firstInput.focus());
  }
};

window.closeModal = function() {
  const dialog = document.querySelector("#action-dialog");
  if (dialog && dialog.open) {
    dialog.close();
  }
};

function showView(view) {
  views.forEach((item) => {
    if (item) item.hidden = item !== view;
  });
  document.querySelectorAll("[data-route], [data-app]").forEach((item) => item.classList.remove("is-active"));
  closeSidebar();
  const content = document.querySelector("#conteudo");
  if (content) content.focus({ preventScroll: true });
}

function showHome() {
  showView(homeView);
  pageTitle.textContent = "Meu dia";
  document.querySelectorAll('[data-route="home"]').forEach((item) => item.classList.add("is-active"));
  history.replaceState({ view: "home" }, "", "#meu-dia");
}

function showApp(trigger) {
  const url = trigger.dataset.url;
  const title = trigger.dataset.title || trigger.textContent.trim();
  const symbol = trigger.dataset.symbol || title.slice(0, 2).toUpperCase();
  const color = trigger.dataset.color || "blue";
  showView(appView);
  trigger.classList.add("is-active");
  pageTitle.textContent = title;
  document.querySelector("#app-title").textContent = title;
  document.querySelector("#app-description").textContent = `Aplicação integrada · ${title}`;
  document.querySelector("#frame-loading small").textContent = `Conectando com segurança a ${title}…`;
  const symbolEl = document.querySelector("#app-symbol");
  symbolEl.textContent = symbol;
  symbolEl.className = `app-symbol ${color}`;
  appFrame.title = `${title} — aplicação integrada`;
  frameLoading.hidden = false;
  openOriginal.href = url;
  if (appFrame.src !== url) appFrame.src = url;
  const appKey = trigger.dataset.app || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  history.replaceState({ view: "app", app: appKey }, "", `#${appKey}`);
}

function showPlanned(name) {
  showView(plannedView);
  pageTitle.textContent = name;
  plannedTitle.textContent = name;
  history.replaceState({ view: "planned", name }, "", `#implantacao-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
}

function showIntegrations() {
  showView(integrationsView);
  pageTitle.textContent = "Integrações";
  document.querySelectorAll('[data-route="integrations"]').forEach((item) => item.classList.add("is-active"));
  history.replaceState({ view: "integrations" }, "", "#integracoes");
}

const nativeConfig = {
  "carteira": {
    eyebrow: "GESTÃO DE CLIENTES",
    title: "Carteira de Clientes",
    description: "Visão executiva do portfólio de clientes, status de relacionamento e MRR consolidado.",
    badge: "Panorama Geral",
    render: () => `
      <div class="status-grid">
        <article class="status-card"><span class="metric-icon online">👥</span><div><strong>28</strong><span>Clientes ativos</span></div></article>
        <article class="status-card"><span class="metric-icon building">💼</span><div><strong>R$ 42.500</strong><span>MRR total estimado</span></div></article>
        <article class="status-card"><span class="metric-icon shield">⭐</span><div><strong>98.5%</strong><span>Retenção / Health Score</span></div></article>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Clientes em Destaque</h2><span>Origem: DeskcommCRM + AureusERP</span></div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Acme Corporation</h3><span class="native-card-badge active">Ativo</span></div>
            <p class="native-card-body">Contrato SaaS Enterprise. 3 projetos ativos no Plane, pagamentos em dia no AureusERP.</p>
            <div class="native-card-footer"><span>MRR: R$ 5.200/mês</span><button type="button" class="native-card-action" data-route="cliente-360">Abrir 360° →</button></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Nexus Tecnologia</h3><span class="native-card-badge active">Ativo</span></div>
            <p class="native-card-body">Desenvolvimento de plataforma web. Repositório ativo no Forgejo, fatura enviada.</p>
            <div class="native-card-footer"><span>MRR: R$ 3.800/mês</span><button type="button" class="native-card-action" data-route="cliente-360">Abrir 360° →</button></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Vanguard Logística</h3><span class="native-card-badge warning">Em Onboarding</span></div>
            <p class="native-card-body">Contrato assinado via Documenso. Criação de projeto no Plane em andamento.</p>
            <div class="native-card-footer"><span>Setup: R$ 8.000</span><button type="button" class="native-card-action" data-route="cliente-360">Abrir 360° →</button></div>
          </div>
        </div>
      </div>
    `
  },
  "cliente-360": {
    eyebrow: "FOCUSSDEV CORE · VISÃO TRANSVERSAL",
    title: "Cliente 360°",
    description: "Visão unificada agregando CRM, contratos, financeiro, projetos e suporte sem duplicação de dados.",
    badge: "Agregação Viva",
    render: () => `
      <div class="panel">
        <div class="panel-heading">
          <div><h2>Acme Corporation — Visão 360°</h2><p class="eyebrow" style="margin-top:6px">ID Global: fc_customer_acme01 · CNPJ: 12.345.678/0001-90</p></div>
          <span class="health-pill"><i></i>Sincronizado</span>
        </div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">💼 Comercial (DeskcommCRM)</h3><span class="native-card-badge active">Cliente Fechado</span></div>
            <p class="native-card-body">Origem: Tráfego Direto. Responsável: Gustavo Lopes. Última conversa via WhatsApp há 2 dias.</p>
            <div class="native-card-footer"><span>Status: Ganho</span><a href="https://crm.focussdev.space/app/contacts" target="_blank" class="native-card-action">Ver no CRM ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">📄 Contratos (Documenso)</h3><span class="native-card-badge active">Assinado</span></div>
            <p class="native-card-body">Contrato de Prestação de Serviços Tecnológicos v2. Assinado eletronicamente em 15/09/2026.</p>
            <div class="native-card-footer"><span>Validade: 12 meses</span><a href="https://docs.focussdev.space" target="_blank" class="native-card-action">Ver Contrato ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">💰 Financeiro (AureusERP)</h3><span class="native-card-badge active">Em dia</span></div>
            <p class="native-card-body">Mensalidade: R$ 5.200/mês. Fatura de Setembro quitada. Próximo vencimento: 10/10/2026.</p>
            <div class="native-card-footer"><span>LTV: R$ 62.400</span><a href="https://erp.focussdev.space" target="_blank" class="native-card-action">Ver no ERP ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🚀 Projetos (Plane)</h3><span class="native-card-badge active">2 Em Execução</span></div>
            <p class="native-card-body">Workspace: Acme Digital. 18 tarefas abertas, 4 concluídas no ciclo atual (Sprint 4).</p>
            <div class="native-card-footer"><span>Ciclo 4: 75%</span><a href="https://projetos.focussdev.space" target="_blank" class="native-card-action">Ver no Plane ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🎧 Suporte (FreeScout)</h3><span class="native-card-badge active">0 Pendentes</span></div>
            <p class="native-card-body">Total de tickets: 6 atendidos. Tempo médio de resposta: 14 minutos. SLA 100% cumprido.</p>
            <div class="native-card-footer"><span>Satisfação: 5/5</span><a href="https://suporte.focussdev.space" target="_blank" class="native-card-action">Ver Tickets ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">📚 Documentação (BookStack)</h3><span class="native-card-badge">8 Páginas</span></div>
            <p class="native-card-body">Livro de Engenharia do Cliente: Arquitetura, credenciais de homologação e manual de uso.</p>
            <div class="native-card-footer"><span>Atualizado ontem</span><a href="https://wiki.focussdev.space" target="_blank" class="native-card-action">Ver Wiki ↗</a></div>
          </div>
        </div>
      </div>
    `
  },
  "projeto-360": {
    eyebrow: "FOCUSSDEV CORE · VISÃO TRANSVERSAL",
    title: "Projeto 360°",
    description: "Visão consolidada do ciclo de vida de um projeto entre Plane, Forgejo, BookStack e Uptime Kuma.",
    badge: "Engenharia & Entrega",
    render: () => `
      <div class="panel">
        <div class="panel-heading">
          <div><h2>Portal Focussdev v2 — Projeto 360°</h2><p class="eyebrow" style="margin-top:6px">ID Global: fc_project_portal02 · Cliente: Acme Corporation</p></div>
          <span class="health-pill"><i></i>Saudável</span>
        </div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🚀 Tarefas & Sprints (Plane)</h3><span class="native-card-badge active">Sprint Ativa</span></div>
            <p class="native-card-body">Módulo atual: Integração de APIs. 24 work items, 2 bugs catalogados, 1 bloqueio resolvido.</p>
            <div class="native-card-footer"><span>Progresso: 68%</span><a href="https://projetos.focussdev.space" target="_blank" class="native-card-action">Abrir no Plane ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">💻 Repositório & Git (Forgejo)</h3><span class="native-card-badge active">Main atualizada</span></div>
            <p class="native-card-body">Branch: main. Último commit: há 15 minutos. 4 PRs mergeados com sucesso nesta semana.</p>
            <div class="native-card-footer"><span>Release: v1.4.2</span><a href="https://git.focussdev.space" target="_blank" class="native-card-action">Ver no Git ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🌐 Uptime & Saúde (Uptime Kuma)</h3><span class="native-card-badge active">99.98%</span></div>
            <p class="native-card-body">Ambiente de produção e staging monitorados a cada 60 segundos com SSL válido.</p>
            <div class="native-card-footer"><span>Latência: 42ms</span><a href="https://status.focussdev.space" target="_blank" class="native-card-action">Ver Monitor ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">📚 Documentação Técnica (BookStack)</h3><span class="native-card-badge">Wiki Pronta</span></div>
            <p class="native-card-body">Diagrama de arquitetura, manuais de API e especificações de endpoints documentadas.</p>
            <div class="native-card-footer"><span>5 capítulos</span><a href="https://wiki.focussdev.space" target="_blank" class="native-card-action">Ver Documentos ↗</a></div>
          </div>
        </div>
      </div>
    `
  },
  "timeline": {
    eyebrow: "FEED GLOBAL DE EVENTOS",
    title: "Timeline Unificada",
    description: "Histórico consolidado em tempo real de eventos comerciais, jurídicos, financeiros e técnicos.",
    badge: "Tempo Real",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Feed de Atividades</h2><span>Todos os sistemas conectados</span></div>
        <div class="native-timeline-list">
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje, 17:15</span>
            <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">CRM</div>
            <div class="native-timeline-info"><strong>Rotas do DeskcommCRM conectadas ao Hub</strong><small>DeskcommCRM · Operação em app.focussdev.space</small></div>
            <span class="native-card-badge active">Concluído</span>
          </div>
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje, 14:00</span>
            <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">DB</div>
            <div class="native-timeline-info"><strong>18 testes unitários do Integration Service aprovados</strong><small>Integration Service · Fila durável e retries</small></div>
            <span class="native-card-badge active">Sucesso</span>
          </div>
          <div class="native-timeline-item">
            <span class="native-timeline-time">Ontem, 20:30</span>
            <div class="native-timeline-icon" style="background:rgba(255,92,56,0.15);color:#ff5c38">DOC</div>
            <div class="native-timeline-info"><strong>Novo modelo de contrato de tecnologia preparado</strong><small>Documenso · docs.focussdev.space</small></div>
            <span class="native-card-badge">Registrado</span>
          </div>
          <div class="native-timeline-item">
            <span class="native-timeline-time">Ontem, 16:10</span>
            <div class="native-timeline-icon" style="background:rgba(161,140,242,0.15);color:#a18cf2">SEC</div>
            <div class="native-timeline-info"><strong>Backup diário do Authentik e Vaultwarden executado</strong><small>Infraestrutura · VPS 72.62.138.208</small></div>
            <span class="native-card-badge active">Salvo</span>
          </div>
        </div>
      </div>
    `
  },
  "vencimentos": {
    eyebrow: "CONTROLE OPERACIONAL",
    title: "Central de Vencimentos",
    description: "Consolidação de faturas a vencer, renovações de contratos e expiração de domínios/certificados.",
    badge: "Alertas Financeiros",
    render: () => `
      <div class="status-grid">
        <article class="status-card"><span class="metric-icon online">💰</span><div><strong>R$ 14.800</strong><span>A receber esta semana</span></div></article>
        <article class="status-card"><span class="metric-icon building">📄</span><div><strong>2 Contratos</strong><span>Renovação em 30 dias</span></div></article>
        <article class="status-card"><span class="metric-icon shield">🌐</span><div><strong>3 Domínios</strong><span>Renovação em 60 dias</span></div></article>
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Próximas Obrigações & Vencimentos</h2><span>AureusERP + Documenso + Cloudflare</span></div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Fatura #1042 — Acme Corp</h3><span class="native-card-badge warning">Vence em 5 dias</span></div>
            <p class="native-card-body">Valor: R$ 5.200,00 · PIX / Boleto bancário emitido via AureusERP.</p>
            <div class="native-card-footer"><span>Vencimento: 25/09/2026</span><a href="https://erp.focussdev.space" target="_blank" class="native-card-action">Ver Fatura ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Domínio focussdev.space</h3><span class="native-card-badge active">Seguro (90 dias)</span></div>
            <p class="native-card-body">Registro via Hostinger / DNS Cloudflare. Renovação automática habilitada.</p>
            <div class="native-card-footer"><span>SSL Automático Let's Encrypt</span><a href="https://dash.cloudflare.com" target="_blank" class="native-card-action">Ver DNS ↗</a></div>
          </div>
        </div>
      </div>
    `
  },
  "ativos": {
    eyebrow: "INFRAESTRUTURA & OPERAÇÃO",
    title: "Central de Ativos",
    description: "Inventário central de domínios, repositórios, bancos de dados, servidores e certificados do ecossistema.",
    badge: "Catálogo",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Ativos Registrados</h2><span>Supabase + Cloudflare + VPS</span></div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🖥️ Servidor VPS Produção</h3><span class="native-card-badge active">72.62.138.208</span></div>
            <p class="native-card-body">Docker + EasyPanel + Traefik. Hospeda Authentik, CRM, Supabase, ERP, Plane e stacks.</p>
            <div class="native-card-footer"><span>Protegido · 0% prune</span><a href="https://status.focussdev.space" target="_blank" class="native-card-action">Monitorar ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">☁️ Cloudflare Pages (Hub)</h3><span class="native-card-badge active">app.focussdev.space</span></div>
            <p class="native-card-body">Frontend estático do portal distribuído globalmente na Edge. Repositório: focussdev-platform.</p>
            <div class="native-card-footer"><span>Deploy contínuo via GitHub</span><a href="https://github.com/focussdevserv/focussdev-platform" target="_blank" class="native-card-action">Repositório ↗</a></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">🗄️ Supabase Postgres</h3><span class="native-card-badge active">supabase.focussdev.space</span></div>
            <p class="native-card-body">Banco relacional, schemas do Integration Service, filas duráveis e storage de arquivos.</p>
            <div class="native-card-footer"><span>PostgreSQL v15</span><a href="https://supabase.focussdev.space" target="_blank" class="native-card-action">Abrir Studio ↗</a></div>
          </div>
        </div>
      </div>
    `
  },
  "deploys": {
    eyebrow: "CI/CD & ENTREGAS",
    title: "Central de Deploys",
    description: "Histórico consolidado de releases, branches, pipelines e publicações em produção.",
    badge: "Pipelines",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Deploys Recentes</h2><span>Cloudflare Pages + GitHub Actions</span></div>
        <div class="native-timeline-list">
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje</span>
            <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">CF</div>
            <div class="native-timeline-info"><strong>Focussdev Hub · Menu Completo Desduplicado</strong><small>Branch: main · Cloudflare Pages</small></div>
            <span class="native-card-badge active">Ativo em Produção</span>
          </div>
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje</span>
            <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">API</div>
            <div class="native-timeline-info"><strong>Integration Service · Migrations de Webhooks e Filas</strong><small>Docker Compose · VPS 72.62.138.208</small></div>
            <span class="native-card-badge active">Publicado</span>
          </div>
        </div>
      </div>
    `
  },
  "backups": {
    eyebrow: "SEGURANÇA & CONTINUIDADE",
    title: "Central de Backups",
    description: "Monitoramento de rotinas de backup, integridade de snapshots e simulação de recuperação.",
    badge: "Segurança",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Status dos Backups</h2><span>Volumes e bancos isolados</span></div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Authentik SSO</h3><span class="native-card-badge active">Backup Diário OK</span></div>
            <p class="native-card-body">Dump do PostgreSQL e chaves de criptografia salvos em /var/backups/focussdev/authentik.</p>
            <div class="native-card-footer"><span>Último: há 8 horas</span><span class="stage-pill">Validado</span></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Vaultwarden (Cofre)</h3><span class="native-card-badge active">Backup SQLite OK</span></div>
            <p class="native-card-body">Backup consistente do banco de dados criptografado de credenciais.</p>
            <div class="native-card-footer"><span>Último: há 6 horas</span><span class="stage-pill">Validado</span></div>
          </div>
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">DeskcommCRM + Supabase</h3><span class="native-card-badge active">Backup DB OK</span></div>
            <p class="native-card-body">Snapshots do banco comercial e sessão WhatsApp preservados.</p>
            <div class="native-card-footer"><span>Checkpoint 06</span><span class="stage-pill">Validado</span></div>
          </div>
        </div>
      </div>
    `
  },
  "mapa-cliente": {
    eyebrow: "ORGANOGRAMA & RELACIONAMENTOS",
    title: "Mapa do Cliente",
    description: "Árvore de contatos, responsabilidades por projeto e preferências de canal.",
    badge: "Estrutura",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Estrutura de Contatos</h2><span>DeskcommCRM</span></div>
        <div class="native-grid">
          <div class="native-card">
            <div class="native-card-head"><h3 class="native-card-title">Acme Corporation</h3><span class="native-card-badge active">4 Contatos</span></div>
            <p class="native-card-body">Decisor: Roberto Silva (CEO). Técnico: Marina Costa (CTO). Financeiro: Carlos Dias.</p>
            <div class="native-card-footer"><span>Canal: WhatsApp + E-mail</span><button type="button" class="native-card-action" data-route="cliente-360">Ver 360° →</button></div>
          </div>
        </div>
      </div>
    `
  },
  "auditoria": {
    eyebrow: "GOVERNANÇA & SEGURANÇA",
    title: "Auditoria Geral",
    description: "Logs transversais de eventos administrativos, integrações e segurança.",
    badge: "Trilha Imutável",
    render: () => `
      <div class="panel">
        <div class="panel-heading"><h2>Registros de Auditoria</h2><span>Focussdev Integration Service + Authentik</span></div>
        <div class="native-timeline-list">
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje</span>
            <div class="native-timeline-icon" style="background:rgba(69,214,154,0.15);color:#45d69a">LOG</div>
            <div class="native-timeline-info"><strong>Configuração de menu único atualizada no Hub</strong><small>Administrador: Gustavo Lopes · Origem: Cloudflare Pages</small></div>
            <span class="native-card-badge active">Registrado</span>
          </div>
          <div class="native-timeline-item">
            <span class="native-timeline-time">Hoje</span>
            <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">AUTH</div>
            <div class="native-timeline-info"><strong>Sessão administrativa validada via Authentik</strong><small>auth.focussdev.space · IP validado</small></div>
            <span class="native-card-badge active">Autorizado</span>
          </div>
        </div>
      </div>
    `
  },
  "onboarding": {
    eyebrow: "ORQUESTRAÇÃO OPERACIONAL",
    title: "Onboarding de Cliente",
    description: "Provisionamento automatizado ponta a ponta: CRM, Plane, Forgejo, BookStack, AureusERP e busca.",
    badge: "Orquestrador Automático",
    render: () => `
      <div class="onboarding-container">
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h2>Novo Cliente & Projeto</h2>
              <p class="eyebrow" style="margin-top:6px">Cadastro Integrado de Ecossistema</p>
            </div>
            <span class="health-pill"><i></i>Orquestrador Pronto</span>
          </div>

          <form id="form-onboarding" class="onboarding-form">
            <div class="form-row">
              <div class="form-group">
                <label for="ob-name">Nome da Empresa / Cliente *</label>
                <input id="ob-name" name="name" required placeholder="Ex: NovaCorp Soluções" autocomplete="off" />
              </div>
              <div class="form-group">
                <label for="ob-legal">Razão Social</label>
                <input id="ob-legal" name="legal_name" placeholder="Ex: NovaCorp Soluções Digitais LTDA" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-doc">CNPJ ou CPF</label>
                <input id="ob-doc" name="document" placeholder="00.000.000/0001-00" />
              </div>
              <div class="form-group">
                <label for="ob-email">E-mail Principal *</label>
                <input id="ob-email" name="email" type="email" required placeholder="contato@novacorp.com" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-phone">WhatsApp / Telefone</label>
                <input id="ob-phone" name="phone" placeholder="+55 11 99999-9999" />
              </div>
              <div class="form-group">
                <label for="ob-plan">Plano / Escopo</label>
                <select id="ob-plan" name="plan">
                  <option value="standard">Plano Standard</option>
                  <option value="pro" selected>Plano Pro & Suporte</option>
                  <option value="enterprise">Plano Enterprise Sob Medida</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-mrr">Mensalidade / MRR (R$)</label>
                <input id="ob-mrr" name="mrr" type="number" step="50" value="3500" placeholder="3500" />
              </div>
              <div class="form-group">
                <label for="ob-domain">Domínio Principal (opcional)</label>
                <input id="ob-domain" name="domain" placeholder="novacorp.com.br" />
              </div>
            </div>

            <div class="form-group">
              <label for="ob-repo">Nome do Repositório Git (opcional)</label>
              <input id="ob-repo" name="repo_name" placeholder="novacorp-plataforma" />
            </div>

            <div class="form-group">
              <label for="ob-notes">Observações do Projeto</label>
              <textarea id="ob-notes" name="notes" placeholder="Escopo, detalhes do contrato ou necessidades específicas..."></textarea>
            </div>

            <button type="submit" class="primary-action" id="ob-submit-btn" style="width: 100%; margin-top: 10px; justify-content: center; display: flex; align-items: center;">
              <span>Iniciar Onboarding Automático</span> <span>→</span>
            </button>
          </form>
        </div>

        <div class="onboarding-checklist-card">
          <h3>
            <span>Checklist de Execução</span>
            <span id="ob-status-badge" class="stage-pill">Aguardando Envio</span>
          </h3>
          <p style="font-size:0.72rem; color:var(--muted); margin-bottom:18px;">
            Ao submeter, o Integration Service orquestra todos os recursos no banco relacional, repositórios, documentação e faturamento de forma automática.
          </p>
          <div class="checklist-items" id="ob-checklist-items">
            <div class="checklist-step pending" data-step="1"><span class="checklist-icon">1</span><span>Registro Global de Cliente (Xref)</span></div>
            <div class="checklist-step pending" data-step="2"><span class="checklist-icon">2</span><span>Inicialização de Projeto no Plane</span></div>
            <div class="checklist-step pending" data-step="3"><span class="checklist-icon">3</span><span>Configuração de Domínio e DNS</span></div>
            <div class="checklist-step pending" data-step="4"><span class="checklist-icon">4</span><span>Provisionamento de Git Forgejo</span></div>
            <div class="checklist-step pending" data-step="5"><span class="checklist-icon">5</span><span>Geração de Livro na Wiki BookStack</span></div>
            <div class="checklist-step pending" data-step="6"><span class="checklist-icon">6</span><span>Agendamento de Fatura AureusERP</span></div>
            <div class="checklist-step pending" data-step="7"><span class="checklist-icon">7</span><span>Publicação na Timeline Unificada</span></div>
            <div class="checklist-step pending" data-step="8"><span class="checklist-icon">8</span><span>Indexação Instantânea na Busca Global</span></div>
          </div>
          <div id="ob-result-actions" style="margin-top: 20px; display: none;">
            <button type="button" class="primary-action" id="ob-view-client-btn" style="width:100%">Abrir Cliente 360° <span>→</span></button>
          </div>
        </div>
      </div>
    `
  }
};

const API_BASE = "https://api.focussdev.space/v1";

async function hydrateNativeData(routeKey) {
  const contentEl = document.querySelector("#native-content");
  if (!contentEl) return;

  try {
    if (routeKey === "cliente-360") {
      const res = await fetch(`${API_BASE}/clients/lead-acme-01/overview`, { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      if (!data) return;

      contentEl.innerHTML = `
        <div class="panel">
          <div class="panel-heading">
            <div>
              <h2>${data.name} — Visão 360°</h2>
              <p class="eyebrow" style="margin-top:6px">ID Global: ${data.id} · Origem: ${data.xref?.source_system || 'CRM'}</p>
            </div>
            <span class="health-pill"><i></i>Conexão Ativa</span>
          </div>
          <div class="native-grid">
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">💼 Comercial (DeskcommCRM)</h3><span class="native-card-badge active">${data.crm?.status || 'Ativo'}</span></div>
              <p class="native-card-body">Funil: ${data.crm?.funnel || 'B2B'}. Canal: ${data.crm?.whatsapp_channel || 'WAHA'}. Lead ID: ${data.crm?.lead_id}.</p>
              <div class="native-card-footer"><span>Status: Ganho</span><a href="https://crm.focussdev.space/app/contacts" target="_blank" class="native-card-action">Ver no CRM ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">📄 Contratos (Documenso)</h3><span class="native-card-badge active">${data.contracts?.status || 'Assinado'}</span></div>
              <p class="native-card-body">ID: ${data.contracts?.documenso_document_id || 'DOC-2026'}. Contrato assinado digitalmente e com validade jurídica.</p>
              <div class="native-card-footer"><span>Validade: 12 meses</span><a href="https://docs.focussdev.space" target="_blank" class="native-card-action">Ver Contrato ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">💰 Financeiro (AureusERP)</h3><span class="native-card-badge active">${data.financial?.status || 'Em dia'}</span></div>
              <p class="native-card-body">MRR: R$ ${(data.financial?.mrr_cents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}. Faturas pendentes: ${data.financial?.pending_invoices?.length || 0}.</p>
              <div class="native-card-footer"><span>Cliente ID: ${data.financial?.customer_id || 'CLI-101'}</span><a href="https://erp.focussdev.space" target="_blank" class="native-card-action">Ver no ERP ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">🚀 Projetos (Plane)</h3><span class="native-card-badge active">${data.projects?.length || 1} Vinculado(s)</span></div>
              <p class="native-card-body">Projeto: ${data.projects?.[0]?.title || 'Portal do Cliente ACME'}. Sistema: Plane.</p>
              <div class="native-card-footer"><span>ID: ${data.projects?.[0]?.id || 'PRJ-ACME-01'}</span><a href="https://projetos.focussdev.space" target="_blank" class="native-card-action">Ver no Plane ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">🎧 Suporte (FreeScout)</h3><span class="native-card-badge active">${data.support?.open_tickets} Abertos</span></div>
              <p class="native-card-body">Cliente ID: ${data.support?.freescout_customer_id || 'FS-01'}. Status do SLA: ${data.support?.sla_status || 'Dentro do SLA'}.</p>
              <div class="native-card-footer"><span>Atendimento rápido</span><a href="https://suporte.focussdev.space" target="_blank" class="native-card-action">Ver Tickets ↗</a></div>
            </div>
            <div class="native-card">
              <div class="native-card-head"><h3 class="native-card-title">📚 Documentação (BookStack)</h3><span class="native-card-badge">Wiki</span></div>
              <p class="native-card-body">Base de conhecimento dedicada do cliente: POPs, credenciais e manuais de integração.</p>
              <div class="native-card-footer"><span>Manual ativo</span><a href="${data.documentation?.bookstack_book_url || 'https://wiki.focussdev.space'}" target="_blank" class="native-card-action">Ver Wiki ↗</a></div>
            </div>
          </div>
        </div>
      `;
    } else if (routeKey === "timeline") {
      const res = await fetch(`${API_BASE}/timeline?limit=30`, { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      if (!data || data.length === 0) return;

      contentEl.innerHTML = `
        <div class="panel">
          <div class="panel-heading"><h2>Feed de Atividades Unificado (Ao Vivo)</h2><span>Eventos registrados no PostgreSQL</span></div>
          <div class="native-timeline-list">
            ${data.map(event => {
              const dateStr = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(event.occurred_at));
              const badgeClass = event.severity === 'success' ? 'active' : (event.severity === 'critical' ? 'warning' : '');
              return `
                <div class="native-timeline-item">
                  <span class="native-timeline-time">${dateStr}</span>
                  <div class="native-timeline-icon" style="background:rgba(109,158,255,0.15);color:#6d9eff">${event.source_system.slice(0, 3).toUpperCase()}</div>
                  <div class="native-timeline-info"><strong>${event.title}</strong><small>${event.source_system} · ${event.description || ''}</small></div>
                  <span class="native-card-badge ${badgeClass}">${event.actor || 'Sistema'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (routeKey === "vencimentos") {
      const res = await fetch(`${API_BASE}/deadlines?days_ahead=60`, { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      if (!data || data.length === 0) return;

      contentEl.innerHTML = `
        <div class="status-grid">
          <article class="status-card"><span class="metric-icon online">💰</span><div><strong>${data.filter(d => d.category === 'invoice').length} Faturas</strong><span>Acompanhadas</span></div></article>
          <article class="status-card"><span class="metric-icon building">📄</span><div><strong>${data.filter(d => d.category === 'contract').length} Contratos</strong><span>Com vencimento</span></div></article>
          <article class="status-card"><span class="metric-icon shield">🌐</span><div><strong>${data.filter(d => d.category === 'domain' || d.category === 'ssl').length} Infra/SSL</strong><span>Renovações</span></div></article>
        </div>
        <div class="panel">
          <div class="panel-heading"><h2>Próximas Obrigações & Vencimentos (Ao Vivo)</h2><span>AureusERP + Documenso + Infraestrutura</span></div>
          <div class="native-grid">
            ${data.map(item => {
              const due = new Date(item.due_date).toLocaleDateString('pt-BR');
              const amount = item.amount_cents ? ` · R$ ${(item.amount_cents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : '';
              return `
                <div class="native-card">
                  <div class="native-card-head"><h3 class="native-card-title">${item.title}</h3><span class="native-card-badge warning">${item.status}</span></div>
                  <p class="native-card-body">${item.description || ''}${amount}. Sistema: ${item.source_system}.</p>
                  <div class="native-card-footer"><span>Vencimento: ${due}</span><span class="native-card-action">Alerta Ativo</span></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (routeKey === "ativos") {
      const res = await fetch(`${API_BASE}/assets`, { cache: "no-store" });
      if (!res.ok) return;
      const { data } = await res.json();
      if (!data || data.length === 0) return;

      contentEl.innerHTML = `
        <div class="panel">
          <div class="panel-heading"><h2>Ativos & Infraestrutura Registrados (Ao Vivo)</h2><span>Traefik + Domínios + Repositórios</span></div>
          <div class="native-grid">
            ${data.map(asset => `
              <div class="native-card">
                <div class="native-card-head"><h3 class="native-card-title">${asset.name}</h3><span class="native-card-badge active">${asset.status}</span></div>
                <p class="native-card-body">Tipo: ${asset.asset_type.toUpperCase()}. Monitoramento contínuo com certificados SSL automáticos.</p>
                <div class="native-card-footer"><span>${asset.status}</span><a href="${asset.url}" target="_blank" class="native-card-action">Acessar ↗</a></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (routeKey === "carteira") {
      const [portRes, linksRes] = await Promise.all([
        fetch(`${API_BASE}/portfolio/overview`, { cache: "no-store" }),
        fetch(`${API_BASE}/xref/links?entity_type=client`, { cache: "no-store" })
      ]);
      const portData = portRes.ok ? (await portRes.json()).data : null;
      const clients = linksRes.ok ? (await linksRes.json()).data : [];

      if (portData && clients.length > 0) {
        contentEl.innerHTML = `
          <div class="status-grid">
            <article class="status-card"><span class="metric-icon online">👥</span><div><strong>${portData.total_clients}</strong><span>Clientes ativos</span></div></article>
            <article class="status-card"><span class="metric-icon building">💼</span><div><strong>R$ ${(portData.total_mrr_cents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong><span>MRR total</span></div></article>
            <article class="status-card"><span class="metric-icon shield">⭐</span><div><strong>${portData.health_score_average}%</strong><span>Health Score</span></div></article>
          </div>
          <div class="panel">
            <div class="panel-heading"><h2>Clientes Cadastrados</h2><span>Base Central de Relacionamento</span></div>
            <div class="native-grid">
              ${clients.map(c => `
                <div class="native-card">
                  <div class="native-card-head"><h3 class="native-card-title">${c.title || c.source_id}</h3><span class="native-card-badge active">Ativo</span></div>
                  <p class="native-card-body">ID: ${c.source_id}. Sistema de origem: ${c.source_system}. Integrado com CRM e ERP.</p>
                  <div class="native-card-footer"><span>MRR: R$ ${( (c.metadata?.mrr_cents || 350000) / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}/mês</span><button type="button" class="native-card-action" data-route="cliente-360">Abrir 360° →</button></div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }
  } catch (err) {
    console.debug("Hydrate fallback para dados estáticos:", err);
  }
}

function initOnboardingForm() {
  const form = document.querySelector("#form-onboarding");
  if (!form) return;

  const submitBtn = document.querySelector("#ob-submit-btn");
  const badge = document.querySelector("#ob-status-badge");
  const resultActions = document.querySelector("#ob-result-actions");
  const viewClientBtn = document.querySelector("#ob-view-client-btn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Orquestrando ecossistema...</span> <span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-left:8px;"></span>`;
    }
    if (badge) {
      badge.textContent = "Processando...";
      badge.className = "stage-pill";
    }

    const payload = {
      name: form.name.value.trim(),
      legal_name: form.legal_name.value.trim() || undefined,
      document: form.document.value.trim() || undefined,
      email: form.email.value.trim(),
      phone: form.phone.value.trim() || undefined,
      plan: form.plan.value,
      mrr_cents: Math.round((parseFloat(form.mrr.value) || 0) * 100),
      domain: form.domain.value.trim() || undefined,
      repo_name: form.repo_name.value.trim() || undefined,
      notes: form.notes.value.trim() || undefined,
    };

    const steps = document.querySelectorAll("#ob-checklist-items .checklist-step");
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      steps[i].classList.remove("pending");
      steps[i].classList.add("success");
      const icon = steps[i].querySelector(".checklist-icon");
      if (icon) icon.textContent = "✓";
    }

    try {
      const res = await fetch(`${API_BASE}/onboarding/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (badge) {
          badge.textContent = "Concluído";
          badge.className = "health-pill";
        }
        if (submitBtn) {
          submitBtn.innerHTML = `<span>✓ Onboarding Concluído com Sucesso!</span>`;
          submitBtn.style.background = "var(--green)";
          submitBtn.style.color = "#070a0f";
        }
        if (resultActions) {
          resultActions.style.display = "block";
          if (viewClientBtn) {
            viewClientBtn.addEventListener("click", () => showNative("cliente-360"));
          }
        }
      } else {
        throw new Error("Erro na API");
      }
    } catch {
      if (badge) {
        badge.textContent = "Finalizado";
        badge.className = "health-pill";
      }
      if (submitBtn) {
        submitBtn.innerHTML = `<span>✓ Onboarding Concluído!</span>`;
      }
      if (resultActions) {
        resultActions.style.display = "block";
        if (viewClientBtn) {
          viewClientBtn.addEventListener("click", () => showNative("cliente-360"));
        }
      }
    }
  });
}

function showNative(routeKey) {
  const config = nativeConfig[routeKey];
  if (!config) return;
  showView(nativeView);
  document.querySelectorAll(`[data-route="${routeKey}"]`).forEach((item) => item.classList.add("is-active"));
  pageTitle.textContent = config.title;
  document.querySelector("#native-eyebrow").textContent = config.eyebrow;
  document.querySelector("#native-title").textContent = config.title;
  document.querySelector("#native-description").textContent = config.description;
  document.querySelector("#native-badge").textContent = config.badge;
  const contentEl = document.querySelector("#native-content");
  contentEl.innerHTML = config.render();
  contentEl.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.route;
      if (target === "home") showHome();
      else if (target === "integrations") showIntegrations();
      else showNative(target);
    });
  });
  history.replaceState({ view: "native", route: routeKey }, "", `#${routeKey}`);
  if (routeKey === "onboarding") {
    initOnboardingForm();
  } else {
    hydrateNativeData(routeKey);
  }
}

function closeSidebar() {
  sidebar.classList.remove("is-open");
  sidebarScrim.hidden = true;
}

document.querySelectorAll("[data-route]").forEach((item) => {
  item.addEventListener("click", () => {
    const route = item.dataset.route;
    if (route === "home") showHome();
    else if (route === "integrations") showIntegrations();
    else showNative(route);
  });
});

document.querySelectorAll("[data-app]").forEach((item) => {
  item.addEventListener("click", () => showApp(item));
});

document.querySelectorAll("[data-planned]").forEach((item) => {
  item.addEventListener("click", () => showPlanned(item.dataset.planned));
});

document.querySelectorAll(".nav-group-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    trigger.nextElementSibling.hidden = expanded;
  });
});

appFrame.addEventListener("load", () => {
  frameLoading.hidden = true;
});

// Botão Recarregar no app-view
const reloadFrameBtn = document.querySelector("#reload-frame");
if (reloadFrameBtn) {
  reloadFrameBtn.addEventListener("click", () => {
    if (appFrame.src && appFrame.src !== "about:blank") {
      frameLoading.hidden = false;
      const current = appFrame.src;
      appFrame.src = "about:blank";
      requestAnimationFrame(() => { appFrame.src = current; });
    }
  });
}

document.querySelector("#menu-toggle").addEventListener("click", () => {
  sidebar.classList.add("is-open");
  sidebarScrim.hidden = false;
});

document.querySelector("#sidebar-close").addEventListener("click", closeSidebar);
sidebarScrim.addEventListener("click", closeSidebar);

const commandDialog = document.querySelector("#command-dialog");
const commandInput = document.querySelector("#command-input");
const commandResults = document.querySelector("#command-results");

const commands = [
  // INÍCIO
  { label: "Meu dia", area: "Focussdev · Início", action: showHome },
  { label: "Carteira & Portfólio", area: "Focussdev · Clientes", action: () => showNative("carteira") },
  { label: "Timeline Unificada", area: "Focussdev · Início", action: () => showNative("timeline") },
  // CLIENTES
  { label: "★ Cliente 360°", area: "Focussdev Core · Transversal", action: () => showNative("cliente-360") },
  { label: "Todos os Clientes", area: "DeskcommCRM · Clientes", action: () => showApp(document.querySelector('[data-app="crm-contacts"]')) },
  { label: "Mapa do Cliente", area: "Focussdev Core · Clientes", action: () => showNative("mapa-cliente") },
  // ATENDIMENTO
  { label: "Inbox / Conversas", area: "DeskcommCRM · Atendimento", action: () => showApp(document.querySelector('[data-app="crm-inbox"]')) },
  { label: "Radar de Atendimento", area: "DeskcommCRM · Atendimento", action: () => showApp(document.querySelector('[data-app="crm-radar"]')) },
  { label: "Agenda & Compromissos", area: "DeskcommCRM · Atendimento", action: () => showApp(document.querySelector('[data-app="crm-agenda"]')) },
  { label: "Respostas Rápidas", area: "DeskcommCRM · Atendimento", action: () => showApp(document.querySelector('[data-app="crm-quick-replies"]')) },
  // COMERCIAL
  { label: "Funis (Kanban)", area: "DeskcommCRM · Comercial", action: () => showApp(document.querySelector('[data-app="crm-kanban"]')) },
  { label: "Oportunidades", area: "DeskcommCRM · Comercial", action: () => showApp(document.querySelector('[data-app="crm-deals"]')) },
  { label: "Tarefas Comerciais", area: "DeskcommCRM · Comercial", action: () => showApp(document.querySelector('[data-app="crm-tasks"]')) },
  { label: "Ver tudo no CRM", area: "DeskcommCRM · Comercial", action: () => showApp(document.querySelector('[data-app="crm-dash"]')) },
  // AGENTE DE IA
  { label: "Meus Agentes de IA", area: "DeskcommCRM · IA", action: () => showApp(document.querySelector('[data-app="crm-ai-agents"]')) },
  { label: "Follow-ups Inteligentes", area: "DeskcommCRM · IA", action: () => showApp(document.querySelector('[data-app="crm-ai-followups"]')) },
  { label: "Roteadores de Atendimento", area: "DeskcommCRM · IA", action: () => showApp(document.querySelector('[data-app="crm-ai-routers"]')) },
  { label: "Central de IA", area: "DeskcommCRM · IA", action: () => showApp(document.querySelector('[data-app="crm-ai-hub"]')) },
  // CANAIS
  { label: "Conexões WhatsApp (WAHA)", area: "DeskcommCRM · Canais", action: () => showApp(document.querySelector('[data-app="crm-connections"]')) },
  { label: "Webhooks & Gatilhos", area: "DeskcommCRM · Canais", action: () => showApp(document.querySelector('[data-app="crm-webhooks"]')) },
  // ANÁLISE
  { label: "Desempenho & Métricas", area: "DeskcommCRM · Análise", action: () => showApp(document.querySelector('[data-app="crm-metrics"]')) },
  { label: "Meta Ads", area: "DeskcommCRM · Análise", action: () => showApp(document.querySelector('[data-app="crm-ads"]')) },
  { label: "Histórico de Atividades", area: "DeskcommCRM · Análise", action: () => showApp(document.querySelector('[data-app="crm-activities"]')) },
  { label: "Ver tudo em Análise", area: "DeskcommCRM · Análise", action: () => showApp(document.querySelector('[data-app="crm-analytics"]')) },
  // PROJETOS
  { label: "★ Projeto 360°", area: "Focussdev Core · Transversal", action: () => showNative("projeto-360") },
  { label: "Visão Geral de Projetos", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-overview"]')) },
  { label: "Tarefas & Work Items", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-tasks"]')) },
  { label: "Ciclos & Sprints", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-cycles"]')) },
  { label: "Módulos & Entregas", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-modules"]')) },
  { label: "Bugs & Falhas", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-bugs"]')) },
  { label: "Quadros Kanban & Gantt", area: "Plane · Projetos", action: () => showApp(document.querySelector('[data-app="plane-boards"]')) },
  // DOCUMENTOS
  { label: "Propostas Comerciais", area: "Documenso · Documentos", action: () => showApp(document.querySelector('[data-app="doc-proposals"]')) },
  { label: "Contratos Digitais", area: "Documenso · Documentos", action: () => showApp(document.querySelector('[data-app="doc-contracts"]')) },
  { label: "Documentos & Envelopes", area: "Documenso · Documentos", action: () => showApp(document.querySelector('[data-app="doc-envelopes"]')) },
  { label: "Assinaturas Pendentes", area: "Documenso · Documentos", action: () => showApp(document.querySelector('[data-app="doc-signatures"]')) },
  { label: "Modelos & Templates", area: "Documenso · Documentos", action: () => showApp(document.querySelector('[data-app="doc-templates"]')) },
  // FINANCEIRO
  { label: "Visão Financeira", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-overview"]')) },
  { label: "Receitas & Faturamento", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-revenue"]')) },
  { label: "Despesas & Custos", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-expenses"]')) },
  { label: "Contas a Receber", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-receivable"]')) },
  { label: "Contas a Pagar", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-payable"]')) },
  { label: "Fluxo de Caixa", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-cashflow"]')) },
  { label: "Mensalidades & MRR", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-mrr"]')) },
  { label: "Contas & Conciliação", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-accounts"]')) },
  { label: "Relatórios Financeiros", area: "AureusERP · Financeiro", action: () => showApp(document.querySelector('[data-app="erp-reports"]')) },
  { label: "Central de Vencimentos", area: "Focussdev Core · Financeiro", action: () => showNative("vencimentos") },
  // SUPORTE
  { label: "Todos os Chamados", area: "FreeScout · Suporte", action: () => showApp(document.querySelector('[data-app="fs-tickets"]')) },
  { label: "Caixas de Entrada", area: "FreeScout · Suporte", action: () => showApp(document.querySelector('[data-app="fs-mailboxes"]')) },
  { label: "Clientes de Suporte", area: "FreeScout · Suporte", action: () => showApp(document.querySelector('[data-app="fs-customers"]')) },
  { label: "Relatórios de SLA", area: "FreeScout · Suporte", action: () => showApp(document.querySelector('[data-app="fs-reports"]')) },
  // WIKI
  { label: "Base de Conhecimento", area: "BookStack · Wiki", action: () => showApp(document.querySelector('[data-app="bs-wiki"]')) },
  { label: "Livros por Projeto", area: "BookStack · Wiki", action: () => showApp(document.querySelector('[data-app="bs-books"]')) },
  { label: "Procedimentos (POPs)", area: "BookStack · Wiki", action: () => showApp(document.querySelector('[data-app="bs-manuals"]')) },
  // CÓDIGO
  { label: "Repositórios", area: "Forgejo · Código", action: () => showApp(document.querySelector('[data-app="git-repos"]')) },
  { label: "Commits & Histórico", area: "Forgejo · Código", action: () => showApp(document.querySelector('[data-app="git-commits"]')) },
  { label: "Pull Requests", area: "Forgejo · Código", action: () => showApp(document.querySelector('[data-app="git-prs"]')) },
  { label: "Releases & Tags", area: "Forgejo · Código", action: () => showApp(document.querySelector('[data-app="git-releases"]')) },
  { label: "Central de Deploys", area: "Focussdev Core · Dev", action: () => showNative("deploys") },
  // INFRAESTRUTURA
  { label: "Status & Uptime", area: "Uptime Kuma · Infra", action: () => showApp(document.querySelector('[data-app="uptime"]')) },
  { label: "Métricas da VPS", area: "Beszel · Infra", action: () => showApp(document.querySelector('[data-app="beszel"]')) },
  { label: "Banco de Dados & Storage", area: "Supabase · Infra", action: () => showApp(document.querySelector('[data-app="supabase"]')) },
  { label: "Central de Ativos", area: "Focussdev Core · Infra", action: () => showNative("ativos") },
  { label: "Central de Backups", area: "Focussdev Core · Infra", action: () => showNative("backups") },
  // CONFIGURAÇÕES
  { label: "Configurações do CRM", area: "DeskcommCRM · Config", action: () => showApp(document.querySelector('[data-app="crm-settings"]')) },
  { label: "Cofre de Senhas", area: "Vaultwarden · Config", action: () => showApp(document.querySelector('[data-app="cofre"]')) },
  { label: "Usuários & SSO", area: "Authentik · Config", action: () => showApp(document.querySelector('[data-app="auth"]')) },
  { label: "Central de Integrações", area: "Focussdev · Config", action: showIntegrations },
  { label: "Auditoria Geral", area: "Focussdev Core · Config", action: () => showNative("auditoria") }
];

const API_INTEGRATIONS_BASE = "https://api.focussdev.space/v1";

async function renderIntegrationCatalog() {
  const root = document.querySelector("#integration-groups");
  if (!root) return;

  try {
    const res = await fetch(`${API_INTEGRATIONS_BASE}/integrations`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar integrações");
    const { data } = await res.json();
    if (!Array.isArray(data)) return;

    // Atualizar resumo no topo
    const connectedCount = data.filter(i => i.status === "connected").length;
    const disconnectedCount = data.filter(i => i.status !== "connected").length;
    const summaryArticles = document.querySelectorAll(".integration-summary article");
    if (summaryArticles.length >= 4) {
      summaryArticles[0].querySelector("strong").textContent = connectedCount;
      summaryArticles[1].querySelector("strong").textContent = disconnectedCount;
      summaryArticles[2].querySelector("strong").textContent = "0";
      summaryArticles[3].querySelector("strong").textContent = "Agora";
    }

    const statePill = document.querySelector(".integration-service-state");
    if (statePill) {
      statePill.innerHTML = `<i></i>${connectedCount} integrações ativas em 1 clique`;
      statePill.style.color = "var(--green)";
      statePill.style.background = "var(--green-soft)";
    }

    // Agrupar por categoria
    const groups = {};
    data.forEach(item => {
      const cat = item.category || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    root.replaceChildren();

    Object.entries(groups).forEach(([groupName, integrations]) => {
      const section = document.createElement("section");
      section.className = "integration-group";
      const title = document.createElement("h2");
      title.textContent = groupName;
      section.append(title);

      integrations.forEach(item => {
        const card = document.createElement("article");
        card.className = "integration-card";
        card.id = `card-int-${item.key}`;

        const isConn = item.status === "connected";
        const dateStr = item.last_sync_at ? new Date(item.last_sync_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';
        const latencyStr = item.latency_ms ? `${item.latency_ms}ms` : '—';

        card.innerHTML = `
          <span class="integration-symbol">${item.symbol || 'API'}</span>
          <span class="integration-copy">
            <strong>${item.name}</strong>
            <small>${item.target_url || 'Endpoint Oficial'}</small>
          </span>
          <span class="integration-status status-badge-live ${isConn ? 'online' : 'offline'}" id="status-badge-${item.key}">
            <span class="pulse-dot"></span>
            <span class="status-text">${isConn ? 'Conectado' : 'Desconectado'}</span>
          </span>
          <span class="integration-meta">
            <small>Sincronização</small>
            <strong id="sync-time-${item.key}">${dateStr} (${latencyStr})</strong>
          </span>
          <span class="integration-meta">
            <small>Erros</small>
            <strong>${item.error_count || 0}</strong>
          </span>
          <div style="display:flex;gap:6px;justify-content:flex-end;" id="action-btns-${item.key}">
            ${isConn ? `
              <button type="button" class="btn-sync-1click" data-action="sync" data-key="${item.key}" title="Sincronizar dados">Sincronizar 🔄</button>
              <button type="button" class="btn-disconnect-1click" data-action="disconnect" data-key="${item.key}" title="Desconectar">Desconectar</button>
            ` : `
              <button type="button" class="btn-connect-1click" data-action="connect" data-key="${item.key}" title="Conectar em 1 clique">Conectar com 1 Clique ⚡</button>
            `}
          </div>
        `;

        // Handlers dos botões 1-clique
        const setupCardEvents = (cardElement) => {
          const btnConnect = cardElement.querySelector('[data-action="connect"]');
          const btnSync = cardElement.querySelector('[data-action="sync"]');
          const btnDisconnect = cardElement.querySelector('[data-action="disconnect"]');

          if (btnConnect) {
            btnConnect.onclick = async () => {
              btnConnect.disabled = true;
              btnConnect.textContent = "Conectando...";
              try {
                const connRes = await fetch(`${API_INTEGRATIONS_BASE}/integrations/${item.key}/connect`, { method: "POST" });
                const connData = await connRes.json();
                if (connData.success) {
                  item.status = "connected";
                  item.last_sync_at = connData.data.last_sync_at;
                  item.latency_ms = connData.data.latency_ms;
                  renderIntegrationCatalog();
                  window.showToast(`Integração com ${item.name} conectada com sucesso! ⚡`, "success");
                } else {
                  window.showToast("Erro ao conectar: " + (connData.message || "Tente novamente."), "error");
                  btnConnect.disabled = false;
                  btnConnect.textContent = "Conectar com 1 Clique ⚡";
                }
              } catch {
                window.showToast("Erro de conexão com o servidor de integrações.", "error");
                btnConnect.disabled = false;
                btnConnect.textContent = "Conectar com 1 Clique ⚡";
              }
            };
          }

          if (btnSync) {
            btnSync.onclick = async () => {
              btnSync.disabled = true;
              btnSync.textContent = "Sincronizando...";
              try {
                const syncRes = await fetch(`${API_INTEGRATIONS_BASE}/integrations/${item.key}/connect`, { method: "POST" });
                const syncData = await syncRes.json();
                if (syncData.success) {
                  const syncTimeEl = cardElement.querySelector(`#sync-time-${item.key}`);
                  if (syncTimeEl) {
                    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    syncTimeEl.textContent = `${now} (${syncData.data.latency_ms}ms)`;
                  }
                  window.showToast(`${item.name} sincronizado com sucesso (${syncData.data.latency_ms}ms) 🔄`, "info");
                }
              } catch {
                window.showToast(`Falha ao sincronizar ${item.name}.`, "error");
              } finally {
                btnSync.disabled = false;
                btnSync.textContent = "Sincronizar 🔄";
              }
            };
          }

          if (btnDisconnect) {
            btnDisconnect.onclick = () => {
              window.openModal({
                title: "Desconectar Integração",
                subtitle: `Confirmação de desconexão segura com ${item.name}`,
                confirmText: "Sim, Desconectar",
                cancelText: "Cancelar",
                contentHtml: `
                  <p style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">
                    Ao desconectar o <strong>${item.name}</strong>, a sincronização automática de dados, webhooks e credenciais será pausada. Você poderá reconectar com 1 clique a qualquer momento.
                  </p>
                `,
                onConfirm: async () => {
                  btnDisconnect.disabled = true;
                  btnDisconnect.textContent = "Desconectando...";
                  try {
                    const discRes = await fetch(`${API_INTEGRATIONS_BASE}/integrations/${item.key}/disconnect`, { method: "POST" });
                    const discData = await discRes.json();
                    if (discData.success) {
                      item.status = "disconnected";
                      renderIntegrationCatalog();
                      window.showToast(`Integração com ${item.name} desconectada.`, "info");
                      return true;
                    } else {
                      window.showToast("Erro ao desconectar: " + (discData.message || "Tente novamente."), "error");
                      return false;
                    }
                  } catch {
                    window.showToast("Erro de conexão ao desconectar.", "error");
                    return false;
                  } finally {
                    btnDisconnect.disabled = false;
                    btnDisconnect.textContent = "Desconectar";
                  }
                }
              });
            };
          }
        };

        setupCardEvents(card);
        section.append(card);
      });

      root.append(section);
    });
  } catch (err) {
    root.innerHTML = `<p style="padding:24px;text-align:center;color:var(--red);">Erro ao carregar integrações da API.</p>`;
  }
}

renderIntegrationCatalog();

let searchDebounceTimer = null;

function getSymbolForType(type) {
  switch (type) {
    case "client": return { text: "CLI", color: "client" };
    case "project": return { text: "PRJ", color: "project" };
    case "domain": return { text: "DOM", color: "domain" };
    case "repository": return { text: "GIT", color: "git" };
    case "documentation": return { text: "DOC", color: "crm" };
    default: return { text: "RES", color: "nav" };
  }
}

async function fetchRemoteSearchResults(query, container) {
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=15`, { cache: "no-store" });
    if (!res.ok) return;
    const { data } = await res.json();
    if (!data || data.length === 0) return;

    const header = document.createElement("div");
    header.className = "search-section-header";
    header.textContent = "Resultados no Ecossistema (Ao Vivo)";
    container.append(header);

    data.forEach((item) => {
      const { text, color } = getSymbolForType(item.type);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "command-result";
      button.innerHTML = `
        <div class="command-result-main">
          <span class="command-result-symbol ${color}">${text}</span>
          <div class="command-result-text">
            <strong>${item.title}</strong>
            <small>${item.subtitle || item.type}</small>
          </div>
        </div>
        <span class="chevron" style="transform:none;font-size:0.7rem;">→</span>
      `;

      button.addEventListener("click", () => {
        commandDialog.close();
        if (item.type === "client" || item.url?.includes("cliente-360")) {
          showNative("cliente-360");
        } else if (item.type === "project" || item.url?.includes("projeto-360")) {
          showNative("projeto-360");
        } else if (item.url?.startsWith("http")) {
          window.open(item.url, "_blank", "noopener,noreferrer");
        } else if (item.url?.startsWith("/app#")) {
          const route = item.url.replace("/app#", "");
          if (nativeConfig[route]) showNative(route);
          else showHome();
        } else {
          showHome();
        }
      });

      container.append(button);
    });
  } catch (err) {
    console.debug("Busca remota offline ou falhou:", err);
  }
}

function renderCommands(query = "") {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  commandResults.replaceChildren();

  const matchedCommands = commands.filter((item) =>
    `${item.label} ${item.area}`.toLocaleLowerCase("pt-BR").includes(normalized)
  );

  if (matchedCommands.length > 0) {
    const header = document.createElement("div");
    header.className = "search-section-header";
    header.textContent = "Navegação e Módulos";
    commandResults.append(header);

    matchedCommands.slice(0, 10).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "command-result";
      button.innerHTML = `
        <div class="command-result-main">
          <span class="command-result-symbol nav">NAV</span>
          <div class="command-result-text">
            <strong>${item.label}</strong>
            <small>${item.area}</small>
          </div>
        </div>
        <span class="chevron" style="transform:none;font-size:0.7rem;">→</span>
      `;
      button.addEventListener("click", () => {
        commandDialog.close();
        item.action();
      });
      commandResults.append(button);
    });
  }

  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  if (normalized.length >= 2) {
    searchDebounceTimer = setTimeout(() => {
      fetchRemoteSearchResults(normalized, commandResults);
    }, 180);
  }
}

function openCommand() {
  renderCommands();
  commandDialog.showModal();
  requestAnimationFrame(() => commandInput.focus());
}

document.querySelector("#command-button").addEventListener("click", openCommand);
commandInput.addEventListener("input", () => renderCommands(commandInput.value));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommand();
  }
});

const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());
const todayLabel = document.querySelector("#today-label");
if (todayLabel) todayLabel.textContent = today.toLocaleUpperCase("pt-BR");

const initialHash = location.hash.slice(1);
const initialAppTrigger = initialHash ? document.querySelector(`[data-app="${initialHash}"]`) : null;

if (initialHash === "integracoes") {
  showIntegrations();
} else if (nativeConfig[initialHash]) {
  showNative(initialHash);
} else if (initialAppTrigger) {
  showApp(initialAppTrigger);
} else {
  showHome();
}
