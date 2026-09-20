// Script de Verificação de Ponta a Ponta do Sistema Focussdev
const API_URL = "http://172.16.8.3:3100";

const checkEndpoint = async (name, url, method = "GET", body = null) => {
  const start = Date.now();
  try {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const latency = Date.now() - start;
    if (res.ok) {
      console.log(`✓ [${name}] HTTP ${res.status} (${latency}ms)`);
      return true;
    } else {
      console.log(`✗ [${name}] HTTP ${res.status} (${latency}ms)`);
      return false;
    }
  } catch (err) {
    console.log(`✗ [${name}] Erro de conexão: ${err.message}`);
    return false;
  }
};

async function runHealthCheck() {
  console.log("=================================================");
  console.log(" AUDITORIA DE PONTA A PONTA DA PLATAFORMA FOCUSSDEV");
  console.log("=================================================");

  const checks = [
    ["Health Check Base", `${API_URL}/health`],
    ["Status dos 16 Módulos", `${API_URL}/v1/system/modules-status`],
    ["Teste de Ping do CRM", `${API_URL}/v1/system/modules-status/deskcommcrm/test`, "POST"],
    ["Configurações Globais", `${API_URL}/v1/system/settings`],
    ["Atualizar Configuração CRM", `${API_URL}/v1/system/settings/crm`, "PUT", { tempo_limite_primeira_resposta_min: 15, silencio_humano_ativo: true }],
    ["Catálogo de 23 Integrações", `${API_URL}/v1/integrations`],
    ["1-Click Connect Mercado Pago", `${API_URL}/v1/integrations/mercadopago/connect`, "POST"],
    ["Tarefas / Work Items", `${API_URL}/v1/tasks`],
    ["Oportunidades & Pipeline", `${API_URL}/v1/deals`],
    ["Contas a Receber / Faturas", `${API_URL}/v1/invoices`],
    ["Contratos & Documenso", `${API_URL}/v1/contracts`],
    ["Deploys & Forgejo Git", `${API_URL}/v1/deploys`],
    ["Chamados & FreeScout", `${API_URL}/v1/tickets`],
    ["Artigos & BookStack", `${API_URL}/v1/wiki`],
    ["Monitores & Uptime Kuma", `${API_URL}/v1/monitors`],
    ["Itens do Cofre Vaultwarden", `${API_URL}/v1/vault`],
    ["Equipe & Authentik", `${API_URL}/v1/team`],
    ["Sessões WhatsApp WAHA", `${API_URL}/v1/whatsapp`],
    ["Automações N8N", `${API_URL}/v1/automations`],
    ["Consulta CNPJ Receita Federal", `${API_URL}/v1/cnpj/14829102000144`],
    ["Busca Global Multissistema", `${API_URL}/v1/search?q=Plataforma`]
  ];

  let passed = 0;
  for (const [name, url, method, body] of checks) {
    const ok = await checkEndpoint(name, url, method, body);
    if (ok) passed++;
  }

  console.log("=================================================");
  console.log(` RESULTADO: ${passed}/${checks.length} SUBSISTEMAS VALIDADOS E OPERACIONAIS!`);
  console.log("=================================================");
}

runHealthCheck();
