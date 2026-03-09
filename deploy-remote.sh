#!/bin/bash
# ============================================================================
# CCCZ Portal - Script de déploiement automatisé cPanel
# ============================================================================
# À exécuter sur le serveur cPanel via SSH
# Utilisation: bash deploy-remote.sh

set -e  # Arrêter si erreur

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# Configuration
# ============================================================================

REPO_URL="git@github.com:centre-cccz/ccczz-portal.git"
DEPLOY_DIR="/home/ccclezoo/public_html"
BRANCH="main"  # Ou 'master', remplacez selon votre branche par défaut

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  CCCZ Portal - Déploiement automatisé cPanel${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# Étape 1 : Vérification des prérequis
# ============================================================================

echo -e "${YELLOW}ÉTAPE 1 : Vérification des prérequis${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git : $(git --version)${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js : $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm : $(npm --version)${NC}"

echo ""

# ============================================================================
# Étape 2 : Clonage ou mise à jour du repo
# ============================================================================

echo -e "${YELLOW}ÉTAPE 2 : Synchronisation du dépôt Git${NC}"

if [ -d "$DEPLOY_DIR/.git" ]; then
    echo -e "${GREEN}✓ Repo existant, mise à jour...${NC}"
    cd "$DEPLOY_DIR"
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    echo -e "${GREEN}✓ Clonage du repo...${NC}"
    cd /home/ccclezoo
    git clone -b $BRANCH "$REPO_URL" temp_deploy
    mv temp_deploy/.git "$DEPLOY_DIR/"
    cd "$DEPLOY_DIR"
    git reset --hard HEAD
fi

echo -e "${GREEN}✓ Repo synchronisé sur la branche: $BRANCH${NC}"
echo -e "${GREEN}✓ Commit actuel: $(git rev-parse --short HEAD)${NC}"

echo ""

# ============================================================================
# Étape 3 : Préparation du fichier .env
# ============================================================================

echo -e "${YELLOW}ÉTAPE 3 : Vérification du fichier .env${NC}"

if [ ! -f "$DEPLOY_DIR/.env.local" ]; then
    echo -e "${YELLOW}⚠ Création du .env.local${NC}"
    cat > "$DEPLOY_DIR/.env.local" << 'EOF'
# ============================================================================
# CCCZ Portal - Environment Variables (PRODUCTION - cPanel)
# ============================================================================

NODE_ENV=production
NEXT_PUBLIC_API_URL=https://www.ccclezoo.cd
NEXT_PUBLIC_BASE_URL=https://www.ccclezoo.cd
NEXT_TELEMETRY_DISABLED=1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ccclezoo_portail
DB_USER=ccclezoo_julio
DB_PASS=CHANGE_ME_WITH_ACTUAL_PASSWORD
DB_CHARSET=utf8mb4

# Security
JWT_SECRET=CHANGE_ME_GENERATE_SECURE_KEY
SESSION_SECRET=CHANGE_ME_GENERATE_SECURE_KEY
NEXTAUTH_SECRET=CHANGE_ME_GENERATE_SECURE_KEY

# Auth
NEXTAUTH_URL=https://www.ccclezoo.cd

# API
API_KEY=CHANGE_ME_GENERATE_SECURE_KEY
EOF
    echo -e "${YELLOW}⚠ Veuillez éditer .env.local avec les vrais credentials${NC}"
    echo -e "${YELLOW}  Commande: nano $DEPLOY_DIR/.env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local déjà configuré${NC}"
fi

echo ""

# ============================================================================
# Étape 4 : Installation des dépendances
# ============================================================================

echo -e "${YELLOW}ÉTAPE 4 : Installation des dépendances${NC}"

cd "$DEPLOY_DIR"
npm install --production --verbose

echo -e "${GREEN}✓ Dépendances installées${NC}"

echo ""

# ============================================================================
# Étape 5 : Build
# ============================================================================

echo -e "${YELLOW}ÉTAPE 5 : Build de l'application${NC}"

npm run build

if [ ! -d "$DEPLOY_DIR/.next" ]; then
    echo -e "${RED}✗ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build réussi${NC}"

echo ""

# ============================================================================
# Étape 6 : Définir les permissions
# ============================================================================

echo -e "${YELLOW}ÉTAPE 6 : Permissions des fichiers${NC}"

find "$DEPLOY_DIR" -type f -name "*.js" -o -name "*.json" -o -name "*.ts" | xargs chmod 644
find "$DEPLOY_DIR" -type d | xargs chmod 755
chmod +x "$DEPLOY_DIR/node_modules/.bin"/*

echo -e "${GREEN}✓ Permissions définies${NC}"

echo ""

# ============================================================================
# Étape 7 : Informations finales
# ============================================================================

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Déploiement réussi !${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Prochaines étapes :"
echo ""
echo "1. (Si premier déploiement) Éditer .env.local avec les vrais credentials :"
echo "   nano $DEPLOY_DIR/.env.local"
echo ""
echo "2. Créer l'application Node.js dans cPanel :"
echo "   - cPanel > Setup Node.js App"
echo "   - App Name: ccclezoo-portal"
echo "   - Node.js Version: 18.x ou 20.x"
echo "   - Application Root: $DEPLOY_DIR"
echo "   - Startup File: npm start"
echo ""
echo "3. Importer la base de données (première fois) :"
echo "   cPanel > phpMyAdmin > Import > db/schema_complete.sql"
echo ""
echo "4. Redémarrer l'app cPanel"
echo ""
echo "5. Tester le site :"
echo "   https://www.ccclezoo.cd"
echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
