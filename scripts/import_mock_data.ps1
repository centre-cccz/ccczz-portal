<#
import_mock_data.ps1
Creates mock JSON data in data\ directory for Windows/PowerShell.
Usage: Open PowerShell in project root and run: .\scripts\import_mock_data.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Resolve-Path "$PSScriptRoot\.." | Select-Object -ExpandProperty Path
$DataDir = Join-Path $Root 'data'
if (-not (Test-Path $DataDir)) { New-Item -ItemType Directory -Path $DataDir | Out-Null }

$artists = @'
[
  { "name": "Koumba Mbongo", "discipline": "Musique", "bio": "Compositeur et promoteur de musiques traditionnelles." },
  { "name": "Lola M", "discipline": "Danse", "bio": "Chorégraphe de projets communautaires." },
  { "name": "Jean-Pierre K.", "discipline": "Arts visuels", "bio": "Plasticien engagé dans la mémoire collective." }
]
'@

$projects = @'
[
  { "title": "Bibliothèque Numérique", "summary": "Archivage et accès libre aux ressources culturelles." },
  { "title": "Réhabilitation", "summary": "Rénovation des espaces publics du centre." },
  { "title": "Plateforme e-learning", "summary": "Formations en ligne pour jeunes artistes." }
]
'@

$events = @'
[
  { "title": "Festival Jeune Création", "date": "2026-05-12", "location": "Place des Arts" },
  { "title": "Atelier Numérique", "date": "2026-04-20", "location": "CCC Le Zoo" }
]
'@

$directions = @'
[
  { "name": "Direction générale", "role": "DG", "description": "Supervision et stratégie institutionnelle." },
  { "name": "Finances", "role": "Responsable Financier", "description": "Gestion comptable et budget." },
  { "name": "Administration", "role": "Administration", "description": "Ressources humaines et logistique." }
]
'@

Set-Content -Path (Join-Path $DataDir 'artists.json') -Value $artists -Encoding UTF8
Set-Content -Path (Join-Path $DataDir 'projects.json') -Value $projects -Encoding UTF8
Set-Content -Path (Join-Path $DataDir 'events.json') -Value $events -Encoding UTF8
Set-Content -Path (Join-Path $DataDir 'directions.json') -Value $directions -Encoding UTF8

Write-Host "[import] Mock JSON files written to $DataDir"

# Optional: attempt DB seed if mysql client is available and env vars set
if ($env:DB_HOST -and (Get-Command mysql -ErrorAction SilentlyContinue)) {
    if (-not $env:DB_NAME -or -not $env:DB_USER) {
        Write-Host "[import] DB env vars missing (DB_NAME/DB_USER) - skipping DB inserts"
    } else {
        Write-Host "[import] Attempting a simple DB insert (non-fatal on error)"
        try {
            $insertSql = "INSERT INTO contacts (name,email,message) VALUES ('Seed','seed@local','seeded via import script')"
            & mysql -h $env:DB_HOST -P ${env:DB_PORT:-3306} -u $env:DB_USER -p$env:DB_PASS $env:DB_NAME -e $insertSql
            Write-Host "[import] DB insert attempted"
        } catch {
            Write-Warning "[import] DB insert failed: $_"
        }
    }
} else {
    Write-Host "[import] MySQL client not found or DB_HOST not set - only JSON files created"
}

Write-Host "[import] Done"
