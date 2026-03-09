#!/usr/bin/env bash
set -euo pipefail

# init_cpanel.sh
# Script d'initialisation pour cPanel/serveur: crée la base, l'utilisateur MySQL, génère .env et lance l'installation
# Usage: run from project root on the server: sudo ./scripts/init_cpanel.sh

CPREFIX="" # set to your cPanel username prefix if needed, e.g. 'cpaneluser_'
DB_NAME="ccclezoo_db"
DB_USER="ccclezoo_user"
DB_PASS="ChangeMeStrongly!"

# Allow overriding via env or arguments
if [ -n "${1-}" ]; then DB_NAME="$1"; fi
if [ -n "${2-}" ]; then DB_USER="$2"; fi
if [ -n "${3-}" ]; then DB_PASS="$3"; fi

# Prompt for MySQL root credentials (required to create DB/user) if not provided via env
if [ -z "${MYSQL_ROOT_USER-}" ]; then
  read -p "MySQL admin user (e.g. root): " MYSQL_ROOT_USER
fi
if [ -z "${MYSQL_ROOT_PASS-}" ]; then
  read -s -p "MySQL admin password: " MYSQL_ROOT_PASS
  echo
fi

# If cPanel prefix is known, uncomment or set CPREFIX env var
if [ -n "${CPREFIX-}" ] && [ "${CPREFIX}" != "" ]; then
  FULL_DB_NAME="${CPREFIX}${DB_NAME}"
  FULL_DB_USER="${CPREFIX}${DB_USER}"
else
  FULL_DB_NAME="$DB_NAME"
  FULL_DB_USER="$DB_USER"
fi

SQL_COMMANDS="
CREATE DATABASE IF NOT EXISTS \`${FULL_DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${FULL_DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${FULL_DB_NAME}\`.* TO '${FULL_DB_USER}'@'localhost';
FLUSH PRIVILEGES;
"

echo "Running SQL to create database and user: ${FULL_DB_NAME} / ${FULL_DB_USER}"

# Execute SQL using mysql CLI
mysql -u"${MYSQL_ROOT_USER}" -p"${MYSQL_ROOT_PASS}" -e "$SQL_COMMANDS"

# Create contacts table if not exists
cat > /tmp/ccczz_init_table.sql <<'SQL'
USE `__DBNAME__`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL

# Replace placeholder with actual DB name
sed -i "s/__DBNAME__/${FULL_DB_NAME}/g" /tmp/ccczz_init_table.sql
mysql -u"${MYSQL_ROOT_USER}" -p"${MYSQL_ROOT_PASS}" < /tmp/ccczz_init_table.sql
rm /tmp/ccczz_init_table.sql

# Generate .env from .env.example
if [ -f .env.example ]; then
  cp .env.example .env
  sed -i "s/^DB_HOST=.*/DB_HOST=localhost/" .env
  sed -i "s/^DB_PORT=.*/DB_PORT=3306/" .env
  sed -i "s/^DB_NAME=.*/DB_NAME=${FULL_DB_NAME}/" .env
  sed -i "s/^DB_USER=.*/DB_USER=${FULL_DB_USER}/" .env
  sed -i "s/^DB_PASS=.*/DB_PASS=${DB_PASS}/" .env
  echo ".env file created/updated."
else
  echo "No .env.example found; please create .env manually."
fi

# Install dependencies and build (if Node available)
if command -v npm >/dev/null 2>&1; then
  echo "Installing dependencies..."
  npm ci --production || npm install --production
  if [ -f package.json ]; then
    echo "Building project..."
    npm run build || true
  fi
else
  echo "npm not found; skipping node install/build. Use cPanel "Setup Node.js App" to build if needed."
fi

echo "Initialization complete. Please configure your Node app in cPanel (Setup Node.js App) and set environment variables if required."
