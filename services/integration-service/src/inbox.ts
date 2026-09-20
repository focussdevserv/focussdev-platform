import type pg from "pg";

export interface WebhookEnvelope {
  connector: string;
  externalEventId: string;
  eventType: string;
  payload: unknown;
  critical: boolean;
  signatureValid: boolean;
}

export async function persistWebhook(
  pool: pg.Pool,
  envelope: WebhookEnvelope
): Promise<{ duplicate: boolean; inboxId: string }> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const inserted = await client.query<{ id: string }>(
      `insert into webhook_inbox
         (connector, external_event_id, event_type, payload, critical, signature_valid, status)
       values ($1, $2, $3, $4::jsonb, $5, $6, $7)
       on conflict (connector, external_event_id) do nothing
       returning id`,
      [
        envelope.connector,
        envelope.externalEventId,
        envelope.eventType,
        JSON.stringify(envelope.payload),
        envelope.critical,
        envelope.signatureValid,
        envelope.signatureValid ? "accepted" : "rejected"
      ]
    );

    if (inserted.rowCount === 0) {
      const existing = await client.query<{ id: string }>(
        "select id from webhook_inbox where connector = $1 and external_event_id = $2",
        [envelope.connector, envelope.externalEventId]
      );
      await client.query("commit");
      const inboxId = existing.rows[0]?.id;
      if (!inboxId) throw new Error("idempotency_record_missing");
      return { duplicate: true, inboxId };
    }

    const inboxId = inserted.rows[0]?.id;
    if (!inboxId) throw new Error("webhook_insert_failed");

    if (envelope.signatureValid) {
      await client.query(
        `insert into integration_jobs (inbox_id, connector, status, next_attempt_at)
         values ($1, $2, 'pending', now())`,
        [inboxId, envelope.connector]
      );
    }

    await client.query("commit");
    return { duplicate: false, inboxId };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
