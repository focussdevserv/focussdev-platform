#!/usr/bin/env bash
# Run on the Docker host. No .env is read or sourced.
set -euo pipefail
umask 077

KIND=integration-service
BACKUP_ROOT="${FOCUSS_BACKUP_ROOT:-/var/backups/focussdev}"
CONTAINER=focuss-integration-service-postgres-1
PROJECT=focuss-integration-service
RETENTION_DAYS=7
PHASE=preflight
STAGE_DIR=""
FINAL_DIR=""
RETENTION_LIST=""

fail() { printf '%s backup failed: %s\n' "$KIND" "$1" >&2; exit 1; }
[[ $# -eq 0 ]] || fail 'no arguments are accepted'
for tool in docker flock install realpath mktemp date gzip sha256sum find stat grep mv rm chmod; do
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
identity="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}|{{index .Config.Labels "com.docker.compose.service"}}|{{.State.Running}}' "$CONTAINER" 2>>"$ERROR_LOG")"
[[ "$identity" == "$PROJECT|postgres|true" ]] || fail 'unexpected or stopped PostgreSQL container'
docker inspect --format 'container={{.Name}} image={{.Image}}{{println}}{{range .Mounts}}{{printf "%s\t%s\t%s\t%s\n" .Type .Name .Source .Destination}}{{end}}' "$CONTAINER" >"$STAGE_DIR/mounts.txt" 2>>"$ERROR_LOG"

PHASE=postgres-dump
docker exec "$CONTAINER" pg_dumpall --username=focuss_integrations --no-password --quote-all-identifiers 2>>"$ERROR_LOG" |
  gzip -c >"$STAGE_DIR/postgres-cluster.sql.gz"
PHASE=dump-integrity
gzip -t "$STAGE_DIR/postgres-cluster.sql.gz" 2>>"$ERROR_LOG"
gzip -dc "$STAGE_DIR/postgres-cluster.sql.gz" |
  grep -Fx -- '-- PostgreSQL database cluster dump complete' >/dev/null

PHASE=metadata
printf 'focussdev-backup-v1:%s\n' "$KIND" >"$STAGE_DIR/.backup-kind"
{
  printf 'kind=%s\nstarted_at_utc=%s\nfinished_at_utc=%s\n' "$KIND" "$STAMP" "$(date -u +%Y%m%dT%H%M%SZ)"
  printf 'postgres_container=%s\npostgres_project=%s\n' "$CONTAINER" "$PROJECT"
  printf 'format=pg_dumpall SQL compressed with gzip; includes global roles and role password hashes\n'
  printf 'consistency=logical snapshot per database; no cross-database snapshot\n'
  printf 'verification=gzip integrity, pg_dumpall completion marker and SHA-256; restore NOT tested\n'
  printf 'configuration=stack .env and manifests NOT copied; separate secure configuration recovery required\n'
  docker exec "$CONTAINER" pg_dumpall --version 2>>"$ERROR_LOG"
} >"$STAGE_DIR/metadata.txt"
{
  for path in /opt/focussdev/stacks/integration-service/.env /opt/focussdev/stacks/integration-service/compose.yml; do
    if [[ -f "$path" ]]; then state=present; else state=missing; fi
    printf '%s\t%s\tnot copied\n' "$path" "$state"
  done
} >"$STAGE_DIR/configuration-coverage.txt"

PHASE=publish
rm -f -- "$ERROR_LOG"
(
  cd "$STAGE_DIR"
  sha256sum .backup-kind postgres-cluster.sql.gz mounts.txt metadata.txt configuration-coverage.txt >SHA256SUMS
  sha256sum --check --status SHA256SUMS
)
find "$STAGE_DIR" -type f -exec chmod 600 {} +
[[ ! -e "$FINAL_DIR" && ! -L "$FINAL_DIR" ]] || fail 'backup destination already exists'
# All artifacts and checksums become visible together; stage is on the same filesystem.
mv -T -- "$STAGE_DIR" "$FINAL_DIR"
STAGE_DIR=""

PHASE=retention
# Only this script's marked, dated directories are eligible. Legacy backups are untouched.
RETENTION_LIST="$(mktemp "$BACKUP_DIR/.retention-XXXXXXXX")"
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -name "$KIND-*" -mtime "+$RETENTION_DAYS" -print0 >"$RETENTION_LIST"
while IFS= read -r -d '' old; do
  [[ "$old" != "$FINAL_DIR" && ! -L "$old" ]] || continue
  [[ "${old##*/}" =~ ^integration-service-[0-9]{8}T[0-9]{6}Z-[A-Za-z0-9]{8}$ ]] || continue
  [[ -f "$old/.backup-kind" && ! -L "$old/.backup-kind" && -f "$old/SHA256SUMS" ]] || continue
  IFS= read -r marker <"$old/.backup-kind" || continue
  [[ "$marker" == "focussdev-backup-v1:$KIND" ]] || continue
  rm -rf --one-file-system -- "$old"
done <"$RETENTION_LIST"
rm -f -- "$RETENTION_LIST"
RETENTION_LIST=""
printf '%s backup created (restore not tested): %s\n' "$KIND" "$FINAL_DIR"
