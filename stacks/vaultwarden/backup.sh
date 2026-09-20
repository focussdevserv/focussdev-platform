#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/opt/focussdev/stacks/vaultwarden"
BACKUP_DIR="/var/backups/focussdev/vaultwarden"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TMP_ARCHIVE="${BACKUP_DIR}/.${STAMP}.tar.gz.tmp"
FINAL_ARCHIVE="${BACKUP_DIR}/vaultwarden-${STAMP}.tar.gz"
STAGE_DIR=""

install -d -m 700 "${BACKUP_DIR}"
cd "${STACK_DIR}"

container_id="$(docker compose -f compose.yml ps -q vaultwarden)"
if [[ -z "${container_id}" ]]; then
  printf 'container do Vaultwarden nao esta em execucao\n' >&2
  exit 1
fi

cleanup() {
  if [[ -n "${STAGE_DIR}" ]]; then
    case "${STAGE_DIR}" in
      "${BACKUP_DIR}"/.stage-*) rm -rf -- "${STAGE_DIR}" ;;
    esac
  fi
  rm -f -- "${TMP_ARCHIVE}"
}
trap cleanup EXIT

docker exec "${container_id}" /vaultwarden backup
database_backup="$(docker exec "${container_id}" sh -c "ls -1t /data/db_*.sqlite3 2>/dev/null | head -n 1")"
if [[ -z "${database_backup}" ]]; then
  printf 'backup consistente do banco nao foi criado\n' >&2
  exit 1
fi

STAGE_DIR="$(mktemp -d -p "${BACKUP_DIR}" ".stage-${STAMP}.XXXXXX")"
chmod 700 "${STAGE_DIR}"
docker cp "${container_id}:/data/." "${STAGE_DIR}/"
docker cp "${container_id}:${database_backup}" "${STAGE_DIR}/db.sqlite3.consistent"
rm -f -- \
  "${STAGE_DIR}/db.sqlite3" \
  "${STAGE_DIR}/db.sqlite3-wal" \
  "${STAGE_DIR}/db.sqlite3-shm" \
  "${STAGE_DIR}"/db_*.sqlite3
mv -- "${STAGE_DIR}/db.sqlite3.consistent" "${STAGE_DIR}/db.sqlite3"
tar -C "${STAGE_DIR}" -czf "${TMP_ARCHIVE}" .

tar -tzf "${TMP_ARCHIVE}" > /dev/null
tar -tzf "${TMP_ARCHIVE}" | grep -F 'db.sqlite3' > /dev/null
docker run --rm \
  --volume "${BACKUP_DIR}:/backup:ro" \
  --entrypoint sh \
  docker.io/louislam/uptime-kuma:2.5.5 \
  -c "mkdir -p /tmp/restore && tar -xzf '/backup/$(basename "${TMP_ARCHIVE}")' -C /tmp/restore && test \"\$(sqlite3 /tmp/restore/db.sqlite3 'pragma integrity_check;')\" = ok"

chmod 600 "${TMP_ARCHIVE}"
mv -- "${TMP_ARCHIVE}" "${FINAL_ARCHIVE}"
sha256sum "${FINAL_ARCHIVE}" > "${FINAL_ARCHIVE}.sha256"
chmod 600 "${FINAL_ARCHIVE}.sha256"

docker exec "${container_id}" sh -c 'rm -f /data/db_*.sqlite3'
find "${BACKUP_DIR}" -maxdepth 1 -type f \
  \( -name 'vaultwarden-*.tar.gz' -o -name 'vaultwarden-*.tar.gz.sha256' \) \
  -mtime +7 -delete

printf 'vaultwarden backup validado: %s\n' "${FINAL_ARCHIVE}"
