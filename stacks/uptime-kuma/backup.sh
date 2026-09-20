#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/opt/focussdev/stacks/uptime-kuma"
BACKUP_DIR="/var/backups/focussdev/uptime-kuma"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TMP_ARCHIVE="${BACKUP_DIR}/.${STAMP}.tar.gz.tmp"
FINAL_ARCHIVE="${BACKUP_DIR}/uptime-kuma-${STAMP}.tar.gz"

install -d -m 700 "${BACKUP_DIR}"
cd "${STACK_DIR}"

container_id="$(docker compose -f compose.yml ps -q uptime-kuma)"
if [[ -z "${container_id}" ]]; then
  printf 'container do Uptime Kuma não está em execução\n' >&2
  exit 1
fi

cleanup() {
  docker exec "${container_id}" rm -f /app/data/.focuss-backup-kuma.db >/dev/null 2>&1 || true
  rm -f -- "${TMP_ARCHIVE}"
}
trap cleanup EXIT

docker exec "${container_id}" sqlite3 /app/data/kuma.db \
  ".backup '/app/data/.focuss-backup-kuma.db'"

docker run --rm \
  --volumes-from "${container_id}" \
  --volume "${BACKUP_DIR}:/backup" \
  --workdir /app/data \
  --entrypoint tar \
  docker.io/louislam/uptime-kuma:2.5.5 \
  --exclude=./kuma.db \
  --exclude=./kuma.db-wal \
  --exclude=./kuma.db-shm \
  --transform='s|^\./\.focuss-backup-kuma\.db$|./kuma.db|' \
  -czf "/backup/$(basename "${TMP_ARCHIVE}")" .

tar -tzf "${TMP_ARCHIVE}" > /dev/null
tar -tzf "${TMP_ARCHIVE}" | grep -qx './kuma.db'
docker run --rm \
  --volume "${BACKUP_DIR}:/backup:ro" \
  --entrypoint sh \
  docker.io/louislam/uptime-kuma:2.5.5 \
  -c "mkdir -p /tmp/restore && tar -xzf '/backup/$(basename "${TMP_ARCHIVE}")' -C /tmp/restore && test \"\$(sqlite3 /tmp/restore/kuma.db 'pragma integrity_check;')\" = ok"
chmod 600 "${TMP_ARCHIVE}"
mv -- "${TMP_ARCHIVE}" "${FINAL_ARCHIVE}"
sha256sum "${FINAL_ARCHIVE}" > "${FINAL_ARCHIVE}.sha256"
chmod 600 "${FINAL_ARCHIVE}.sha256"

find "${BACKUP_DIR}" -maxdepth 1 -type f \
  \( -name 'uptime-kuma-*.tar.gz' -o -name 'uptime-kuma-*.tar.gz.sha256' \) \
  -mtime +7 -delete

printf 'uptime-kuma backup validado: %s\n' "${FINAL_ARCHIVE}"
