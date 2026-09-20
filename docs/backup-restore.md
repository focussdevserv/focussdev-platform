# Backups do Integration Service e DeskcommCRM

Estado: scripts preparados localmente. A presença destes arquivos não comprova instalação de
cron, execução na VPS ou restauração real. Cada uma dessas provas deve entrar no checkpoint.

## Cobertura

| Stack | Copiado | Fora desta rotina |
|---|---|---|
| Integration Service | `pg_dumpall` do PostgreSQL exclusivo, incluindo todos os bancos e roles; inventário de mounts/imagem; metadados e checksums | `.env`, manifests, segredos e configuração externa do Postgres |
| DeskcommCRM/Supabase | `pg_dumpall` do `focussdev_supabase-db-1`, incluindo todos os bancos, schemas e roles | bytes de objetos Supabase Storage; configuração, `.env`, manifests e chaves de criptografia |
| WAHA | sessões em `/app/.sessions` e mídias em `/app/.media` do `focussdevcrm-waha-1` | consistência transacional entre arquivos ativos e banco; credenciais fora desses volumes |

Os mounts WAHA verificados são `focussdevcrm_waha-data` e `focussdevcrm_waha-media`. O script
confere tipo, nome, destino, projeto Compose, serviço e container em execução antes de copiar.
Nenhum caminho do armazenamento Docker é adivinhado: a cópia ocorre nos destinos já montados,
via `docker exec`, e `mounts.txt` registra os campos Type/Name/Source/Destination observados.

O inventário não lê `.Config.Env`. `configuration-coverage.txt` registra somente existência dos
arquivos esperados; não lê nem copia `.env`. O mount ativo de Supabase Storage e a localização
dos manifests/configuração Supabase ainda precisam de inventário. Metadados no banco não
substituem os bytes de objetos. Não classificar esse conjunto como recuperação completa do CRM.

Dump de cluster contém dados pessoais e hashes de senhas dos roles; arquivos WAHA contêm
credenciais de sessão. Todo o conjunto é privado: diretórios `700`, arquivos `600`, sem conteúdo
de dump, arquivos ou credenciais nos logs. `.env`, chaves de criptografia e manifests efetivos
precisam de custódia separada e protegida para recuperar login, decrypt e configuração. Essa
cobertura será ampliada somente após inventário e decisão de escopo.

## Consistência e garantias

- PostgreSQL continua em execução. `pg_dumpall` fornece snapshot lógico consistente por banco,
  mas não um snapshot único entre todos os bancos, nem entre banco e WAHA.
- WAHA continua em execução. Os dois arquivos tar são cópias **online best-effort**: arquivos podem
  mudar durante a leitura ou entre as cópias. Falha do `tar` aborta a publicação, mas sucesso do
  `tar` não prova consistência de uma sessão ativa. Pode ser necessário parear novamente após restore.
- A rotina não pausa containers. Um backup de recuperação com consistência coordenada exige
  procedimento específico em janela aprovada ou recurso de snapshot comprovado do provedor.
- Um lock `flock` não bloqueante impede duas execuções da mesma rotina. Disputa de lock retorna
  código `75`; erro retorna código diferente de zero. Scripts usam `set -euo pipefail`.
- Dumps são validados por integridade gzip e marcador final do `pg_dumpall`; tars por leitura do
  índice; todos os arquivos publicados têm SHA-256. Isso verifica integridade de transporte,
  **não restauração funcional**.
- Todos os artefatos são preparados em diretório oculto no destino e publicados juntos por rename
  no mesmo filesystem. Em falha, o staging é removido; backups completos anteriores permanecem.
  SIGKILL ou queda do host pode deixar `.stage-*` privado para inspeção manual. Rename não promete
  durabilidade física frente à perda abrupta de energia.
- Retenção roda somente após nova publicação bem-sucedida. Só remove diretórios gerados pela
  mesma rotina, com nome timestamp/sufixo esperado e marcador de propriedade correspondente.
  Diretórios legados, outros projetos, links e backups sem marcador não entram na retenção.
  `find -mtime +7` conserva pelo menos sete dias completos e só torna elegível após oito dias.
- Nenhum backup é enviado para fora da VPS. Falha/perda do host permanece um risco até existir
  destino externo criptografado e restore testado.

