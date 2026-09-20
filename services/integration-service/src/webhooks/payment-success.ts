/**
 * Payment Success Webhook Handler (Mercado Pago)
 * Quando um pagamento é confirmado, atualiza fatura + CRM
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createAureusClient } from '../clients';

const PaymentSuccessPayloadSchema = z.object({
  event: z.literal('payment.success'),
  payment_id: z.string(),
  amount: z.number().positive(),
  currency: z.enum(['BRL', 'USD']),
  invoice_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  organization_id: z.string().uuid(),
  timestamp: z.string().datetime(),
});

type PaymentSuccessPayload = z.infer<typeof PaymentSuccessPayloadSchema>;

export async function handlePaymentSuccess(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = PaymentSuccessPayloadSchema.parse(request.body);

    // 1. Atualizar fatura como PAGA
    const aureusClient = createAureusClient(payload.organization_id);

    await aureusClient.updateInvoice(payload.invoice_id, {
      status: 'paid',
      paid_at: new Date(),
      payment_method: 'mercado_pago',
      payment_id: payload.payment_id,
    });

    // 2. Registrar em histórico de pagamentos
    await aureusClient.recordPayment({
      invoice_id: payload.invoice_id,
      amount_cents: Math.round(payload.amount * 100),
      currency: payload.currency,
      payment_method: 'mercado_pago',
      payment_id: payload.payment_id,
      timestamp: new Date(payload.timestamp),
    });

    // 3. Disparar webhook para CRM atualizar (opcional)
    // await notifyCRM({ invoice_id: payload.invoice_id, status: 'paid' });

    return reply.code(200).send({
      status: 'success',
      invoice_id: payload.invoice_id,
      payment_id: payload.payment_id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return reply.code(500).send({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
