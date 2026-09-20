#!/usr/bin/env bash
# Logical PostgreSQL dump plus best-effort ONLINE WAHA session/media copies.
# No .env is read, no container is stopped, and no backup is presented as a tested restore.
set -euo pipefail
umask 077

KIND=deskcommcrm
BACKUP_ROOT="${FOCUSS_BACKUP_ROOT:-/var/backups/focussdev}"
DB_CONTAINER=focussdev_supabase-db-1
WAHA_CONTAINER=focussdevcrm-waha-1
RETENTION_DAYS=7
PHASE=preflight
STAGE_DIR=""
FINAL_DIR=""
RETENTION_LIST=""

fail() { printf '%s backup failed: %s\n' "$KIND" "$1" >&2; exit 1; }
[[ $# -eq 0 ]] || fail 'no arguments are accepted'
for tool in docker flock install realpath mktemp date gzip tar sha256sum find stat grep mv rm chmod; do
  command -v "$tool" >/dev/null || fail "missing executable: $tool"
done
[[ "$BACKUP_ROOT" == /* && "$BACKUP_ROOT" != / ]] || fail 'invalid backup root'
[[ "$(realpath -m -- "$BACKUP_ROOT")" == "$BACKUP_ROOT" ]] || fail 'backup root must be canonical, without symlinks or trailing slash'
BACKUP_DIR="$BACKUP_ROOT/$KIND"
[[ ! -L "$BACKUP_DIR" ]] || fail 'backup directory is a symlink'
if [[ -e "$BACKUP_DIR" ]]; then
  [[ -d "$BACKUP_DIR" && "$(stat -c %u -- "$BACKUP_DIR")" == "$EUID" ]] || fail 'backup directory must belong to the current user'
fi
install -d -m 700 -- "$BACKUP_DIR"
[[ ! -L "$BACKUP_DIR/.backup.lock" ]] || fail 'lock is a symlink'
exec 9>>"$BACKUP_DIR/.backup.lock"
flock -n 9 || { printf '%s backup skipped: another run holds the lock\n' "$KIND" >&2; exit 75; }

cleanup() {
  local status=$?
  trap - EXIT
  if [[ -n "$STAGE_DIR" && "$STAGE_DIR" == "$BACKUP_DIR"/.stage-* && -d "$STAGE_DIR" && ! -L "$STAGE_DIR" ]]; then
    rm -rf --one-file-system -- "$STAGE_DIR"
  fi
  if [[ -n "$RETENTION_LIST" && "$RETENTION_LIST" == "$BACKUP_DIR"/.retention-* ]]; then
    rm -f -- "$RETENTION_LIST"
  fi
  exit "$status"
}
trap cleanup EXIT
trap 'printf "%s backup failed during %s; check whether a completed directory already exists\n" "$KIND" "$PHASE" >&2' ERR
trap 'exit 130' INT
trap 'exit 143' TERM
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
STAGE_DIR="$(mktemp -d "$BACKUP_DIR/.stage-XXXXXXXX")"
FINAL_DIR="$BACKUP_DIR/$KIND-$STAMP-${STAGE_DIR##*.stage-}"
ERROR_LOG="$STAGE_DIR/.errors.log"

PHASE=container-identity
identity="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}|{{index .Config.Labels "com.docker.compose.service"}}|{{.State.Running}}' "$DB_CONTAINER" 2>>"$ERROR_LOG")"
[[ "$identity" == 'focussdev_supabase|db|true' ]] || fail 'unexpected or stopped Supabase container'
identity="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}|{{index .Config.Labels "com.docker.compose.service"}}|{{.State.Running}}' "$WAHA_CONTAINER" 2>>"$ERROR_LOG")"
[[ "$identity" == 'focussdevcrm|waha|true' ]] || fail 'unexpected or stopped WAHA container'
for destination in /app/.sessions /app/.media; do
  if [[ "$destination" == /app/.sessions ]]; then expected=focussdevcrm_waha-data; else expected=focussdevcrm_waha-media; fi
  # Enumerate only mount identity; never inspect Config.Env or the full container JSON.
  actual="$(docker inspect --format "{{range .Mounts}}{{if eq .Destination \"$destination\"}}{{.Type}}|{{.Name}}{{end}}{{end}}" "$WAHA_CONTAINER" 2>>"$ERROR_LOG")"
  [[ "$actual" == "volume|$expected" ]] || fail 'WAHA mount identity differs from the verified deployment'
done
docker inspect --format 'container={{.Name}} image={{.Image}}{{println}}{{range .Mounts}}{{printf "%s\t%s\t%s\t%s\n" .Type .Name .Source .Destination}}{{end}}' "$DB_CONTAINER" "$WAHA_CONTAINER" >"$STAGE_DIR/mounts.txt" 2>>"$ERROR_LOG"

PHASE=postgres-dump
docker exec "$DB_CONTAINER" pg_dumpall --username=postgres --no-password --quote-all-identifiers 2>>"$ERROR_LOG" |
  gzip -c >"$STAGE_DIR/postgres-cluster.sql.gz"
PHASE=dump-integrity
gzip -t "$STAGE_DIR/postgres-cluster.sql.gz" 2>>"$ERROR_LOG"
gzip -dc "$STAGE_DIR/postgres-cluster.sql.gz" |
  grep -Fx -- '-- PostgreSQL database cluster dump complete' >/dev/null

PHASE=waha-sessions
docker exec "$WAHA_CONTAINER" tar -C /app/.sessions -czf - . >"$STAGE_DIR/waha-sessions.tar.gz" 2>>"$ERROR_LOG"
tar -tzf "$STAGE_DIR/waha-sessions.tar.gz" >/dev/null 2>>"$ERROR_LOG"
PHASE=waha-media
docker exec "$WAHA_CONTAINER" tar -C /app/.media -czf - . >"$STAGE_DIR/waha-media.tar.gz" 2>>"$ERROR_LOG"
tar -tzf "$STAGE_DIR/waha-media.tar.gz" >/dev/null 2>>"$ERROR_LOG"

PHASE=metadata
printf 'focussdev-backup-v1:%s\n' "$KIND" >"$STAGE_DIR/.backup-kind"
{
  printf 'kind=%s\nstarted_at_utc=%s\nfinished_at_utc=%s\n' "$KIND" "$STAMP" "$(date -u +%Y%m%dT%H%M%SZ)"
  printf 'postgres_container=%s\nwaha_container=%s\n' "$DB_CONTAINER" "$WAHA_CONTAINER"
  printf 'database=pg_dumpall; all databases and global roles, including password hashes\n'
  printf 'database_consistency=logical snapshot per database; no cross-database snapshot\n'
  printf 'waha_consistency=ONLINE BEST-EFFORT; live files may change; no atomic filesystem snapshot\n'
  printf 'cross_service_consistency=NOT guaranteed between PostgreSQL, WAHA sessions and media\n'
  printf 'verification=gzip/tar readability, dump completion marker and SHA-256; restore NOT tested\n'
  printf 'excluded=Supabase Storage object bytes, stack .env, manifests, encryption keys, custom Postgres configuration\n'
  printf 'recovery=not a complete disaster-recovery backup; see docs/backup-restore.md\n'
  docker exec "$DB_CONTAINER" pg_dumpall --version 2>>"$ERROR_LOG"
} >"$STAGE_DIR/metadata.txt"
{
  for path in /opt/focussdev/deskcommcrm/.env /opt/focussdev/deskcommcrm/docker-compose.prod.yml /opt/focussdev/deskcommcrm/docker-compose.traefik.yml /opt/focussdev/deskcommcrm/docker-compose.focussdev.yml; do
    if [[ -f "$path" ]]; then state=present; else state=missing; fi
    printf '%s\t%s\tnot copied\n' "$path" "$state"
  done
  printf 'Supabase .env/manifests\tlocation requires inventory\tnot copied\n'
  printf 'Supabase Storage object bytes\tmount requires inventory\tnot copied\n'
} >"$STAGE_DIR/configuration-coverage.txt"

PHASE=publish
rm -f -- "$ERROR_LOG"
(
  cd "$STAGE_DIR"
  sha256sum .backup-kind postgres-cluster.sql.gz waha-sessions.tar.gz waha-media.tar.gz mounts.txt metadata.txt configuration-coverage.txt >SHA256SUMS
  sha256sum --check --status SHA256SUMS
)
find "$STAGE_DIR" -type f -exec chmod 600 {} +
[[ ! -e "$FINAL_DIR" && ! -L "$FINAL_DIR" ]] || fail 'backup destination already exists'
mv -T -- "$STAGE_DIR" "$FINAL_DIR"
STAGE_DIR=""

PHASE=retention
RETENTION_LIST="$(mktemp "$BACKUP_DIR/.retention-XXXXXXXX")"
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -name "$KIND-*" -mtime "+$RETENTION_DAYS" -print0 >"$RETENTION_LIST"
while IFS= read -r -d '' old; do
  [[ "$old" != "$FINAL_DIR" && ! -L "$old" ]] || continue
  [[ "${old##*/}" =~ ^deskcommcrm-[0-9]{8}T[0-9]{6}Z-[A-Za-z0-9]{8}$ ]] || continue
  [[ -f "$old/.backup-kind" && ! -L "$old/.backup-kind" && -f "$old/SHA256SUMS" ]] || continue
  IFS= read -r marker <"$old/.backup-kind" || continue
  [[ "$marker" == "focussdev-backup-v1:$KIND" ]] || continue
  rm -rf --one-file-system -- "$old"
done <"$RETENTION_LIST"
rm -f -- "$RETENTION_LIST"
RETENTION_LIST=""
printf '%s ONLINE backup created (restore not tested): %s\n' "$KIND" "$FINAL_DIR"
