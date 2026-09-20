#!/bin/bash
# =============================================================================
# focussdev-deploy-frame-headers.sh
# Aplica as configurações de iframe em todas as stacks do Focussdev Hub.
# Executar na VPS: bash focussdev-deploy-frame-headers.sh
# =============================================================================
set -euo pipefail

FOCUSSDEV_ROOT="/opt/focussdev"

echo "=== Focussdev Hub — Deploy de headers de embedding ==="
echo ""

# ─── 1. DeskcommCRM (docker compose labels) ───────────────────────────────────
echo "► [1/7] DeskcommCRM..."
if [ -d "$FOCUSSDEV_ROOT/deskcommcrm" ]; then
  cd "$FOCUSSDEV_ROOT/deskcommcrm"
  docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml -f docker-compose.focussdev.yml up -d --no-deps app
elif [ -d "$FOCUSSDEV_ROOT/stacks/deskcommcrm" ]; then
  cd "$FOCUSSDEV_ROOT/stacks/deskcommcrm"
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps app
fi
echo "   ✓ DeskcommCRM reiniciado"

# ─── 2. Plane ────────────────────────────────────────────────────────────────
echo "► [2/7] Plane..."
cd "$FOCUSSDEV_ROOT/stacks/plane"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps plane || true
else
  docker compose up -d --no-deps plane || true
fi
echo "   ✓ Plane verificado"

# ─── 3. Documenso ────────────────────────────────────────────────────────────
echo "► [3/7] Documenso..."
cd "$FOCUSSDEV_ROOT/stacks/documenso"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps documenso
else
  docker compose up -d --no-deps documenso
fi
echo "   ✓ Documenso reiniciado"

# ─── 4. FreeScout ────────────────────────────────────────────────────────────
echo "► [4/7] FreeScout..."
cd "$FOCUSSDEV_ROOT/stacks/freescout"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps freescout
else
  docker compose up -d --no-deps freescout
fi
echo "   ✓ FreeScout reiniciado"

# ─── 5. Forgejo ──────────────────────────────────────────────────────────────
echo "► [5/7] Forgejo..."
cd "$FOCUSSDEV_ROOT/stacks/forgejo"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps forgejo
else
  docker compose up -d --no-deps forgejo
fi
echo "   ✓ Forgejo reiniciado"

# ─── 6. BookStack ────────────────────────────────────────────────────────────
echo "► [6/7] BookStack..."
cd "$FOCUSSDEV_ROOT/stacks/bookstack"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps bookstack
else
  docker compose up -d --no-deps bookstack
fi
echo "   ✓ BookStack reiniciado"

# ─── 7. AureusERP ────────────────────────────────────────────────────────────
echo "► [7/7] AureusERP..."
cd "$FOCUSSDEV_ROOT/stacks/aureusrp"
if [ -f "docker-compose.focussdev.yml" ]; then
  docker compose -f docker-compose.yml -f docker-compose.focussdev.yml up -d --no-deps aureusrp
else
  docker compose up -d --no-deps aureusrp
fi
echo "   ✓ AureusERP reiniciado"

echo ""
echo "=== ATENÇÃO: Authentik, Vaultwarden e Uptime Kuma usam traefik.yaml estático ==="
echo "    Para essas stacks, é necessário recarregar o Traefik:"
echo "    docker kill --signal=SIGHUP traefik   (ou restart do container traefik)"
echo ""
echo "=== Verificação rápida de headers ==="
echo "Testando DeskcommCRM..."
curl -sI https://crm.focussdev.space | grep -E "(X-Frame|Content-Security)" || echo "   (sem resultado — pode estar em warm-up)"

echo ""
echo "✅ Deploy concluído!"
