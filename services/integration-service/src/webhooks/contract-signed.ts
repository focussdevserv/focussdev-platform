/**
 * Contract Signed Webhook Handler (Documenso)
 * Quando um contrato é assinado, cria ticket de follow-up
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createFreescoutClient } from '../clients';

const ContractSignedPayloadSchema = z.object({
  event: z.literal('contract.signed'),
  document_id: z.string(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  contract_name: z.string(),
  signed_at: z.string().datetime(),
  organization_id: z.string().uuid(),
});

type ContractSignedPayload = z.infer<typeof ContractSignedPayloadSchema>;

export async function handleContractSigned(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = ContractSignedPayloadSchema.parse(request.body);

    // 1. Criar/atualizar customer no FreeScout
    const freescoutClient = createFreescoutClient(payload.organization_id);

    const customer = await freescoutClient.createCustomer({
      name: payload.customer_name,
      email: payload.customer_email,
      external_id: `documenso-${payload.document_id}`,
    });

    // 2. Criar conversation/ticket para follow-up
    const conversation = await freescoutClient.createConversation({
      customer_id: customer.id,
      subject: `Follow-up: ${payload.contract_name} assinado`,
      description: `Contrato "${payload.contract_name}" foi assinado em ${payload.signed_at}.\n\nÃ©ximo passo: Iniciar implementação/entrega do projeto.`,
      status: 'active',
      external_id: `contract-${payload.document_id}`,
    });

    // 3. Adicionar mensagem inicial
    await freescoutClient.addMessage(conversation.id, {
      text: `Ótimo! O contrato "${payload.contract_name}" foi assinado com sucesso.\n\nProxeiros passos:\n1. Revisar cronograma\n2. Alocar time\n3. Iniciar desenvolvimento`,
      from_customer: false,
    });

    return reply.code(200).send({
      status: 'success',
      document_id: payload.document_id,
      conversation_id: conversation.id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return reply.code(500).send({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
