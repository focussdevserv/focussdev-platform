# Script para adicionar subdomínios da Focussdev ao hosts do Windows
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$entry = "72.62.138.208 docs.focussdev.space wiki.focussdev.space suporte.focussdev.space git.focussdev.space erp.focussdev.space projetos.focussdev.space api.focussdev.space"

$content = Get-Content $hostsPath -Raw
if ($content -match "docs\.focussdev\.space") {
    Write-Host "[OK] As entradas já estão presentes no arquivo hosts!" -ForegroundColor Green
} else {
    Add-Content -Path $hostsPath -Value "`n$entry"
    Write-Host "[SUCESSO] Subdomínios mapeados para 72.62.138.208 com sucesso!" -ForegroundColor Green
}

Clear-DnsClientCache
Write-Host "[PRONTO] Cache de DNS limpo. Agora recarregue o Hub em https://app.focussdev.space!" -ForegroundColor Cyan
