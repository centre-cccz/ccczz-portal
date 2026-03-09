# 📚 GUIDE DÉPLOIEMENT & UTILISATION — BASE DE DONNÉES CCCZ

**Document**: Guide Complet d'Implémentation  
**Version**: 1.0 — Février 2026  
**Audience**: Développeurs, DBA, Admin Système  

---

## 📋 TABLE DES MATIÈRES

1. [Installation Locale (Docker)](#installation-locale-docker)
2. [Déploiement cPanel](#déploiement-cpanel)
3. [Connexion & Exploration](#connexion--exploration)
4. [Migrations & Versioning](#migrations--versioning)
5. [Backup & Recovery](#backup--recovery)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## INSTALLATION LOCALE (DOCKER)

### Prérequis

- Docker & Docker Compose installés
- Node.js 18+
- Prisma CLI (`npm install -g prisma`)

### Étape 1: Démarrer MySQL en Docker

```bash
# Depuis la racine du projet
docker-compose up -d db

# Vérifier le conteneur
docker ps | grep mysql
docker logs [container_id]
```

### Étape 2: Créer la Base de Données

```bash
# Exécuter le schéma SQL
docker exec -i [container_id] mysql -u ccclezoo_user -p'ChangeMeStrongly!' ccclezoo_db < db/schema_complete.sql

# Vérifier la création
docker exec -i [container_id] mysql -u ccclezoo_user -p'ChangeMeStrongly!' ccclezoo_db -e "SHOW TABLES;"
```

### Étape 3: Configuration Prisma (Optionnel)

```bash
# Créer schema.prisma
npx prisma init --datasource-provider mysql

# Générer client Prisma
npx prisma generate

# Vérifier la connexion
npx prisma db push
```

### Étape 4: Démarrer l'Application

```bash
npm install --production
npm run build
npm start

# Accéder http://localhost:3000
```

---

## DÉPLOIEMENT cPANEL

### Prérequis cPanel

- Compte cPanel actif
- Accès MySQL via cPanel
- SSH enabled (optionnel mais recommandé)
- Node.js 18+ supporté par l'hébergeur

### Étape 1: Créer Base de Données cPanel

**Via Interface cPanel**:

1. Connectez-vous à cPanel
2. **MySQL Databases** → Créer nouvelle BD
   - Nom base: `ccclezoo_db` (cPanel ajoute préfixe automatique)
   - Nom utilisateur: `ccclezoo_user`
   - Password: Générer secure (ex: `P@ssw0rd!Secure2026#`)

3. **Assigner utilisateur à la base**:
   - Sélectionner l'utilisateur
   - Donner **ALL PRIVILEGES**
   - Ajouter

### Étape 2: Importer Schéma SQL

**Option A: Via phpMyAdmin**

1. Ouvrir cPanel → phpMyAdmin
2. Sélectionner la base `ccclezoo_db`
3. Onglet **Import**
4. Charger `db/schema_complete.sql`
5. Cliquer **Import**

**Option B: Via SSH**

```bash
ssh user@votre-cpanel-domain.com

# Télécharger le fichier (ou via SFTP)
cd ~/ccczz-portal/db

# Importer le schéma
mysql -h localhost -u cpaneluser_ccclezoo_user -p'votre_password' cpaneluser_ccclezoo_db < schema_complete.sql

# Vérifier
mysql -h localhost -u cpaneluser_ccclezoo_user -p'votre_password' cpaneluser_ccclezoo_db -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema=DATABASE();"
```

### Étape 3: Configurer Variables d'Environnement

Créer `.env.production` (hors racine web):

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://www.ccclezoo.cd/api
NEXT_PUBLIC_BASE_URL=https://www.ccclezoo.cd

# Database (ajuster avec préfixes cPanel réels)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_ccclezoo_db
DB_USER=cpaneluser_ccclezoo_user
DB_PASS=votre_password_securise
DB_CHARSET=utf8mb4

# Redis (si supporté)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT & Auth
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://ccclezoo.cd

# API
API_KEY=$(openssl rand -base64 32)
```

### Étape 4: Déployer Application Next.js

**Via cPanel Setup Node.js App**:

1. **File Manager** → Public HTML
2. Uploader le projet (ou clone git)
3. cPanel → **Setup Node.js App**
4. Créer nouvelle app:
   - **Application Root**: `/home/user/ccczz-portal`
   - **Application URL**: `https://ccclezoo.cd`
   - **Node.js Version**: v18.x ou 20.x
   - **Application mode**: Ajouter fichier `app.js`:

```javascript
// app.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

1. Cliquer **Create**
2. Redémarrer via interface cPanel

### Étape 5: Exécuter Migrations

```bash
# Via SSH
cd ~/ccczz-portal

# Build production
npm run build

# Exécuter migrations Prisma (si utilisé)
npx prisma db push

# Restart l'app
touch app.js
```

### Étape 6: SSL/TLS

1. cPanel → **SSL/TLS**
2. Activer **AutoSSL**
3. Vérifier HTTPS fonctionne

---

## CONNEXION & EXPLORATION

### Via MySQL CLI

```bash
# Connexion local
mysql -h localhost -u ccclezoo_user -p ccclezoo_db

# Connexion cPanel
mysql -h localhost -u cpaneluser_ccclezoo_user -p cpaneluser_ccclezoo_db

# Requêtes utiles
SHOW TABLES;
DESC users;
SELECT * FROM directions;
SELECT * FROM roles;
SELECT COUNT(*) FROM audit_history;
```

### Via phpMyAdmin

1. cPanel → phpMyAdmin
2. Sélectionner la base `ccclezoo_db`
3. Naviguer tables via interface graphique
4. Viewer/Exporter SQL

### Via VSCode Extension

#### Installation MySQL Extension

1. VSCode → Extensions
2. Installer **MySQL** (weijan.mysql-database-manager)
3. Cliquer DB icon (gauche)
4. **New Connection**:
   - **Host**: localhost (ou IP cPanel)
   - **Port**: 3306
   - **User**: ccclezoo_user
   - **Password**: votre_password
   - **Database**: ccclezoo_db

5. Cliquer **Connect**
6. Explorer tables/données directement

#### Visualiser Schéma

```bash
# Exporter le schéma en texte
mysqldump -u ccclezoo_user -p ccclezoo_db --no-data > schema_export.sql

# Générer diagramme (avec Prisma)
npx prisma studio
```

---

## MIGRATIONS & VERSIONING

### Avec Prisma (Recommandé)

#### Setup Initial

```bash
# Créer Prisma schema depuis DB existante
npx prisma db pull

# Générer client
npx prisma generate
```

#### Créer Migration

```bash
# Créer table users_extended
npx prisma migrate dev --name add_users_extended

# Vérifier migration
ls prisma/migrations/
cat prisma/migrations/[timestamp]_add_users_extended/migration.sql
```

#### Appliquer Migration Production

```bash
# Sur cPanel
ssh user@domain.com
cd ~/ccczz-portal

# Exécuter migrations
npx prisma migrate deploy

# Vérifier
npx prisma db push
```

### SQL Brut (Si pas Prisma)

#### Créer Script Migration

```sql
-- migrations/001_add_contacts_table.sql
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Versioning avec Git

```bash
# Tracker migrations dans Git
git add prisma/migrations/
git commit -m "feat: add contacts table"

# Tag release
git tag -a v1.0.0 -m "Database v1.0.0"
git push --tags
```

---

## BACKUP & RECOVERY

### Backup Manuel

```bash
# Backup simple
mysqldump -u ccclezoo_user -p ccclezoo_db > backup_2026-02-08.sql

# Backup compressé
mysqldump -u ccclezoo_user -p ccclezoo_db | gzip > backup_2026-02-08.sql.gz

# Backup avec structure + données
mysqldump -u ccclezoo_user -p --all-databases > full_backup.sql
```

### Backup Automatisé (cPanel)

1. cPanel → **Backup**
2. Configurer **Backup Configuration**
3. Sélectionner **Backup Databases**
4. Planifier quotidien
5. Vérifier **Backup Destination** (home dir ou remote S3)

### Script Backup Automatisé

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/home/user/backups"
DB_USER="ccclezoo_user"
DB_PASS="your_password"
DB_NAME="ccclezoo_db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup DB
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Archive public files
tar -czf $BACKUP_DIR/public_$DATE.tar.gz public/

# Cleanup old backups (garder 30 jours)
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Ajouter dans crontab:

```bash
# Backup quotidien à 02:00
0 2 * * * /home/user/ccczz-portal/scripts/backup.sh >> /var/log/ccczz_backup.log 2>&1
```

### Recovery

```bash
# Restore depuis backup
mysql -u ccclezoo_user -p ccclezoo_db < backup_2026-02-08.sql

# Restore depuis gzip
gunzip < backup_2026-02-08.sql.gz | mysql -u ccclezoo_user -p ccclezoo_db
```

---

## MONITORING & MAINTENANCE

### Tables Size & Performance

```sql
-- Voir taille tables
SELECT 
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'ccclezoo_db'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- Voir nombre lignes par table
SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'ccclezoo_db';

-- Analyser table lente
ANALYZE TABLE audit_history;
OPTIMIZE TABLE audit_history;
```

### Query Monitoring

```sql
-- Enable query log
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- Voir queries lentes
SELECT * FROM mysql.general_log LIMIT 100;

-- Disable (production)
SET GLOBAL general_log = 'OFF';
```

### User Activity Audit

```sql
-- Dernières modifications
SELECT * FROM audit_history 
ORDER BY created_at DESC 
LIMIT 50;

-- Activité par direction
SELECT direction_owner, COUNT(*) FROM events_internal GROUP BY direction_owner;

-- Revenue par direction
SELECT d.name, SUM(r.total_revenue) 
FROM revenue_reports r 
JOIN directions d ON r.direction_id = d.id 
GROUP BY r.direction_id;
```

### Backup Status

```bash
# Vérifier backups cPanel
ls -lh /home/user/backups/

# Check backup size
du -sh /home/user/backups/

# Restore test
mysqldump -u ccclezoo_user -p ccclezoo_db > /tmp/test_backup.sql
wc -l /tmp/test_backup.sql
```

---

## TROUBLESHOOTING

### Erreur: "Access Denied" à la base de données

```bash
# Vérifier credentials
mysql -h localhost -u ccclezoo_user -p -e "SELECT 1;"

# Réinitialiser password (root cPanel)
mysql -u root -p
ALTER USER 'ccclezoo_user'@'localhost' IDENTIFIED BY 'new_secure_password';
FLUSH PRIVILEGES;
EXIT;
```

### Erreur: "Disk space full"

```bash
# Voir espace
df -h

# Nettoyer backups
find /home/user/backups -mtime +30 -delete

# Compresser logs
gzip /var/log/mysql/*.log

# Archive audit_history anciens
DELETE FROM audit_history WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### Erreur: "Lock wait timeout"

```sql
-- Voir transactions bloquées
SHOW PROCESSLIST;

-- Killer processus
KILL [thread_id];

-- Vérifier locks
SHOW OPEN TABLES WHERE In_use > 0;
```

### Performance Lente

```sql
-- Ajouter indexes manquants
CREATE INDEX idx_audit_entity_date ON audit_history(entity_type, entity_id, created_at);
CREATE INDEX idx_transactions_status ON transactions(status, payment_date);

-- Analyser query
EXPLAIN SELECT * FROM events_internal WHERE direction_owner = 1 AND state = 'DRAFT';

-- Si extra = "Using filesort", ajouter index sur order by
```

### Migration échouée

```bash
# Voir migrations appliquées
npx prisma migrate status

# Resolver push conflict
npx prisma migrate resolve --rolled-back [migration_name]

# Re-run migration
npx prisma migrate deploy
```

---

## CHECKLIST AVANT PRODUCTION

- [ ] Backup automatisé planifié (quotidien)
- [ ] SSL/TLS activé (HTTPS)
- [ ] Firewall/IP whitelist configuré
- [ ] Passwords changés (users défault)
- [ ] Monitoring alerts setup (emails)
- [ ] Documentation API mise à jour
- [ ] Tests RBAC validés
- [ ] Permissions fichiers verrouillées (.env)
- [ ] Logs répertoire sécurisé
- [ ] Performance baselines établis

---

**Document approuvé par**: Agent Architecte Backend & Data CCCZ  
**Date**: Février 2026  
