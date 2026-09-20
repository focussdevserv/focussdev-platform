# CHECKPOINT — Inventário de VPS

Status: concluído. Focussdev antigo removido com backup validado.

## VPS correta

- Endereço: `72.62.138.208`
- Hostname: `srv1257466`
- Sistema: Ubuntu 24.04 LTS, reinicialização pendente.
- Capacidade: 2 vCPU, aproximadamente 8 GiB de RAM, sem swap, 77 GiB livres.
- Uso atual: aproximadamente 3,8 GiB de RAM.
- Infraestrutura: Docker 29.7.1, Compose 5.3.1, Swarm ativo, EasyPanel e Traefik.

## Recursos protegidos

- Projeto `credmaisapp` e sua instalação Supabase completa.
- Projeto `evolutions`: Evolution API, PostgreSQL, Redis e volume de instâncias.
- EasyPanel, Traefik, Docker e redes compartilhadas.
- Portas, certificados e arquivos compartilhados da infraestrutura.

## Recursos exclusivos do Focussdev antigo

- Serviço `focussapp_focussapp-api`.
- Serviço `focussapp_focussapp-db`.
- Rede `easypanel-focussapp`.
- Diretório `/etc/easypanel/projects/focussapp` (aproximadamente 127 MiB).
- Imagem `easypanel/focussapp/focussapp-api:latest` (aproximadamente 376 MiB).
- Banco PostgreSQL persistido em `/etc/easypanel/projects/focussapp/focussapp-db/data`.
- Rotas existentes para `focussdev.space` e `www.focussdev.space`.

O aplicativo antigo usa aproximadamente 88 MiB de RAM. Não há volume Docker nomeado do banco; a persistência é um bind mount exclusivo dentro do diretório do projeto.

## Plano de remoção segura

1. Gerar backup do banco com ferramenta nativa do PostgreSQL.
2. Arquivar código e configuração com permissões restritas.
3. Validar listagem do dump, arquivo compactado e checksums.
4. Remover somente os dois serviços `focussapp_*`.
5. Confirmar que a rede exclusiva não possui endpoints antes de removê-la.
6. Remover somente o diretório exclusivo após validar seu caminho absoluto.
7. Remover somente a imagem exclusiva se nenhum container ou serviço ainda a utilizar.
8. Preservar os domínios e registrar a configuração necessária para a nova estrutura.

## Resultado da remoção

- Backup: `/var/backups/focussdev-legacy/20260920T122617Z`.
- Dump PostgreSQL validado com `pg_restore -l`.
- Arquivo de código e configuração validado com `tar -tzf`.
- Checksums SHA-256 validados.
- Serviços `focussapp_focussapp-api` e `focussapp_focussapp-db`: removidos.
- Containers `focussapp_*`: ausentes.
- Rede `easypanel-focussapp`: removida.
- Diretório `/etc/easypanel/projects/focussapp`: removido após validação do caminho absoluto.
- Imagem exclusiva `easypanel/focussapp/focussapp-api:latest`: removida quando ficou sem consumidores.
- Domínios `focussdev.space` e `www.focussdev.space`: registrados para reutilização.

## Verificação dos projetos protegidos

- EasyPanel: `1/1`, HTTP 200.
- Traefik: `1/1`.
- Evolution API, PostgreSQL e Redis: `1/1` cada.
- Todos os 13 containers do Supabase de `credmaisapp`: em execução; os serviços com health check permanecem saudáveis.
- Hash das definições dos serviços protegidos permaneceu idêntico antes e depois.
- Hash do inventário dos containers `credmaisapp` permaneceu idêntico antes e depois.

## Limpeza autorizada do `botscassino`

Executada em 20/09/2026, após autorização explícita do proprietário.

- Não havia container, serviço ou rede ativa do projeto.
- O volume `botscassino_autobet_autobet-data` não possuía consumidores e foi removido.
- Os três backups exclusivos em `/etc/easypanel/backups/botscassino` foram removidos.
- O diretório `/etc/easypanel/projects/botscassino` já estava ausente.
- A busca final não encontrou container, serviço, volume, rede, pasta ou backup com o nome `botscassino`.
- O hash do inventário e do estado de todos os containers foi idêntico antes e depois da limpeza.

## Capacidade após a limpeza

- Memória: aproximadamente 3,7 GiB usados de 7,8 GiB; 4,0 GiB disponíveis.
- Swap: inexistente.
- Disco: aproximadamente 77 GiB livres.
- O aplicativo antigo liberou pouca memória; a VPS continua limitada a 2 vCPU e 8 GiB para o ecossistema completo.

## Host protegido

- Endereço: `2.25.225.206`
- Hostname: `srv1984274`
- Sistema: Ubuntu 24.04 LTS
- Capacidade: 4 vCPU, aproximadamente 15 GiB de RAM e 177 GiB disponíveis em disco.
- Infraestrutura encontrada: Docker 29.7.2, Docker Compose 5.5.0, Docker Swarm, EasyPanel e Traefik.
- Projetos identificados: `nexsiles` e `elolab`.
- Bancos identificados: instalações Supabase independentes de `nexsiles` e `elolab`.
- Evidência de Focussdev: nenhuma.

## Decisão

Este host não será alterado. Todos os containers, serviços, redes, volumes, imagens e bancos encontrados nele pertencem a outros projetos ou à infraestrutura compartilhada.

## Ações executadas

- Somente comandos de inventário e leitura.
- Nenhum container reiniciado.
- Nenhum arquivo alterado.
- Nenhuma imagem, rede, volume ou banco removido.

## Próximo passo

Identificar a VPS correta a partir da URL do EasyPanel já aberto no Chrome. Depois repetir o inventário antes de preparar a lista de remoção do Focussdev antigo.
