#!/usr/bin/env bash
set -euo pipefail

# run_agents_tasks.sh
# High-level orchestration script to run agent-related automation tasks:
# - import mock data
# - install deps & build
# - run backups
# - trigger CI

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

echo "[agents] Starting agents tasks at $(date)"

# 1) Import mock data
if [ -x "$ROOT/scripts/import_mock_data.sh" ]; then
  echo "[agents] Importing mock data..."
  bash "$ROOT/scripts/import_mock_data.sh"
else
  echo "[agents] import_mock_data.sh not found or not executable"
fi

# 2) Install deps & build (if Node available)
if command -v npm >/dev/null 2>&1; then
  echo "[agents] Installing npm dependencies..."
  npm ci || npm install
  if npm run | grep -q build; then
    echo "[agents] Building project..."
    npm run build || true
  fi
else
  echo "[agents] npm not available - skipping install/build"
fi

# 3) Run backups
if [ -x "$ROOT/scripts/backup.sh" ]; then
  echo "[agents] Running backup..."
  bash "$ROOT/scripts/backup.sh"
else
  echo "[agents] backup.sh not found or not executable"
fi

# 4) Trigger CI workflow (optional)
if [ -x "$ROOT/scripts/ci_trigger.sh" ]; then
  echo "[agents] Triggering CI workflow..."
  bash "$ROOT/scripts/ci_trigger.sh" || echo "[agents] CI trigger failed"
else
  echo "[agents] ci_trigger.sh not found or not executable"
fi

echo "[agents] All tasks completed at $(date)"
