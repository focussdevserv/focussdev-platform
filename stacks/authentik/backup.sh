#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/opt/focussdev/stacks/authentik"
BACKUP_DIR="/var/backups/focussdev/authentik"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TMP_FILE="${BACKUP_DIR}/.${STAMP}.dump.tmp"
FINAL_FILE="${BACKUP_DIR}/authentik-${STAMP}.dump"

install -d -m 700 "${BACKUP_DIR}"
cd "${STACK_DIR}"

set -a
# shellcheck disable=SC1091
source ./.env
set +a

cleanup() {
  rm -f -- "${TMP_FILE}"
}
trap cleanup EXIT

docker compose --env-file .env -f compose.yml exec -T postgresql \
  pg_dump -Fc -U "${PG_USER}" "${PG_DB}" < /dev/null > "${TMP_FILE}"

docker compose --env-file .env -f compose.yml exec -T postgresql \
  pg_restore -l < "${TMP_FILE}" > /dev/null

chmod 600 "${TMP_FILE}"
mv -- "${TMP_FILE}" "${FINAL_FILE}"
sha256sum "${FINAL_FILE}" > "${FINAL_FILE}.sha256"
chmod 600 "${FINAL_FILE}.sha256"

find "${BACKUP_DIR}" -maxdepth 1 -type f \
  \( -name 'authentik-*.dump' -o -name 'authentik-*.dump.sha256' \) \
  -mtime +7 -delete

printf 'authentik backup validado: %s\n' "${FINAL_FILE}"
