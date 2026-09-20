/**
 * Lead Won Webhook Handler
 * Dispara quando um lead é vendido no DeskcommCRM
 * Fluxo: CRM → AureusERP (cliente + fatura) → Plane (projeto) → Forgejo (repo)
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createSupabaseClient } from '../db/supabase';
import { createAureusClient } from '../clients/aureus';
import { createPlaneClient } from '../clients/plane';
import { createForgejoClient } from '../clients/forgejo';
import { logWebhook, logEvent } from '../audit/logger';

const LeadWonPayloadSchema = z.object({
  event: z.literal('lead.won'),
  lead_id: z.string().uuid(),
  contact_id: z.string().uuid(),
  contact_name: z.string(),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
  organization_id: z.string().uuid(),
  opportunity_value_cents: z.number().int().positive(),
  currency: z.enum(['BRL', 'USD']),
  product_name: z.string(),
  timestamp: z.string().datetime(),
});

type LeadWonPayload = z.infer<typeof LeadWonPayloadSchema>;

export async function handleLeadWon(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = Date.now();
  let payload: LeadWonPayload;

  try {
    // 1. Validar payload
    payload = LeadWonPayloadSchema.parse(request.body);

    // Log webhook recebido
    await logWebhook({
      event: 'lead.won',
      source: 'deskcommcrm',
      status: 'received',
      timestamp: new Date(),
      organization_id: payload.organization_id,
    });

    // 2. Criar cliente no AureusERP
    const aureusClient = createAureusClient(payload.organization_id);

    const customer = await aureusClient.createCustomer({
      name: payload.contact_name,
      email: payload.contact_email,
      phone: payload.contact_phone,
      type: 'individual', // ou 'company'
      external_id: payload.contact_id, // Vincular ao CRM
    });

    await logEvent({
      event_type: 'customer.created',
      source_system: 'aureusrp',
      organization_id: payload.organization_id,
      data: { customer_id: customer.id, crm_contact_id: payload.contact_id },
    });

    // 3. Criar invoice no AureusERP
    const invoice = await aureusClient.createInvoice({
      customer_id: customer.id,
      description: `${payload.product_name} - ${payload.contact_name}`,
      amount_cents: payload.opportunity_value_cents,
      currency: payload.currency,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      external_id: payload.lead_id,
    });

    await logEvent({
      event_type: 'invoice.created',
      source_system: 'aureusrp',
      organization_id: payload.organization_id,
      data: { invoice_id: invoice.id, crm_lead_id: payload.lead_id },
    });

    // 4. Criar projeto no Plane
    const planeClient = createPlaneClient(payload.organization_id);

    const project = await planeClient.createProject({
      name: `[${payload.product_name}] ${payload.contact_name}`,
      description: `Projeto gerado automaticamente para cliente ${payload.contact_name}`,
      identifier: generateProjectIdentifier(payload.contact_name),
      external_id: payload.lead_id,
      metadata: {
        crm_lead_id: payload.lead_id,
        crm_contact_id: payload.contact_id,
        customer_id: customer.id,
        invoice_id: invoice.id,
      },
    });

    await logEvent({
      event_type: 'project.created',
      source_system: 'plane',
      organization_id: payload.organization_id,
      data: { project_id: project.id, crm_lead_id: payload.lead_id },
    });

    // 5. Criar repositório no Forgejo (Git)
    const forgejoClient = createForgejoClient(payload.organization_id);

    const repo = await forgejoClient.createRepository({
      name: generateRepoName(payload.contact_name, payload.product_name),
      description: `Repository for ${payload.product_name} project`,
      private: true,
      issues: true,
      pull_requests: true,
      wiki: true,
      external_id: payload.lead_id,
    });

    await logEvent({
      event_type: 'repository.created',
      source_system: 'forgejo',
      organization_id: payload.organization_id,
      data: { repo_id: repo.id, crm_lead_id: payload.lead_id },
    });

    // 6. Criar vinculação cruzada em BD centralizado
    const db = createSupabaseClient();

    await db.from('integration_links').insert({
      organization_id: payload.organization_id,
      source_system: 'deskcommcrm',
      source_id: payload.lead_id,
      target_systems: {
        aureusrp_customer: customer.id,
        aureusrp_invoice: invoice.id,
        plane_project: project.id,
        forgejo_repo: repo.id,
      },
      created_at: new Date(),
    });

    // 7. Registrar sucesso
    await logEvent({
      event_type: 'lead.won.complete',
      source_system: 'integration-service',
      organization_id: payload.organization_id,
      data: {
        lead_id: payload.lead_id,
        duration_ms: Date.now() - startTime,
        systems_updated: 3,
      },
    });

    // 8. Responder ao webhook
    return reply.code(200).send({
      status: 'success',
      lead_id: payload.lead_id,
      timestamp: new Date().toISOString(),
      systems_updated: {
        aureusrp: { customer_id: customer.id, invoice_id: invoice.id },
        plane: { project_id: project.id },
        forgejo: { repo_id: repo.id },
      },
      duration_ms: Date.now() - startTime,
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    // Log erro
    if (error instanceof z.ZodError) {
      await logEvent({
        event_type: 'webhook.validation_error',
        source_system: 'integration-service',
        data: { errors: error.errors, duration_ms: duration },
      });

      return reply.code(400).send({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: error.errors[0].message,
        duration_ms: duration,
      });
    }

    // Log erro desconhecido
    await logEvent({
      event_type: 'webhook.error',
      source_system: 'integration-service',
      data: { error: error instanceof Error ? error.message : String(error), duration_ms: duration },
    });

    return reply.code(500).send({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'Failed to process webhook',
      duration_ms: duration,
    });
  }
}

/**
 * Helpers
 */

function generateProjectIdentifier(contactName: string): string {
  return contactName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 20);
}

function generateRepoName(contactName: string, productName: string): string {
  return `${contactName.toLowerCase().replace(/\s+/g, '-')}-${productName
    .toLowerCase()
    .replace(/\s+/g, '-')}`.substring(0, 100);
}
