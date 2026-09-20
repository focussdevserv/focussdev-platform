# CHECKPOINT 07 — Focussdev Integration Service

Data: 2026-09-20

Status: base durável instalada; conectores externos ainda bloqueados.

## 1. O que foi instalado

- API e worker próprios em Node.js 22, TypeScript, Fastify, Zod e `pg`.
- PostgreSQL exclusivo `postgres:17.6-alpine`.
- Imagem CI `ghcr.io/focussdevserv/focussdev-integration-service:main`.
- Stack em `/opt/focussdev/stacks/integration-service`.
- Nenhuma porta publicada e nenhum domínio público nesta etapa.

## 2. Persistência e processamento

- `integration_connections`: catálogo e estado dos conectores.
- `webhook_inbox`: evento persistido antes de qualquer efeito.
- `integration_jobs`: fila durável com reserva concorrente por `FOR UPDATE SKIP LOCKED`.
- `integration_deliveries`: tentativas de chamadas externas.
- `integration_dead_letters`: falhas esgotadas com payload preservado.
- `integration_audit_log`: trilha de alterações e reprocessamentos.
- Idempotência única por `(connector, external_event_id)`.
- Retry exponencial com jitter e limite configurável.

## 3. Segurança

- API administrativa protegida por Bearer token de 64 caracteres hexadecimais.
- Segredos exclusivos em `.env` modo `600`, fora do Git e dos logs.
- API permanece apenas na rede Docker; o Hub estático não recebe o token administrativo.
- Uma futura ligação com `Configurações → Integrações` exige BFF autenticado pelo Authentik.
- Webhook de aplicação nenhuma foi exposto antes da validação oficial do conector.

## 4. Catálogo inicial

- 20 integrações cadastradas como `not_implemented`.
- GitHub, Meta e Google Ads incluídos no catálogo.
- n8n não faz parte da arquitetura.
- DeskcommCRM usa WAHA hoje; Evolution só poderá ser uma instalação dedicada do Focussdev.

## 5. Testes realizados

- TypeScript estrito: aprovado.
- Vitest: 2 testes aprovados.
- Build de produção: aprovado localmente e no GitHub Actions.
- Imagem construída e publicada pelo CI; VPS não compilou o código.
- API, worker e PostgreSQL: ativos; API/PostgreSQL saudáveis.
- `GET /health`: `200 {"status":"ok"}`.
- API autenticada: `200`, 20 integrações retornadas.
- Sem token: `401`.
- Teste de conector não validado: `409 connector_not_implemented`.
- Migration aplicada: 1; catálogo persistido: 20 registros.
- Evento sintético: uma inbox/job, tentativa final, dead-letter, payload preservado e resolução
  registrada. Nenhum dado de cliente foi usado.
- Hash dos contêineres protegidos antes e depois:
  `b6b5bfcaf08969e50f17b0d5bdcfd9af8991c1efe1867f35d1aeb187f15939cf`.

## 6. UI

- `Configurações → Integrações` criada no Hub.
- Mostra 20 conectores agrupados, estado desconectado, requisito pendente, última sincronização,
  erros e ação de teste desabilitada.
- A tela não declara nenhuma conexão antes do conector real existir.

## 7. Pendências antes do primeiro conector

- Escolher a primeira aplicação já instalada e validar documentação + comportamento da versão.
- Criar endpoint de webhook específico, assinatura e fixture oficial apenas desse conector.
- Criar BFF autenticado para expor leitura administrativa segura ao Hub.
- Definir backup diário do PostgreSQL exclusivo e testar restauração.
- Fixar release numerada após o primeiro conector; `main` é apenas bootstrap desta etapa.

## Living System Checklist

1. Entrada: webhooks específicos e comandos autenticados, ainda não expostos.
2. Saída: adapters oficiais por conector, ainda bloqueados.
3. Registro: inbox, jobs, deliveries, dead letters e audit log.
4. Tela: `Configurações → Integrações` com estado real/conservador.
5. Porta: rede Docker privada; nenhuma porta pública.
6. Anti-morte: fila durável, retry com jitter e dead-letter.
7. Configuração: catálogo versionado; segredos externos ao Git.
8. Continuidade: erro esgotado exige resolução humana auditada.
9. Retorno: reprocessamento será explícito, autenticado e auditado.
10. Mapa: `docs/architecture.md` e `docs/navigation-catalog.md`.
