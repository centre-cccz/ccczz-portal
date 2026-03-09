# ============================================================================
# CCCZ Portal - Script de déploiement rapide cPanel
# ============================================================================
# Utilisation: .\deploy-cpanel.ps1
# Cela va préparer et uploader votre code sur ccclezoo.cd

param(
    [string]$Host = "41.79.235.70",
    [string]$User = "ccclezoo",
    [string]$RemotePath = "/home/ccclezoo/public_html",
    [string]$Action = "build"  # "build" ou "deploy"
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
Write-Host "$Green  CCCZ Portal - Déploiement cPanel$Reset"
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host ""

# ============================================================================
# Étape 1 : Préparation locale
# ============================================================================

Write-Status "ÉTAPE 1 : Préparation locale" "warning"
Write-Status "Installation des dépendances..." "info"

npm install --production
if ($LASTEXITCODE -ne 0) {
    Write-Status "Erreur lors de npm install" "error"
    exit 1
}
Write-Status "npm install terminé" "success"

Write-Status "Build de l'application..." "info"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Status "Erreur lors du build" "error"
    exit 1
}
Write-Status "Build terminé" "success"

Write-Host ""

# ============================================================================
# Étape 2 : Préparation des fichiers à uploader
# ============================================================================

Write-Status "ÉTAPE 2 : Préparation des fichiers de déploiement" "warning"

# Créer un dossier de déploiement
$deployDir = ".\deploy-tmp"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copier les fichiers nécessaires
$itemsToCopy = @(
    ".next",
    "public",
    "node_modules",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tsconfig.json",
    "db"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        Write-Status "Copie de $item..." "info"
        Copy-Item -Path $item -Destination "$deployDir\$item" -Recurse -Force
    }
}

Write-Status "Fichiers de déploiement prêts dans: $deployDir" "success"

Write-Host ""

# ============================================================================
# Étape 3 : Vérification de la connexion SSH
# ============================================================================

Write-Status "ÉTAPE 3 : Vérification de la connexion SSH" "warning"
Write-Status "Test de connexion à $Host..." "info"

ssh -o "ConnectTimeout=5" "$User@$Host" "echo 'SSH connection OK'" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Status "Connexion SSH échouée !" "error"
    Write-Host "Vérifiez que :"
    Write-Host "  - SSH est activé dans cPanel"
    Write-Host "  - Votre clé SSH est configurée"
    Write-Host "  - Votre adresse IP est autorisée"
    Write-Host ""
    Write-Host "Vous pouvez aussi utiliser FTP pour uploader manuellement."
    exit 1
}
Write-Status "Connexion SSH vérifiée" "success"

Write-Host ""

# ============================================================================
# Étape 4 : Upload et déploiement
# ============================================================================

Write-Status "ÉTAPE 4 : Upload vers le serveur" "warning"

# Utiliser SCP pour copier
$localPath = (Get-Item $deployDir).FullName
$remoteFull = "${User}@${Host}:${RemotePath}"

Write-Status "Upload de $localPath vers $remoteFull" "info"

# Note: Sur Windows, utiliser 'scp' avec git bash ou WSL
# Alternative: Utiliser SFTP ou FTP
# Pour Windows, on va utiliser PowerShell avec plink/pscp si disponible

# Vérifier si scp est disponible
$scpAvailable = $null -ne (Get-Command scp -ErrorAction SilentlyContinue)

if ($scpAvailable) {
    # Utiliser SCP (Windows 10+ avec OpenSSH)
    scp -r "$deployDir\*" "${User}@${Host}:${RemotePath}" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Erreur lors de l'upload SCP" "error"
        exit 1
    }
}
else {
    Write-Status "SCP non disponible. Vous devez uploader manuellement." "warning"
    Write-Host ""
    Write-Host "Options :"
    Write-Host "  1. Utilisez FileZilla (FTP/SFTP)"
    Write-Host "  2. Utilisez WinSCP"
    Write-Host "  3. Utilisez WSL (Windows Subsystem for Linux)"
    Write-Host ""
    Write-Host "Dossier local à uploader: $localPath"
    Write-Host "Destination distante: $RemotePath"
    Write-Host ""
    Read-Host "Appuyez sur Entrée une fois l'upload terminé"
}

Write-Status "Upload terminé" "success"

Write-Host ""

# ============================================================================
# Étape 5 : Installation distante et démarrage
# ============================================================================

Write-Status "ÉTAPE 5 : Configuration du serveur" "warning"

$sshCmd = @"
cd $RemotePath

# Afficher les ressources
pwd
ls -la

# Installer les dépendances de production
npm install --production

# Build sur le serveur (optionnel si déjà fait localement)
npm run build

echo 'Déploiement préparé !'
"@

Write-Status "Exécution des commandes distantes..." "info"
ssh "$User@$Host" $sshCmd

Write-Status "Configuration serveur terminée" "success"

Write-Host ""

# ============================================================================
# Étape 6 : Instructions finales
# ============================================================================

Write-Status "ÉTAPE 6 : Finalisation" "warning"

Write-Host ""
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host "  $Green✓ Déploiement préparé !$Reset"
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"
Write-Host ""
Write-Host "Prochaines étapes :"
Write-Host ""
Write-Host "1. $Yellow Connectez-vous à cPanel$Reset"
Write-Host "   URL: https://41.79.235.70:2083"
Write-Host "   User: ccclezoo"
Write-Host ""
Write-Host "2. $Yellow Allez à 'Setup Node.js App'$Reset"
Write-Host "   - Créez une nouvelle application"
Write-Host "   - App Name: ccclezoo-portal"
Write-Host "   - Node.js Version: 18.x ou 20.x"
Write-Host "   - Application Root: $RemotePath"
Write-Host "   - Startup File: npm start"
Write-Host ""
Write-Host "3. $Yellow Ajoutez les variables d'environnement$Reset"
Write-Host "   - PORT=3000"
Write-Host "   - NODE_ENV=production"
Write-Host "   - Les variables du .env.local"
Write-Host ""
Write-Host "4. $Yellow Testez votre site$Reset"
Write-Host "   https://www.ccclezoo.cd"
Write-Host ""
Write-Host "5. $Yellow Importez la base de données$Reset"
Write-Host "   cPanel > phpMyAdmin > Import > db/schema_complete.sql"
Write-Host ""
Write-Host "$Green════════════════════════════════════════════════════════════$Reset"

# Nettoyage
Write-Status "Nettoyage des fichiers temporaires..." "info"
Remove-Item -Recurse -Force $deployDir -ErrorAction SilentlyContinue

Write-Status "Prêt à déployer !" "success"
