# Focussdev Integration Service

Camada própria de integrações. Não depende de n8n e não acessa diretamente o banco interno das
aplicações conectadas.

## Estado desta fatia

- schema durável para conexões, inbox, jobs, entregas, dead letters e auditoria;
- idempotência por `(connector, external_event_id)`;
- criação de inbox e job na mesma transação;
- reserva concorrente de jobs com `FOR UPDATE SKIP LOCKED`;
- recuperação automática de reservas abandonadas após `WORKER_LEASE_MS` (padrão: 5 minutos);
- tentativa usada como token de posse, impedindo que um worker antigo finalize uma reserva nova;
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

## Recuperação da fila

Se o worker cair após reservar um job, outra execução poderá reservá-lo novamente quando o lease
expirar. A nova reserva incrementa a tentativa; somente a tentativa atual pode alterar o resultado.
Ao esgotar tentativas, o job, a inbox e a dead letter são atualizados na mesma transação, preservando
o payload. A recuperação usa as colunas existentes e não exige migration.

O worker atual apenas adia conectores ainda não implementados. Antes de ativar chamadas externas,
o conector deve ter timeout menor que o lease, idempotência no destino e renovação de lease caso
precise executar por mais tempo; o token de posse protege o banco local, não desfaz efeitos externos.

## Testes isolados

`corepack pnpm test` usa `@electric-sql/pglite` 0.5.8 somente como dependência de desenvolvimento.
O PostgreSQL WASM executa a migration existente e o SQL da fila em memória, sem `.env`, porta de
rede, serviço externo ou dados reais. A suíte cobre recuperação após queda, lease vigente, reserva
única, tentativa obsoleta, retry agendado e rollback da finalização inteira.

PGlite usa uma conexão exclusiva: chamadas simultâneas provam reserva única nesse ambiente, mas
não substituem um teste de `SKIP LOCKED` entre sessões independentes de um PostgreSQL descartável.
Referências oficiais: [início](https://pglite.dev/docs/) e [API](https://pglite.dev/docs/api).
