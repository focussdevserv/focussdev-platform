@echo off
title Configurar DNS Local Focussdev
color 0A

:: Verifica se já é administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando privilegios de administrador...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~f0\"' -Verb RunAs"
    exit /b
)

echo =======================================================
echo    FOCUSSDEV - ATIVACAO DE SUBDOMINIOS NO HOSTS
echo =======================================================
echo.

set HOSTS=%SystemRoot%\System32\drivers\etc\hosts

findstr /C:"docs.focussdev.space" %HOSTS% >nul 2>&1
if %errorLevel% equ 0 (
    echo [OK] Os subdominios ja estao mapeados para a VPS no arquivo hosts.
) else (
    echo Mapeando subdominios para a VPS (72.62.138.208)...
    echo. >> %HOSTS%
    echo 72.62.138.208 docs.focussdev.space wiki.focussdev.space suporte.focussdev.space git.focussdev.space erp.focussdev.space projetos.focussdev.space api.focussdev.space >> %HOSTS%
    echo [SUCESSO] Mapeamento gravado com sucesso!
)

echo Limpando cache de DNS...
ipconfig /flushdns >nul

echo.
echo =======================================================
echo [PRONTO!] Agora recarregue o Hub em https://app.focussdev.space
echo Todas as aplicacoes carregarao normalmente!
echo =======================================================
echo.
pause
