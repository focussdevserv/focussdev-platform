# 🚀 PRÓXIMOS PASSOS — FOCUSSDEV PLATFORM

**Data:** 2026-09-20 20:20 UTC-3  
**Status:** 🟢 Pronto para FASE 1

---

## ✅ O que temos AGORA

```
Infraestrutura:
  ✅ DeskcommCRM (CRM + WhatsApp)
  ✅ Supabase (banco + APIs)
  ✅ Authentik (login único)
  ✅ Integration Service (webhooks)
  ✅ AureusERP (financeiro)
  ✅ Documenso (propostas)
  ✅ Plane (projetos) — iniciando

Novos Componentes:
  ✅ WeatherCard.tsx (clima Apple-style com Open-Meteo)
```

---

## 📋 FASE 1 — Cliente 360°

### Objetivo
Quando você clica em um cliente no CRM:
```
┌─────────────────────────────────────────┐
│          CLIENTE 360° VIEW               │
├─────────────────────────────────────────┤
│                                         │
│  Nome: ACME Corp                        │
│  Email: contact@acme.com                │
│  Telefone: +55 11 99999-9999            │
│                                         │
│  ┌────────────┬──────────┬────────────┐ │
│  │   CRM      │ Projetos │  Financeiro│ │
│  │ - Leads    │ - Tarefas│  - Faturas │
│  │ - Vendas   │ - Status │  - Pgtos   │
│  │ - Histórico│ - Timeline│ - MRR     │
│  └────────────┴──────────┴────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Implementação
1. **API de Agregação** (`lib/clients/aggregator.ts`)
   - GET `/api/v1/clients/{id}/overview`
   - Chama CRM, Financeiro, Projetos em paralelo
   - Cache 5 minutos

2. **Frontend** (`components/ClientView.tsx`)
   - Tabs: Visão Geral | Projetos | Contratos | Financeiro | Suporte
   - Cards com informações de cada sistema
   - Timeline unificada

3. **Global ID Mapping** (`lib/integration/xref.ts`)
   - CRM lead_id → AureusERP customer_id → Plane project_id
   - Tabela: `integration_links`

4. **Bonus:** Weather Card
   - `components/WeatherCard.tsx` — clima no dashboard
   - API: Open-Meteo (gratuita)

---

## 🎯 Timeline FASE 1

```
Dia 1 (hoje):
  ✅ Criar API de agregação (1h)
  ✅ Criar tabela integration_links (30min)
  ✅ Criar frontend ClientView (2h)
  ✅ Testar com dados reais (1h)

Dia 2:
  ✅ Ajustar design (1h)
  ✅ Adicionar filtros/busca (1h)
  ✅ E2E tests (1h)
  ✅ Deploy QA (30min)
```

---

## 📦 Arquivos a Criar

```
lib/
  ├── clients/
  │   ├── aggregator.ts          (API de agregação)
  │   └── types.ts               (tipos)
  ├── integration/
  │   ├── xref.ts                (mapeamento global IDs)
  │   └── sync.ts                (sincronização)

components/
  ├── ClientView.tsx             (layout principal)
  ├── ClientTabs.tsx             (abas)
  ├── ClientInfo.tsx             (dados básicos)
  ├── WeatherCard.tsx            (EM PROGRESSO ✅)
  └── Timeline.tsx               (feed unificado)

app/api/v1/
  ├── clients/
  │   └── [id]/
  │       └── route.ts           (GET /clients/{id}/overview)
  └── integration/
      └── xref/
          └── route.ts           (GET/POST xref)

supabase/migrations/
  └── NNNN_create_integration_links.sql
```

---

## 💾 Você quer:

**A: Começar FASE 1 AGORA** (implementar Cliente 360°)
  - Você pede requisitos/direção
  - Eu codo a agregação + frontend
  - ~4h para MVP funcional

**B: Esperar 100% dos stacks** (Forgejo, BookStack, FreeScout)
  - Mais 20-30 minutos
  - Depois começar FASE 1
  - Menos paralelismo

**C: Fazer tudo em paralelo**
  - Eu continuo com os 3 stacks faltantes
  - Você começa design de Cliente 360°
  - Máxima eficiência

---

## 🎨 Bonus: Weather Card

✅ Criado: `hub/components/WeatherCard.tsx`
- Clima em tempo real via Open-Meteo
- Design Apple Weather (gradient + glassmorphism)
- Mostra: Temperatura, Umidade, Vento, Visibilidade, Chuva
- Atualiza a cada 10 minutos
- Zero dependência de chave de API

**Como usar:**
```tsx
import WeatherCard from '@/hub/components/WeatherCard';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <WeatherCard />
      {/* outros widgets */}
    </div>
  );
}
```

---

## 🎬 Meu Recomendação

**Começar FASE 1 AGORA** (Opção A)

Razão: os 3 stacks faltantes (Forgejo, BookStack, FreeScout) são **complemento**, não bloqueador. Podemos começar Cliente 360° com o que temos — DeskcommCRM, Supabase, AureusERP, Documenso, Plane — e os outros entram depois.

Focusso em:
1. **Hoje à noite:** API de agregação + Global IDs
2. **Amanhã:** Frontend Cliente 360°
3. **Amanhã à tarde:** E2E tests + deploy QA
4. **Próxima semana:** Projeto 360° + outros stacks

---

**Qual você quer? A, B ou C?** 👇
