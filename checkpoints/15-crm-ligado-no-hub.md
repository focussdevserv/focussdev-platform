# Checkpoint 15 — DeskcommCRM ligado no menu único

**Data:** 2026-09-20
**Etapa:** Correção de rota — hub estático (`hub/index.html`, `hub/app.js`, `hub/styles.css`)
**Objetivo:** Trocar os 5 itens `data-planned="DeskcommCRM"` (placeholder "Em implantação") por
links reais, agora que `crm.focussdev.space` está no ar.

## ✅ Concluído
- [x] Confirmado por HTTP real (curl) que `crm.focussdev.space` responde 307 → `/app`, com
      headers de um Next.js real (não um erro/placeholder).
- [x] Rotas reais extraídas de `runtime/deskcommcrm/lib/navigation/catalogo.ts` (fonte única de
      navegação do próprio DeskcommCRM) — nenhuma rota foi inventada:
      - Dashboard → `/app`
      - Leads → `/app/prospecting` (Prospecção)
      - Clientes → `/app/contacts` (Contatos)
      - Oportunidades → `/app/kanban` (Funis)
      - Conversas → `/app/inbox` (Inbox)
- [x] Achado e corrigido: `crm.focussdev.space` envia `X-Frame-Options: DENY` — não pode ser
      embutido em iframe (correto para um CRM com dados de cliente). Os 5 itens usam o mesmo
      padrão já usado por Authentik/Vaultwarden: `<a href>` normal, não `data-app`/iframe.
- [x] `hub/app.js`: generalizado `showApp()` (symbol/cor/descrição não ficam mais hardcoded em
      "Uptime Kuma") e o bootstrap de hash na carga da página (antes só reconhecia `#uptime`).
      Não afeta o comportamento existente do Monitoramento.
- [x] `hub/index.html`: card de status atualizado (23%→31%, 3→4 apps disponíveis, 3→4
      validados, 10→9 em implantação); quick-app do CRM adicionado; "Próxima entrega" com
      "Domínio e acesso" marcado como concluído, "Onboarding" como etapa atual (WAHA/onboarding
      real ainda não verificado — não reivindicado como pronto).
- [x] Removidos os componentes React (`hub/components/*.tsx`, `hub/pages/*.tsx`) criados por
      engano mais cedo nesta sessão — incompatíveis com a arquitetura real do hub (site estático
      sem build, Cloudflare Pages).
- [x] Testado com Playwright num servidor local (`python -m http.server 4173 --directory hub`):
      sidebar expande, 5 links do CRM têm `href` correto, quick-app novo aparece, números batem,
      sem erros de console, sem regressão no Uptime Kuma.

## 📊 Evidência
- `curl -s -D - https://crm.focussdev.space` → `HTTP/1.1 307`, `Location: /app`, headers `_next/static`.
- Screenshot full-page do hub local confirmando layout (ver histórico da sessão).
- `git diff hub/` local, ainda **não commitado neste checkpoint** até confirmação.

## 🔒 Proteções
- [x] Nenhum arquivo fora de `hub/` tocado.
- [x] Nenhum container, banco ou credencial mexido — mudança é 100% estática (HTML/CSS/JS).
- [x] Rollback: `git checkout -- hub/` (nada commitado ainda) ou revert do commit se já publicado.

## 🚫 Próxima etapa NÃO PODE
- Assumir que Onboarding/WAHA do DeskcommCRM está validado (não foi verificado).
- Reaproveitar o padrão de iframe (`data-app`) para AureusERP/Plane/Documenso/Forgejo/BookStack/
  FreeScout sem antes confirmar (via curl real, como feito aqui) se cada um permite ser
  embutido (`X-Frame-Options`) — cada um pode decidir diferente.
- Inventar rotas de outros sistemas sem inspecionar o catálogo/instalação real, mesma disciplina
  usada aqui com `lib/navigation/catalogo.ts`.

## Repositório correto (achado desta sessão, registrar para não repetir confusão)
- `fullfocus2` (github.com/focussdevserv/fullfocus2) é o app legado antigo (Express+pg) — **não**
  é onde este hub vive. Seu working tree local está com arquivos soltos do DeskcommCRM
  misturados (achado, não causado por este checkpoint) — decisão do que fazer com isso ainda
  pendente com o usuário.
- O hub real é `focussdev-platform` (github.com/focussdevserv/focussdev-platform, remoto via SSH
  `git@github.com:focussdevserv/focussdev-platform.git`), publicado direto do diretório `hub/`
  no Cloudflare Pages (sem etapa de build — ver `hub/README.md`).
