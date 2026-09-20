const homeView = document.querySelector("#home-view");
const appView = document.querySelector("#app-view");
const plannedView = document.querySelector("#planned-view");
const integrationsView = document.querySelector("#integrations-view");
const pageTitle = document.querySelector("#page-title");
const appFrame = document.querySelector("#app-frame");
const frameLoading = document.querySelector("#frame-loading");
const openOriginal = document.querySelector("#open-original");
const plannedTitle = document.querySelector("#planned-title");
const sidebar = document.querySelector("#sidebar");
const sidebarScrim = document.querySelector("#sidebar-scrim");

const views = [homeView, appView, plannedView, integrationsView];

function showView(view) {
  views.forEach((item) => { item.hidden = item !== view; });
  document.querySelectorAll("[data-route], [data-app]").forEach((item) => item.classList.remove("is-active"));
  closeSidebar();
  document.querySelector("#conteudo").focus({ preventScroll: true });
}

function showHome() {
  showView(homeView);
  pageTitle.textContent = "Meu dia";
  document.querySelectorAll('[data-route="home"]').forEach((item) => item.classList.add("is-active"));
  history.replaceState({ view: "home" }, "", "#meu-dia");
}

function showApp(trigger) {
  const url = trigger.dataset.url;
  const title = trigger.dataset.title;
  showView(appView);
  trigger.classList.add("is-active");
  pageTitle.textContent = title;
  document.querySelector("#app-title").textContent = title;
  appFrame.title = `${title} — aplicação original`;
  frameLoading.hidden = false;
  openOriginal.href = url;
  if (appFrame.src !== url) appFrame.src = url;
  history.replaceState({ view: "app", app: trigger.dataset.app }, "", `#${trigger.dataset.app}`);
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

function closeSidebar() {
  sidebar.classList.remove("is-open");
  sidebarScrim.hidden = true;
}

document.querySelectorAll("[data-route='home']").forEach((item) => item.addEventListener("click", showHome));
document.querySelectorAll("[data-route='integrations']").forEach((item) => item.addEventListener("click", showIntegrations));
document.querySelectorAll("[data-app]").forEach((item) => item.addEventListener("click", () => showApp(item)));
document.querySelectorAll("[data-planned]").forEach((item) => item.addEventListener("click", () => showPlanned(item.dataset.planned)));
document.querySelectorAll(".nav-group-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    trigger.nextElementSibling.hidden = expanded;
  });
});

appFrame.addEventListener("load", () => { frameLoading.hidden = true; });
document.querySelector("#menu-toggle").addEventListener("click", () => { sidebar.classList.add("is-open"); sidebarScrim.hidden = false; });
document.querySelector("#sidebar-close").addEventListener("click", closeSidebar);
sidebarScrim.addEventListener("click", closeSidebar);

const commandDialog = document.querySelector("#command-dialog");
const commandInput = document.querySelector("#command-input");
const commandResults = document.querySelector("#command-results");
const commands = [
  { label: "Meu dia", area: "Focussdev", action: showHome },
  { label: "Monitoramento", area: "Uptime Kuma · disponível", action: () => showApp(document.querySelector('[data-app="uptime"]')) },
  { label: "CRM", area: "DeskcommCRM · em implantação", action: () => showPlanned("DeskcommCRM") },
  { label: "Financeiro", area: "AureusERP · em implantação", action: () => showPlanned("AureusERP") },
  { label: "Projetos", area: "Plane · em implantação", action: () => showPlanned("Plane") },
  { label: "Contratos", area: "Documenso · em implantação", action: () => showPlanned("Documenso") },
  { label: "Suporte", area: "FreeScout · em implantação", action: () => showPlanned("FreeScout") },
  { label: "Código", area: "Forgejo · em implantação", action: () => showPlanned("Forgejo") },
  { label: "Integrações", area: "Focussdev Integration Service · em implantação", action: showIntegrations },
];

const integrationGroups = [
  ["Comercial", [["DeskcommCRM", "CRM"], ["Documenso", "DOC"]]],
  ["Financeiro", [["AureusERP", "ERP"], ["Mercado Pago", "MP"], ["NFS-e", "NF"]]],
  ["Desenvolvimento", [["Plane", "PL"], ["Forgejo", "GIT"], ["GitHub", "GH"]]],
  ["Marketing", [["Meta", "META"], ["Google Ads", "ADS"]]],
  ["Comunicação", [["WAHA", "WA"], ["Evolution API dedicada", "EV"], ["Resend", "RE"], ["Google Calendar", "GC"]]],
  ["Suporte", [["FreeScout", "FS"]]],
  ["Infraestrutura", [["Supabase", "DB"], ["Uptime Kuma", "UP"], ["BookStack", "BS"]]],
  ["Serviços externos", [["BrasilAPI", "BR"], ["ReceitaWS", "RWS"]]],
];

function renderIntegrationCatalog() {
  const root = document.querySelector("#integration-groups");
  integrationGroups.forEach(([groupName, integrations]) => {
    const section = document.createElement("section");
    section.className = "integration-group";
    const title = document.createElement("h2");
    title.textContent = groupName;
    section.append(title);
    integrations.forEach(([name, symbol]) => {
      const card = document.createElement("article");
      card.className = "integration-card";
      const requirement = name === "Uptime Kuma" ? "Webhook oficial a configurar" : "Versão e API oficial a validar";
      card.innerHTML = `<span class="integration-symbol">${symbol}</span><span class="integration-copy"><strong>${name}</strong><small>${requirement}</small></span><span class="integration-status">Desconectado</span><span class="integration-meta"><small>Última sincronização</small><strong>—</strong></span><span class="integration-meta"><small>Erros</small><strong>0</strong></span><button type="button" disabled>Testar conexão</button>`;
      section.append(card);
    });
    root.append(section);
  });
}

renderIntegrationCatalog();

function renderCommands(query = "") {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  commandResults.replaceChildren();
  commands.filter((item) => `${item.label} ${item.area}`.toLocaleLowerCase("pt-BR").includes(normalized)).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-result";
    button.innerHTML = `<strong>${item.label}</strong><small>${item.area}</small>`;
    button.addEventListener("click", () => { commandDialog.close(); item.action(); });
    commandResults.append(button);
  });
}

function openCommand() { renderCommands(); commandDialog.showModal(); requestAnimationFrame(() => commandInput.focus()); }
document.querySelector("#command-button").addEventListener("click", openCommand);
commandInput.addEventListener("input", () => renderCommands(commandInput.value));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openCommand(); }
});

const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());
document.querySelector("#today-label").textContent = today.toLocaleUpperCase("pt-BR");

if (location.hash === "#uptime") showApp(document.querySelector('[data-app="uptime"]'));
else if (location.hash === "#integracoes") showIntegrations();
else showHome();
