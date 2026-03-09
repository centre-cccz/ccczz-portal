# Runbook opérationnel — CCC Le Zoo (CCCZZ Portal)

Version: 2026-01-13
Objectif: procédure pas‑à‑pas pour déploiement cPanel, initialisation base MySQL, backups, monitoring, rollback et checklist pré/post GO.

---

## 1. Vue d'ensemble
Ce runbook décrit toutes les opérations nécessaires pour déployer, administrer et restaurer l'application Next.js (ccczz-portal) sur un hébergement cPanel. Il est conçu pour être imprimé ou converti en PDF.

## 2. Pré‑requis
- Accès cPanel (File Manager, Terminal/SSH, Setup Node.js App).
- Accès phpMyAdmin ou accès MySQL CLI (root) pour créer DB si nécessaire.
- Accès au dépôt GitHub (pour configurer Actions & secrets).
- Fichiers du projet présents sous `/home/CPANEL_USER/ccczz-portal`.
- Node.js >= 18 disponible via Setup Node.js App.

## 3. Variables d'environnement recommandées
- DB_HOST (ex: localhost)
- DB_PORT (3306)
- DB_NAME (ex: cpanelprefix_ccclezoo_db)
- DB_USER (ex: cpanelprefix_ccclezoo_user)
- DB_PASS (mot de passe fort)
- NEXT_PUBLIC_BASE_URL (https://www.ccclezoo.cd)

Note: pour cPanel, les noms DB/USER sont souvent préfixés par le nom du compte cPanel.

## 4. Initialisation base de données (option 1 : via script)
1. Placez `scripts/init_cpanel.sh` dans le dossier du projet sur le serveur. Rendre exécutable :

   chmod +x scripts/init_cpanel.sh

2. Exécuter (depuis le dossier project root) :

   sudo ./scripts/init_cpanel.sh

   - Le script demande l'utilisateur admin MySQL (souvent `root`) et son mot de passe.
   - Il crée la base, l'utilisateur et la table `contacts`, et génère `.env` à partir de `.env.example`.

3. Vérifier la création : se connecter à phpMyAdmin ou :

   mysql -uROOT -p -e "SHOW DATABASES LIKE 'ccclezoo_db';" 

4. Si cPanel a des préfixes, adapter `FULL_DB_NAME` et `FULL_DB_USER` fournis par le script ou créez DB & USER manuellement via cPanel → MySQL Databases.

## 5. Initialisation base de données (option 2 : manuel via cPanel)
1. cPanel > MySQL Databases : créer la base `ccclezoo_db` (ou avec préfixe cPanel). 
2. Créer un utilisateur MySQL et attribuer-lui tous les privilèges.
3. Importer `db/init.sql` via phpMyAdmin (ou exécuter en CLI) pour créer la table `contacts`.

## 6. Installation dépendances & build (cPanel)
1. cPanel > Setup Node.js App :
   - Create Application
   - Node.js version: 18
   - Application mode: production
   - App root: `/home/CPANEL_USER/ccczz-portal`
   - Start file/command: `npm start` (ou `node server.js` si custom)
   - Ajouter variables d'environnement dans l'interface (DB_* etc.)
2. Ouvrir Terminal depuis cPanel ou SSH :

   cd ~/ccczz-portal
   npm ci
   npm run build

3. Depuis Setup Node.js App, redémarrer l'application.

## 7. API route /api/contact configuration
- Installer `mysql2` si insertion en base est souhaitée :

  npm install mysql2

- Le fichier `app/api/contact/route.ts` tente d'insérer en DB si DB_HOST est défini, sinon il enregistre dans `data/contacts.json`.
- Tester la route :

  curl -X POST "https://staging.example.com/api/contact" -H "Content-Type: application/json" -d '{"name":"Test","email":"t@x.com","message":"Hello"}'

- Vérifier insertion SQL :

  mysql -uDB_USER -pDB_PASS -DDB_NAME -e "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5;"

## 8. CI/CD GitHub Actions (configuration des secrets)
- Secrets à créer dans le repo GitHub: 
  - DEPLOY_METHOD (ssh|ftp)
  - SSH_HOST, SSH_USER, SSH_PORT, SSH_PRIVATE_KEY (si SSH)
  - FTP_HOST, FTP_USERNAME, FTP_PASSWORD (si FTP)
  - REMOTE_PATH (chemin cible sur le serveur)
- Pousser sur `main` déclenchera le workflow `.github/workflows/ci-cd.yml` qui construit et déploie.
- Pour cPanel FTP: définir REMOTE_PATH vers le répertoire de l'application (ex: `/home/CPANEL_USER/ccczz-portal`).

## 9. Déploiement (staging → production) étapes recommandées
1. Déployer d’abord en staging (configurer un sous‑domaine staging.ccclezoo.cd) et répéter la procédure ci‑dessus.
2. Valider tests fonctionnels sur staging (forms, upload, affichage média, API contact).
3. Backup production avant bascule.
4. Bascule DNS (changer A record ou mettre en prod la config du domain) et vérifier SSL.

## 10. Sauvegardes (cron examples)
- MySQL dump quotidien (crontab) :

  0 2 * * * mysqldump --single-transaction -uDB_USER -p'REPLACE_PASS' DB_NAME > /home/CPANEL_USER/backups/ccclezoo_db_$(date +\%F).sql

- Archive assets (public/images) quotidien :

  30 2 * * * tar -czf /home/CPANEL_USER/backups/images_$(date +\%F).tar.gz /home/CPANEL_USER/ccczz-portal/public/images

- Rotation (supprimer >30 jours) :

  0 3 * * * find /home/CPANEL_USER/backups -type f -mtime +30 -delete

- Recommandation : copier les backups vers un stockage externe (S3, FTP) via script rsync ou rclone.

## 11. Monitoring & alerting
- Uptime check: UptimeRobot every 5m on / (and /api/contact smoke test)
- Logs: activer cPanel Raw Access Logs et consulter Error/Access logs
- Optionnel: envoyer logs vers Papertrail/Loggly via syslog or forwarder

## 12. Sécurité & durcissement
- .env : toujours hors webroot et permissions 600 (chmod 600 .env).
- Activer AutoSSL et forcer HTTPS.
- Restreindre accès cPanel et activer 2FA.
- Mettre en place CSP et headers HSTS via .htaccess si possible.
- Limiter taille d'upload et vérifier mime-type côté serveur.

## 13. Rollback procedure (rapide)
1. Stopper l'application depuis Setup Node.js App.
2. Restaurer la dernière sauvegarde SQL :

   mysql -uDB_USER -pDB_PASS DB_NAME < /home/CPANEL_USER/backups/ccclezoo_db_YYYY-MM-DD.sql

3. Restorer assets si nécessaire depuis backup tar.gz.
4. Checkout du commit Git précédent localement et déployer (ou utiliser artifact précédemment stocké) :

   git checkout <previous-tag>
   npm ci
   npm run build
   Restart app via Setup Node.js App

5. Exécuter smoke tests (page d'accueil, formulaire contact, pages clés).

## 14. Tests post‑GO (smoke tests)
- Page d'accueil accessible via HTTPS
- /api/contact retourne 200 et insère en DB
- Upload d'images affiché correctement
- Liens partenaires et pages projets OK
- Lighthouse quick check: pas d'erreurs blocking

## 15. Checklist pré‑GO (cocher avant bascule DNS)
- [ ] .env correctement configuré
- [ ] DB créée et migrations exécutées (db/init.sql)
- [ ] API /api/contact testée avec insertion en DB
- [ ] SSL actif (AutoSSL) et HTTPS forcé
- [ ] Backup complet (DB + public/images)
- [ ] CI/CD configuré et testé (workflow run réussi)
- [ ] Monitoring Uptime en place
- [ ] Tests fonctionnels et accessibilité basique OK
- [ ] Plan de communication prêt

## 16. Contacts & responsabilités
- Responsable technique: NOM (email@example.com)
- Responsable contenu / éditorial: NOM (content@example.com)
- Support hébergement (cPanel): support@votre-hebergeur.example

(Remplacer les placeholders par les coordonnées réelles avant impression.)

## 17. Troubleshooting rapides
- `Application fails to start`: vérifier logs via cPanel > Error logs; vérifier Node version et `npm run build` success.
- `DB connection error`: vérifier DB_HOST/DB_USER/DB_PASS/DB_NAME et que l'utilisateur a les privilèges; tester via mysql CLI.
- `File permission issues`: vérifier owner (cpanel user) et permissions 644 (files) / 600 (.env).

## 18. Annexes utiles (commandes)
- Lister DB : mysql -uROOT -p -e "SHOW DATABASES;"
- Lister tables : mysql -uDB_USER -p -DDB_NAME -e "SHOW TABLES;"
- Voir latest logs (cPanel Terminal) : tail -n 200 /home/CPANEL_USER/xxx/error_log

---

Fichier généré pour impression. Pour convertir en PDF depuis le repo :
- Ouvrir `docs/runbook.md` dans VS Code et exporter en PDF via extension Markdown PDF; ou
- Utiliser pandoc : pandoc docs/runbook.md -o runbook.pdf

