# Focussdev Platform

Camada de infraestrutura e integração do ecossistema Focussdev.

Este repositório não replica interfaces dos produtos integrados. Cada aplicação mantém seu frontend, backend, banco, volumes, migrations e ciclo de atualização originais.

## Princípios

- Uma stack por vez.
- Imagens e versões fixadas.
- Bancos e volumes isolados.
- SSO somente por mecanismos oficialmente suportados.
- APIs e webhooks no lugar de acesso direto ao banco de outra aplicação.
- Checkpoint obrigatório antes de avançar.
- Segredos nunca entram no Git.

## Limite de operação

Este repositório autoriza mudanças somente nos recursos exclusivos do novo Focussdev:

- diretórios sob `/opt/focussdev` e `/var/backups/focussdev`;
- projetos/serviços `focussdev`, `focussdevcrm` e `focussdev_supabase`;
- domínios e rotas de `*.focussdev.space`;
- repositório `focussdevserv/focussdev-platform` e aplicações documentadas nos checkpoints.

São protegidos e ficam fora do escopo: `credmaisapp`, `evolutions`, `botscassino`, outros projetos
da VPS, a instalação global do EasyPanel/Traefik/Docker e credenciais globais do servidor. Uma
mudança compartilhada só pode acrescentar a rota/rede estritamente necessária ao Focussdev e deve
provar que os demais consumidores permaneceram intactos. Senha root, firewall global, sistema
operacional e reinício da VPS não mudam sem autorização específica.

## Estrutura

- `docs/`: arquitetura, inventário e operação.
- `checkpoints/`: estado verificável de cada stack.
- `stacks/`: manifests externos, sem cópia do código upstream.
- `hub/`: única interface própria, limitada à entrada e navegação.
- `integrations/`: workflows e contratos de eventos.

## Acessos disponíveis

- Hub: `https://app.focussdev.space`
- Identidade: `https://auth.focussdev.space`
- Monitoramento: `https://status.focussdev.space`
- Cofre: `https://cofre.focussdev.space`

Os módulos em implantação aparecem no Hub sem link até a instalação, autenticação e persistência
serem validadas. Isso impede que um destino incompleto pareça operacional.
