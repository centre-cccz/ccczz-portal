#!/usr/bin/env bash
set -euo pipefail

# ci_trigger.sh
# Triggers GitHub Actions workflow_dispatch or repository_dispatch for CI.
# Requires GITHUB_TOKEN and GITHUB_REPO (owner/repo) env vars.

if [ -z "${GITHUB_TOKEN-}" ] || [ -z "${GITHUB_REPO-}" ]; then
  echo "[ci] GITHUB_TOKEN or GITHUB_REPO not set. Set env vars or run with DryRun."
  exit 1
fi

workflowsApi="https://api.github.com/repos/${GITHUB_REPO}/actions/workflows"
workflow_file_name="ci-cd.yml"

echo "[ci] Looking for workflow $workflow_file_name"
wf_id=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "$workflowsApi" | jq -r ".workflows[] | select(.path==\".github/workflows/$workflow_file_name\") | .id")
if [ -z "$wf_id" ] || [ "$wf_id" == "null" ]; then
  echo "[ci] Workflow $workflow_file_name not found via API; attempting repository_dispatch fallback"
  curl -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" https://api.github.com/repos/${GITHUB_REPO}/dispatches -d '{"event_type":"manual-ci-trigger"}'
  echo "[ci] Repository dispatch sent."
  exit 0
fi

# Trigger workflow_dispatch
ref="${DEPLOY_BRANCH-main}"
apiUrl="https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${wf_id}/dispatches"

curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" $apiUrl -d "{\"ref\": \"$ref\"}" && echo "[ci] Workflow dispatch sent for ref $ref"
