# ============================================================================
# CCCZ Portal - Script de déploiement Windows PowerShell vers cPanel
# ============================================================================
# Utilisation: .\deploy-from-github.ps1
# Ce script va cloner depuis GitHub et déployer sur cPanel

param(
    [string]$CpanelHost = "41.79.235.70",
    [string]$CpanelUser = "ccclezoo",
    [string]$RemotePath = "/home/ccclezoo/public_html",
    [string]$GitRepo = "git@github.com:centre-cccz/ccczz-portal.git",
    [string]$GitBranch = "main"
)

$ErrorActionPreference = "Stop"

# Couleurs
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

function Write-Status {
    param([string]$Message, [string]$Type = "info")
    switch ($Type) {
        "success" { Write-Host "$Green✓ $Message$Reset" }
        "warning" { Write-Host "$Yellow⚠ $Message$Reset" }
        "error" { Write-Host "$Red✗ $Message$Reset" }
        default { Write-Host "$Message" }
    }
}

Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host "$Green  CCCZ Portal - Déploiement GitHub → cPanel$Reset"
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host ""

# ============================================================================
# Étape 1 : Cloner depuis GitHub localement
# ============================================================================

Write-Status "ÉTAPE 1 : Préparation depuis GitHub" "warning"

$localDir = ".\ccczz-portal-tmp"

if (Test-Path $localDir) {
    Write-Status "Suppression du répertoire temporaire..." "info"
    Remove-Item -Recurse -Force $localDir
}

Write-Status "Clonage depuis GitHub..." "info"
git clone -b $GitBranch $GitRepo $localDir

if ($LASTEXITCODE -ne 0) {
    Write-Status "Erreur lors du clonage GitHub" "error"
    exit 1
}

Write-Status "Clonage réussi" "success"
Write-Host ""

# ============================================================================
# Étape 2 : Préparation de la version locale
# ============================================================================

Write-Status "ÉTAPE 2 : Préparation de la version locale" "warning"

Push-Location $localDir

Write-Status "Installation des dépendances..." "info"
npm install --production

Write-Status "Build de l'application..." "info"
npm run build

if (-not (Test-Path ".next")) {
    Write-Status "Erreur : le dossier .next n'existe pas après le build" "error"
    Pop-Location
    exit 1
}

Write-Status "Préparation locale réussie" "success"

Pop-Location
Write-Host ""

# ============================================================================
# Étape 3 : Test de connexion SSH
# ============================================================================

Write-Status "ÉTAPE 3 : Vérification de la connexion SSH" "warning"

$sshTest = ssh -o "ConnectTimeout=5" "$CpanelUser@$CpanelHost" "pwd" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Status "Connexion SSH échouée !" "error"
    Write-Host "Assurez-vous que :"
    Write-Host "  - SSH est activé sur cPanel"
    Write-Host "  - Votre clé SSH est configurée"
    Write-Host "  - L'hôte $CpanelHost est accessible"
    exit 1
}

Write-Status "Connexion SSH vérifiée" "success"
Write-Host ""

# ============================================================================
# Étape 4 : Upload des fichiers
# ============================================================================

Write-Status "ÉTAPE 4 : Upload vers le serveur cPanel" "warning"

# Vérifier si scp est disponible
$scpAvailable = $null -ne (Get-Command scp -ErrorAction SilentlyContinue)

if ($scpAvailable) {
    Write-Status "Upload via SCP..." "info"
    
    # Upload du contenu
    scp -r "$localDir/.next" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp -r "$localDir/public" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp -r "$localDir/node_modules" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp "$localDir/package.json" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp "$localDir/package-lock.json" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp "$localDir/next.config.js" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp "$localDir/tsconfig.json" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    scp -r "$localDir/db" "${CpanelUser}@${CpanelHost}:${RemotePath}/"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Erreur lors de l'upload SCP" "error"
        exit 1
    }
    
    Write-Status "Upload réussi" "success"
}
else {
    Write-Status "SCP non disponible sur ce système" "warning"
    Write-Host ""
    Write-Host "Options alternatives :"
    Write-Host "  1. Utilisez WSL (Windows Subsystem for Linux): wsl scp ..."
    Write-Host "  2. Utilisez FileZilla (FTP/SFTP)"
    Write-Host "  3. Installez Git Bash qui inclut OpenSSH"
    Write-Host ""
    Write-Host "Répertoire à uploader :"
    Write-Host "  Local: $(Resolve-Path $localDir)"
    Write-Host "  Distant: ${RemotePath}"
}

Write-Host ""

# ============================================================================
# Étape 5 : Configuration distante
# ============================================================================

Write-Status "ÉTAPE 5 : Configuration du serveur distant" "warning"

$remoteScript = @"
cd $RemotePath

# Installer les dépendances de production
npm install --production

# Vérifier que .env.local existe
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local n'existe pas!"
  exit 1
fi

echo "Déploiement apprêté avec succès"
ls -la .next/
"@

Write-Status "Exécution des commandes distantes..." "info"
ssh "$CpanelUser@$CpanelHost" $remoteScript

Write-Status "Configuration serveur terminée" "success"

Write-Host ""

# ============================================================================
# Étape 6 : Nettoyage local
# ============================================================================

Write-Status "ÉTAPE 6 : Nettoyage local" "warning"

Remove-Item -Recurse -Force $localDir -ErrorAction SilentlyContinue

Write-Status "Fichiers temporaires supprimés" "success"

Write-Host ""

# ============================================================================
# Résumé final
# ============================================================================

Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host "  $Green✓ Déploiement GitHub → cPanel réussi !$Reset"
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host ""
Write-Host "Prochaines étapes :"
Write-Host ""
Write-Host "1. $Yellow Vérifier le .env.local sur le serveur$Reset"
Write-Host "   ssh $CpanelUser@$CpanelHost"
Write-Host "   nano $RemotePath/.env.local"
Write-Host "   (Mettez à jour les passwords réels)"
Write-Host ""
Write-Host "2. $Yellow Créer l'application Node.js dans cPanel$Reset"
Write-Host "   URL: https://$CpanelHost:2083 (cPanel)"
Write-Host "   Setup Node.js App > Créer une nouvelle app"
Write-Host "   - App Name: ccclezoo-portal"
Write-Host "   - Node.js Version: 18.x ou 20.x"
Write-Host "   - App Root: $RemotePath"
Write-Host "   - Startup File: npm start"
Write-Host ""
Write-Host "3. $Yellow Importer la base de données (première fois)$Reset"
Write-Host "   cPanel > phpMyAdmin"
Write-Host "   Base: ccclezoo_portail"
Write-Host "   Import > $RemotePath/db/schema_complete.sql"
Write-Host ""
Write-Host "4. $Yellow Tester le site$Reset"
Write-Host "   https://www.ccclezoo.cd"
Write-Host ""
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
