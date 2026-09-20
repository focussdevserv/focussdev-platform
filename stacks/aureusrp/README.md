# AureusERP — Stack Financeiro

**Status:** Em implementação (Checkpoint 09)  
**Responsabilidade:** Receitas, despesas, cobranças, caixa e relatórios  
**Domínio:** `erp.focussdev.space`  
**Banco:** PostgreSQL exclusivo  

---

## Escopo

- Contas bancárias e operações
- Receitas (emitidas pelo Mercado Pago)
- Despesas (infraestrutura, serviços)
- Cobranças recorrentes (Mercado Pago)
- Fluxo de caixa e previsão
- Relatórios financeiros (PDF, planilha)
- Integração com DeskcommCRM (cliente → fatura)
- Integração com Mercado Pago (pagamento → confirmação)

---

## Stack

```
AureusERP (Node.js / Python / Rust)
├─ Frontend: React / Vue / Svelte
├─ Backend: Express / FastAPI / Actix
├─ Banco: PostgreSQL (exclusivo)
├─ Autenticação: Authentik (SSO)
└─ Armazenamento: Supabase Storage (notas fiscais, PDFs)
```

---

## Requisitos

| Recurso | Mínimo | Recomendado |
|---|---|---|
| vCPU | 1 | 2 |
| RAM | 512 MB | 2 GB |
| Disco | 10 GB | 50 GB |
| Conexão | Rede Docker | Rede Docker |

---

## Instalação

```bash
# 1. DNS
dig erp.focussdev.space  # Deve apontar para IP da VPS

# 2. Variáveis de ambiente
cp .env.example .env
# Editar: PostgreSQL credentials, Authentik OIDC, Supabase keys

# 3. Deploy
docker compose -f docker-compose.aureusrp.yml up -d

# 4. Verificar
curl https://erp.focussdev.space/health
```

---

## Integração com Focussdev

### DeskcommCRM → AureusERP
```
Lead vendido no CRM
  ↓ webhook
  ↓ integration-service
  ↓
AureusERP cria cliente + fatura
  ↓ webhook
  ↓
CRM atualiza pipeline (Pago/Pendente)
```

### Mercado Pago → AureusERP
```
Pagamento recebido
  ↓ webhook (Mercado Pago)
  ↓
AureusERP registra entrada
  ↓ webhook
  ↓
DeskcommCRM marca como Pago
```

---

## Autenticação

- **OIDC:** Authentik (`auth.focussdev.space`)
- **Grupo:** `financeiro` (acesso a módulos específicos)
- **Super-admin:** Usuário criado manualmente
- **Fallback:** Login nativo (se OIDC falhar)

---

## Backup

- **Banco:** Daily via `pg_dumpall` (cron)
- **Armazenamento:** `/var/backups/focussdev/aureusrp`
- **Retenção:** 30 dias
- **Teste:** Restauração mensal

---

## Monitoramento

- **Uptime Kuma:** `https://erp.focussdev.space/health`
- **Alertas:** Slack / Email (se cair)
- **Logs:** Docker logs + Sentry

---

## Próximos Passos

1. [ ] Confirmar imagem Docker (qual distribuição usar?)
2. [ ] Criar `.env.example` com variáveis
3. [ ] Montar `docker-compose.aureusrp.yml`
4. [ ] Configurar PostgreSQL
5. [ ] Setup OIDC no Authentik
6. [ ] Deploy na VPS
7. [ ] Testar criação de cliente/fatura
8. [ ] Backup + restauração
9. [ ] Checkpoint 09
10. [ ] Mercado Pago integration (depois)

---

## Referências

- PRD: `docs/prd/03-prd-finance.md`
- API: `docs/specs/aureusrp-api.md` (quando pronto)
- Arquitetura: `docs/architecture.md`
