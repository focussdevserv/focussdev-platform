# Focussdev Integration Service

Serviço próprio responsável por conectar as aplicações do ecossistema sem n8n e sem acesso direto
ao banco interno de outra aplicação.

## Contrato operacional

Cada conector é implementado e ativado isoladamente, nesta ordem:

1. identificar a versão instalada;
2. confirmar API, autenticação e webhooks na documentação oficial daquela versão;
3. registrar os eventos aceitos e emitidos;
4. implementar o conector;
5. testar conexão, assinatura, idempotência, retry e recuperação;
6. publicar o checkpoint antes do próximo conector.

Endpoint que não estiver documentado ou comprovado na instalação não será utilizado.

## Persistência e processamento

- `integration_connections`: configuração não secreta, estado e último teste por conector;
- `webhook_inbox`: payload recebido, assinatura verificada, chave idempotente e estado;
- `integration_jobs`: fila durável com tentativa, próxima execução e prioridade;
- `integration_deliveries`: cada chamada externa, status, duração e erro sanitizado;
- `integration_dead_letters`: eventos esgotados que exigem ação humana;
- `integration_audit_log`: alterações de configuração e reprocessamentos.

O payload entra em `webhook_inbox` antes de qualquer efeito. A reserva idempotente e a criação do
job acontecem na mesma transação. Jobs usam retry exponencial com jitter; eventos críticos nunca são
descartados automaticamente.

## Superfície no Focussdev

`Configurações → Integrações` mostrará, para cada conector:

- conectado ou desconectado;
- configuração obrigatória ainda ausente;
- ação para testar conexão;
- última sincronização bem-sucedida;
- erros ativos e dead letters;
- entregas e logs sanitizados;
- ação explícita e auditada para reprocessar.

Segredos ficam fora do frontend, do Git e dos logs. A tela exibe apenas presença, validade e data da
última rotação.

## Fronteiras

- DeskcommCRM usa WAHA como canal WhatsApp.
- A instalação `evolutions` existente na VPS pertence a outro projeto e não será reutilizada.
- Uma futura Evolution API do Focussdev deverá ter instância, banco, volume e credenciais próprios.
- Pagamentos e contratos usam inbox transacional, idempotência e retenção de payload conforme LGPD.
