#!/bin/bash
# Deploy seguro das 5 stacks faltantes para VPS Focussdev
# Apenas em /opt/focussdev/stacks — não toca em outros projetos

VPS_IP="72.62.138.208"
SSH_KEY="$HOME/.ssh/focussdev_platform_deploy"
VPS_ROOT="/opt/focussdev/stacks"

STACKS=("aureusrp" "documenso" "plane" "forgejo" "bookstack" "freescout")
LOCAL_STACKS="/c/Users/focussdev/orca/focussdev-platform/stacks"

echo "🔐 Deploy das stacks Focussdev"
echo "VPS: $VPS_IP"
echo "Stacks: ${STACKS[@]}"
echo ""

# 1. Criar diretórios na VPS
echo "📁 Criando diretórios na VPS..."
for stack in "${STACKS[@]}"; do
  ssh -i "$SSH_KEY" root@$VPS_IP "mkdir -p $VPS_ROOT/$stack && chmod 700 $VPS_ROOT/$stack && echo '✅ $stack'"
done

echo ""
echo "📤 Copiando arquivos..."
for stack in "${STACKS[@]}"; do
  # Copiar docker-compose
  local_compose="$LOCAL_STACKS/$stack/docker-compose.${stack}.yml"
  if [ -f "$local_compose" ]; then
    scp -i "$SSH_KEY" "$local_compose" root@$VPS_IP:$VPS_ROOT/$stack/
    echo "✅ docker-compose.$stack.yml"
  fi

  # Copiar .env.example
  local_env="$LOCAL_STACKS/$stack/.env.example"
  if [ -f "$local_env" ]; then
    scp -i "$SSH_KEY" "$local_env" root@$VPS_IP:$VPS_ROOT/$stack/
    echo "✅ .env.example para $stack"
  fi
done

echo ""
echo "⚠️  PRÓXIMOS PASSOS MANUAIS:"
echo ""
echo "Para CADA stack, na VPS:"
echo "  cd /opt/focussdev/stacks/<stack>"
echo "  cp .env.example .env"
echo "  # Editar .env com valores reais (senhas, OIDC, etc)"
echo "  docker compose -f docker-compose.<stack>.yml up -d"
echo "  curl https://<stack>.focussdev.space/api/health"
echo ""
echo "Ordem recomendada:"
echo "  1. aureusrp (erp.focussdev.space)"
echo "  2. documenso (docs.focussdev.space)"
echo "  3. plane (projetos.focussdev.space)"
echo "  4. forgejo (git.focussdev.space)"
echo "  5. bookstack (wiki.focussdev.space)"
echo "  6. freescout (suporte.focussdev.space)"
