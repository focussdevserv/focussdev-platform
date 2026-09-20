# Focussdev Hub

Portal estático de entrada do ecossistema. Ele não replica dashboards nem funcionalidades das
aplicações integradas: cada módulo disponível abre a aplicação upstream completa em seu próprio
subdomínio.

## Execução local

```powershell
python -m http.server 4173 --directory hub
```

Abra `http://127.0.0.1:4173`.

## Publicação

O diretório de saída do Cloudflare Pages é `hub/`. Não há etapa de build.

Módulos ainda não instalados aparecem como `Em implantação` e não possuem link. Ao concluir uma
stack, substitua o respectivo `article` por um link real e atualize a contagem de módulos
disponíveis.
