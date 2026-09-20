curl -s -X POST http://172.16.8.3:3100/v1/onboarding/client \
  -H 'Content-Type: application/json' \
  -d '{"name":"Grupo Vanguarda","email":"diretoria@vanguarda.com.br","plan":"pro","mrr_cents":490000,"domain":"vanguarda.com.br"}'
echo ""
