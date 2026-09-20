export const integrationCatalog = [
  ["deskcommcrm", "DeskcommCRM"],
  ["aureuserp", "AureusERP"],
  ["documenso", "Documenso"],
  ["mercado_pago", "Mercado Pago"],
  ["plane", "Plane"],
  ["forgejo", "Forgejo"],
  ["github", "GitHub"],
  ["freescout", "FreeScout"],
  ["bookstack", "BookStack"],
  ["uptime_kuma", "Uptime Kuma"],
  ["waha", "WAHA"],
  ["evolution_api", "Evolution API dedicada"],
  ["supabase", "Supabase"],
  ["resend", "Resend"],
  ["google_calendar", "Google Calendar"],
  ["meta", "Meta"],
  ["google_ads", "Google Ads"],
  ["brasil_api", "BrasilAPI"],
  ["receita_ws", "ReceitaWS"],
  ["nfse", "NFS-e"]
] as const;

export type IntegrationKey = (typeof integrationCatalog)[number][0];
export const integrationKeys = new Set<string>(integrationCatalog.map(([key]) => key));
