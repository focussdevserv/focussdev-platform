#!/bin/bash
# Script automático para criar OIDC clients no Authentik
# Executa na VPS e gera credenciais para os 6 stacks

VPS_IP="72.62.138.208"
SSH_KEY="$HOME/.ssh/focussdev_platform_deploy"
AUTHENTIK_URL="https://auth.focussdev.space"

echo "🔐 Criando OIDC Clients no Authentik"
echo "URL: $AUTHENTIK_URL"
echo ""

# 1. Obter token de admin (via API com credenciais padrão)
echo "📌 Autenticando no Authentik..."

ADMIN_TOKEN=$(curl -s -X POST "$AUTHENTIK_URL/api/v3/core/tokens/" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "akadmin",
    "password": "testing123"
  }' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ ERRO: Não consegui autenticar no Authentik"
  echo "   Credenciais padrão (akadmin/testing123) podem estar incorretas"
  echo "   Opcões:"
  echo "   1. Verifique a senha de admin no Authentik"
  echo "   2. Crie manualmente via https://auth.focussdev.space/admin/"
  exit 1
fi

echo "✅ Autenticado com sucesso"
echo ""

# 2. Criar 6 OIDC clients
STACKS=("aureusrp" "documenso" "plane" "forgejo" "bookstack" "freescout")
DOMAINS=("erp" "docs" "projetos" "git" "wiki" "suporte")

declare -A CLIENTS

for i in "${!STACKS[@]}"; do
  STACK=${STACKS[$i]}
  DOMAIN=${DOMAINS[$i]}
  FULL_DOMAIN="$DOMAIN.focussdev.space"

  echo "📝 Criando OIDC client para: $STACK ($FULL_DOMAIN)"

  # Determine redirect URI based on stack type
  case $STACK in
    aureusrp)
      REDIRECT_URI="https://$FULL_DOMAIN/api/method/frappe.integrations.oauth2_logins.login_via_oauth2_id_provider"
      ;;
    *)
      # Generic OAuth2 callback for other apps
      REDIRECT_URI="https://$FULL_DOMAIN/auth/callback"
      ;;
  esac

  # Create application via Authentik API
  RESPONSE=$(curl -s -X POST "$AUTHENTIK_URL/api/v3/core/applications/" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$STACK\",
      \"slug\": \"$STACK\",
      \"provider\": {
        \"name\": \"${STACK}-provider\",
        \"authorization_flow\": \"default-provider-authorization-implicit-consent\",
        \"authentication_flow\": \"default-authentication-flow\",
        \"property_mappings\": [],
        \"client_type\": \"confidential\",
        \"access_code_validity\": \"minutes=1\",
        \"access_token_validity\": \"minutes=5\",
        \"refresh_token_validity\": \"days=30\",
        \"redirect_uris\": \"$REDIRECT_URI\"
      }
    }")

  # Extract client ID and secret
  CLIENT_ID=$(echo "$RESPONSE" | grep -o '"client_id":"[^"]*' | cut -d'"' -f4 | head -1)
  CLIENT_SECRET=$(echo "$RESPONSE" | grep -o '"client_secret":"[^"]*' | cut -d'"' -f4 | head -1)

  if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "   ❌ ERRO ao criar client"
    echo "   Resposta: $RESPONSE"
    continue
  fi

  CLIENTS[$STACK]="$CLIENT_ID|$CLIENT_SECRET"
  echo "   ✅ Client ID: $CLIENT_ID"
  echo "   ✅ Client Secret: ${CLIENT_SECRET:0:20}..."
  echo ""
done

# 3. Salvar credenciais em arquivo
echo "💾 Salvando credenciais..."
cat > /tmp/oidc-clients.txt << EOF
# OIDC Clients Gerados
# Criado em: $(date)

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTE3NjIzLCJleHAiOjE5NDc1OTc2MjN9.-gyfiok215EuyhSMGMhc_BlZikcsUqwbKwkmFpuq5Vg

EOF

for stack in "${STACKS[@]}"; do
  IFS='|' read -r CLIENT_ID CLIENT_SECRET <<< "${CLIENTS[$stack]}"
  echo "$STACK" >> /tmp/oidc-clients.txt
  echo "  CLIENT_ID=$CLIENT_ID" >> /tmp/oidc-clients.txt
  echo "  CLIENT_SECRET=$CLIENT_SECRET" >> /tmp/oidc-clients.txt
  echo "" >> /tmp/oidc-clients.txt
done

echo "✅ Credenciais salvas em /tmp/oidc-clients.txt"
echo ""

# 4. Copiar para VPS
echo "📤 Enviando credenciais para VPS..."
cat /tmp/oidc-clients.txt | ssh -i "$SSH_KEY" root@$VPS_IP "cat > /opt/focussdev/oidc-clients.txt" && echo "✅ Arquivo enviado"

echo ""
echo "🎉 OIDC Clients criados com sucesso!"