## Instalação e primeira execução (ainda pendentes)

Requisitos no host: Bash, Docker CLI com permissão sobre as stacks, GNU coreutils/findutils,
gzip/tar e `flock` do util-linux. As imagens em execução precisam oferecer `pg_dumpall` e WAHA
precisa oferecer `tar`. A rotina falha se identidade, ferramenta ou autenticação não corresponder.
Autenticação PostgreSQL usa socket local no próprio container com `--no-password`: a política
existente precisa permitir o usuário especificado; a rotina nunca solicita/interpola senha.

Os scripts devem ser instalados como arquivos root-owned `700` nestes caminhos exclusivos:

```text
/opt/focussdev/stacks/integration-service/backup.sh
/opt/focussdev/stacks/deskcommcrm/backup.sh
```

O segundo diretório é tooling do Focussdev; o source upstream do CRM permanece em
`/opt/focussdev/deskcommcrm`. Os destinos padrão são:

```text
/var/backups/focussdev/integration-service/
/var/backups/focussdev/deskcommcrm/
```

Executar manualmente cada script e conferir o conjunto privado antes de instalar o cron. Os
arquivos `.cron` fornecidos usam 02:55 para Integration Service e 03:15 para CRM **no fuso do host**;
não afirmar UTC sem verificar o fuso. O pipeline com `logger` preserva falha via Bash/pipefail.
Copiar os arquivos cron para `/etc/cron.d/` com dono root, modo `644` e nome correspondente,
somente na etapa de instalação autorizada; nunca sobrescrever o crontab global.

`FOCUSS_BACKUP_ROOT` permite escolher uma raiz alternativa absoluta/canônica (sem symlinks e sem
barra final) para destino dedicado ou ensaio isolado. Os nomes dos containers e projetos não são
configuráveis. Não apontar os scripts de produção para o Supabase `credmaisapp`, `evolutions`
ou outros projetos.

## Conferência do conjunto

No diretório de um backup escolhido explicitamente, conferir:

```bash
sha256sum --check SHA256SUMS
gzip -t postgres-cluster.sql.gz
```

Para CRM, adicionar `tar -tzf waha-sessions.tar.gz >/dev/null` e
`tar -tzf waha-media.tar.gz >/dev/null`. Não imprimir o SQL, sessões ou mídia em terminal/log.
Ler metadados e cobertura; registrar data, tamanho, hash e resultado sanitizado no checkpoint.

## Ensaio de restauração necessário

1. Selecionar um backup completo e validar todos os hashes antes de restaurar.
2. Provisionar PostgreSQL descartável com a mesma versão, extensões e imagem do Supabase ou
   Integration Service de origem. Rede, volumes, portas e credenciais devem ser isolados da
   produção. Desativar saída de rede de apps, workers, webhooks e WhatsApp.
3. Restaurar o SQL com `psql` e `ON_ERROR_STOP=1`, preservando owners/roles necessários. Um
   `pg_dumpall` pode conflitar com o role bootstrap ou objetos da imagem; planejar esse bootstrap
   antes do ensaio e tratar cada conflito explicitamente. Não aceitar restore com erros ignorados
   nem executar o dump sobre um banco em produção. Não usar `--clean` como atalho.
4. Validar schemas, roles, extensões, grants, contagens/chaves esperadas e queries de leitura.
   Para o Integration Service, validar inbox/jobs/dead letters e idempotência numa rede isolada,
   sem executar entregas externas. Para Supabase, validar Auth, Storage e o schema da aplicação.
5. Extrair as cópias WAHA em volumes novos e offline, com ownership compatível com a imagem.
   Não iniciar uma segunda sessão conectada ao mesmo WhatsApp. Um ensaio funcional do canal
   exige estratégia isolada autorizada; simples leitura do tar não comprova a sessão recuperada.
6. Inventariar e restaurar separadamente objetos Supabase Storage, configuração e chaves antes
   de aceitar recuperação completa. Validar anexos e decrypt de dados na interface apropriada.
7. Medir RPO/RTO e registrar comandos, versões, resultados e limitações sem dados sensíveis.
   A produção permanece intacta; remover somente recursos descartáveis explicitamente criados
   para o ensaio após conferir projeto, nomes e caminhos.

Nenhum desses passos de restauração foi executado pela criação destes scripts.
