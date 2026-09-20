# Focussdev Integration Service

Camada própria de integrações. Não depende de n8n e não acessa diretamente o banco interno das
aplicações conectadas.

## Estado desta fatia

- schema durável para conexões, inbox, jobs, entregas, dead letters e auditoria;
- idempotência por `(connector, external_event_id)`;
- criação de inbox e job na mesma transação;
- reserva concorrente de jobs com `FOR UPDATE SKIP LOCKED`;
- retry exponencial com jitter e limite de tentativas;
- API administrativa protegida por Bearer token;
- nenhum conector externo ativado antes de comprovar a API/webhook da versão instalada.

## Desenvolvimento

Copie `.env.example` para um arquivo local não versionado, suba um PostgreSQL descartável e rode:

```text
corepack pnpm install
corepack pnpm migrate
corepack pnpm test
corepack pnpm dev
```

Nunca use credenciais de produção em testes locais.
