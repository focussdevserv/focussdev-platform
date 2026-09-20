/**
 * Routes para Integration Service
 * Webhooks de entrada + endpoints administrativos
 */

import { FastifyInstance } from 'fastify';
import { handleLeadWon } from './webhooks/lead-won';
import { handlePaymentSuccess } from './webhooks/payment-success';
import { handleContractSigned } from './webhooks/contract-signed';
import { verifyWebhookSignature } from './auth/webhook-signature';

export async function registerRoutes(app: FastifyInstance) {
  // ============ WEBHOOKS (Entrada de eventos) ============

  // POST /webhooks/crm/lead-won
  // Trigger: Lead vendido no DeskcommCRM
  // Ação: Cria cliente + fatura + projeto + repositório
  app.post<{ Body: any }>(
    '/webhooks/crm/lead-won',
    {
      preHandler: verifyWebhookSignature,
      schema: {
        description: 'Lead won webhook from DeskcommCRM',
        tags: ['webhooks'],
        body: {
          type: 'object',
          required: [
            'event',
            'lead_id',
            'contact_id',
            'contact_name',
            'contact_email',
            'opportunity_value_cents',
            'currency',
            'product_name',
            'organization_id',
          ],
        },
      },
    },
    handleLeadWon
  );

  // POST /webhooks/mercadopago/payment-success
  // Trigger: Pagamento confirmado no Mercado Pago
  // Ação: Marca fatura como paga, atualiza CRM
  app.post<{ Body: any }>(
    '/webhooks/mercadopago/payment-success',
    {
      preHandler: verifyWebhookSignature,
      schema: {
        description: 'Payment success webhook from Mercado Pago',
        tags: ['webhooks'],
      },
    },
    handlePaymentSuccess
  );

  // POST /webhooks/documenso/contract-signed
  // Trigger: Contrato assinado no Documenso
  // Ação: Atualiza status, cria ticket de follow-up
  app.post<{ Body: any }>(
    '/webhooks/documenso/contract-signed',
    {
      preHandler: verifyWebhookSignature,
      schema: {
        description: 'Contract signed webhook from Documenso',
        tags: ['webhooks'],
      },
    },
    handleContractSigned
  );

  // ============ ADMIN ENDPOINTS ============

  // GET /api/health
  // Health check
  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // GET /api/integrations
  // Lista todas as integrações cadastradas
  app.get(
    '/api/integrations',
    {
      schema: {
        description: 'List all integration connectors',
        tags: ['admin'],
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    status: { enum: ['connected', 'pending', 'error', 'not_implemented'] },
                    organization_id: { type: 'string' },
                    last_sync: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const db = createSupabaseClient();

      const { data, error } = await db
        .from('integration_connections')
        .select('*')
        .eq('organization_id', req.organizationId);

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({
        data: data?.map((conn) => ({
          id: conn.id,
          name: conn.connector_name,
          status: conn.status,
          organization_id: conn.organization_id,
          last_sync: conn.last_sync_at,
        })),
      });
    }
  );

  // GET /api/integrations/:id/status
  // Status de uma integração específica
  app.get(
    '/api/integrations/:id/status',
    async (req: any, reply) => {
      const db = createSupabaseClient();

      const { data, error } = await db
        .from('integration_connections')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) {
        return reply.code(404).send({ error: 'Integration not found' });
      }

      return reply.send({
        id: data.id,
        name: data.connector_name,
        status: data.status,
        last_sync_at: data.last_sync_at,
        error_message: data.error_message,
        next_sync_at: data.next_sync_at,
      });
    }
  );

  // POST /api/integrations/:id/test
  // Testa uma integração (envia payload de teste)
  app.post(
    '/api/integrations/:id/test',
    async (req: any, reply) => {
      const { id } = req.params;

      // Buscar integração
      const db = createSupabaseClient();
      const { data: integration, error } = await db
        .from('integration_connections')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !integration) {
        return reply.code(404).send({ error: 'Integration not found' });
      }

      // Enviar payload de teste
      const testPayload = {
        event: `${integration.connector_name}.test`,
        timestamp: new Date().toISOString(),
        test: true,
      };

      try {
        const response = await axios.post(
          integration.webhook_url,
          testPayload,
          {
            headers: {
              'X-Webhook-Signature': generateSignature(testPayload, integration.webhook_secret),
            },
            timeout: 5000,
          }
        );

        return reply.send({
          status: 'success',
          response: response.data,
        });
      } catch (err: any) {
        return reply.code(500).send({
          status: 'error',
          error: err.message,
        });
      }
    }
  );

  // GET /api/jobs
  // Lista jobs da fila de integração
  app.get(
    '/api/jobs',
    {
      schema: {
        description: 'List integration jobs',
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            limit: { type: 'integer', default: 50 },
          },
        },
      },
    },
    async (req: any, reply) => {
      const db = createSupabaseClient();

      const query = db
        .from('integration_jobs')
        .select('*')
        .eq('organization_id', req.organizationId)
        .order('created_at', { ascending: false })
        .limit(req.query.limit || 50);

      if (req.query.status) {
        query.eq('status', req.query.status);
      }

      const { data, error } = await query;

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ data });
    }
  );

  // GET /api/audit-log
  // Log de auditoria das integrações
  app.get(
    '/api/audit-log',
    {
      schema: {
        description: 'Integration audit log',
        querystring: {
          type: 'object',
          properties: {
            event_type: { type: 'string' },
            source_system: { type: 'string' },
            limit: { type: 'integer', default: 100 },
          },
        },
      },
    },
    async (req: any, reply) => {
      const db = createSupabaseClient();

      const query = db
        .from('integration_audit_log')
        .select('*')
        .eq('organization_id', req.organizationId)
        .order('created_at', { ascending: false })
        .limit(req.query.limit || 100);

      if (req.query.event_type) {
        query.eq('event_type', req.query.event_type);
      }

      if (req.query.source_system) {
        query.eq('source_system', req.query.source_system);
      }

      const { data, error } = await query;

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ data });
    }
  );
}

// Helpers
function generateSignature(payload: any, secret: string): string {
  const crypto = require('crypto');
  const message = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function createSupabaseClient() {
  // TODO: Implementar
  return {};
}

import axios from 'axios';
