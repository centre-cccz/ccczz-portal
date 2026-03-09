#!/usr/bin/env bash
set -euo pipefail

# backup.sh
# Dumps MySQL database (if configured) and archives public/images

ROOT=$(cd "$(dirname "$0")/.." && pwd)
BACKUP_DIR="$ROOT/backups"
mkdir -p "$BACKUP_DIR"

date=$(date +"%Y-%m-%d_%H%M%S")

# DB dump
if [ -n "${DB_HOST-}" ] && command -v mysqldump >/dev/null 2>&1; then
  if [ -z "${DB_NAME-}" ] || [ -z "${DB_USER-}" ]; then
    echo "[backup] DB env vars missing - skipping DB dump"
  else
    dumpfile="$BACKUP_DIR/ccclezoo_db_${date}.sql"
    echo "[backup] Dumping DB to $dumpfile"
    mysqldump -h "$DB_HOST" -P "${DB_PORT-3306}" -u "$DB_USER" -p"$DB_PASS" --single-transaction "$DB_NAME" > "$dumpfile" || echo "[backup] mysqldump failed"
  fi
else
  echo "[backup] No DB_HOST or mysqldump missing - skipping DB dump"
fi

# Archive images
if [ -d "$ROOT/public/images" ]; then
  imgarchive="$BACKUP_DIR/images_${date}.tar.gz"
  echo "[backup] Archiving images to $imgarchive"
  tar -czf "$imgarchive" -C "$ROOT/public" images || echo "[backup] image archive failed"
else
  echo "[backup] No public/images directory found - skipping image archive"
fi

# Rotate - keep last 30 backups
find "$BACKUP_DIR" -type f -mtime +30 -delete || true

echo "[backup] Done. Backups in $BACKUP_DIR"
