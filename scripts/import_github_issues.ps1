<#
import_github_issues.ps1

Usage:
  $env:GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'           # Personal Access Token with repo:issues scope
  $env:GITHUB_REPO  = 'ccclezoo/ccclezoo.cd'          # e.g. myorg/ccczz-portal
  .\import_github_issues.ps1

Behavior:
  - Scans .github\issues for .md files
  - Extracts Title:, Labels:, Assignees: (optional) from top of each file
  - Uses remaining content as issue body
  - Creates an issue via GitHub REST API and prints created issue URL

Notes:
  - If GITHUB_TOKEN or GITHUB_REPO are missing, the script runs in dry-run mode and prints payloads.
  - Files already created on GitHub are not detected/ignored by this script; run carefully to avoid duplicates.
#>

param(
  [switch]$DryRun
)

function Parse-IssueFile {
  param([string]$Path)
  $raw = Get-Content -Raw -Path $Path
  # Extract Title
  $title = ''
  if ($raw -match "(?m)^Title:\s*(.*)") { $title = $matches[1].Trim() }
  # Extract Labels
  $labels = @()
  if ($raw -match "(?m)^Labels:\s*(.*)") {
    $lbls = $matches[1].Trim()
    if ($lbls -ne '') { $labels = $lbls -split '[,;]+' | ForEach-Object { $_.Trim() } }
  }
  # Extract Assignees
  $assignees = @()
  if ($raw -match "(?m)^Assignees:\s*(.*)") {
    $ass = $matches[1].Trim()
    if ($ass -ne '') { $assignees = $ass -split '[,\s]+' | ForEach-Object { $_.Trim().TrimStart('@') } | Where-Object { $_ -ne '' } }
  }
  # Remove header lines (Title, Labels, Assignees, Estimate, Labels etc.) from body
  $body = ($raw -split "\r?\n") | Where-Object { $_ -notmatch '^(Title:|Description:|Critères d''acceptation:|Tâches:|Estimate:|Labels:|Assignees:|Dependencies:)' }
  $bodyText = $body -join "`n"
  return [PSCustomObject]@{ Path = $Path; Title = $title; Body = $bodyText; Labels = $labels; Assignees = $assignees }
}

# Locate issue files
$issueDir = Join-Path -Path (Get-Location) -ChildPath '.github\issues'
if (-not (Test-Path $issueDir)) { Write-Error "Issue directory not found: $issueDir"; exit 1 }
$files = Get-ChildItem -Path $issueDir -Filter '*.md' | Sort-Object Name
if ($files.Count -eq 0) { Write-Host "No issue files found in $issueDir"; exit 0 }

$token = $env:GITHUB_TOKEN
$repo  = $env:GITHUB_REPO
$headers = @{
  'Accept' = 'application/vnd.github+json'
}
if ($token) { $headers['Authorization'] = "token $token" }

foreach ($f in $files) {
  Write-Host "Processing: $($f.Name)"
  $item = Parse-IssueFile -Path $f.FullName
  if ([string]::IsNullOrWhiteSpace($item.Title)) {
    Write-Warning "Skipping $($f.Name): no Title found."
    continue
  }

  $payload = @{ title = $item.Title; body = $item.Body }
  if ($item.Labels.Count -gt 0) { $payload['labels'] = $item.Labels }
  if ($item.Assignees.Count -gt 0) { $payload['assignees'] = $item.Assignees }

  $json = $payload | ConvertTo-Json -Depth 5

  # If missing token or repo, do dry-run output
  if ($DryRun -or -not $token -or -not $repo) {
    Write-Host "---- DRY RUN payload for $($item.Title) ----"
    Write-Host $json
    Write-Host "---------------------------------------------`n"
    continue
  }

  # Check if an issue with a similar title already exists
  try {
    $q = [System.Uri]::EscapeDataString("repo:$repo type:issue in:title \"$($item.Title)\"")
    $searchUrl = "https://api.github.com/search/issues?q=$q"
    $searchResp = Invoke-RestMethod -Uri $searchUrl -Method Get -Headers $headers -ErrorAction Stop
    if ($searchResp.total_count -gt 0) {
      Write-Host "Skipping creation: $($searchResp.total_count) existing issue(s) found matching title:\n"
      foreach ($it in $searchResp.items) { Write-Host " - $($it.html_url) : $($it.title)" }
      continue
    }
  } catch {
    Write-Warning "Issue existence check failed for '$($item.Title)': $_\nProceeding to create issue to avoid blocking."
  }

  $url = "https://api.github.com/repos/$repo/issues"
  try {
    $resp = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $json -ContentType 'application/json'
    if ($resp.html_url) { Write-Host "Created: $($resp.html_url)" } else { Write-Host "Created issue response: $resp" }
  } catch {
    Write-Error "Failed to create issue for $($item.Title): $_"
  }
}

Write-Host "Done."