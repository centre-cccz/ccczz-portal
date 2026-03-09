Déploiement sur cPanel — étapes essentielles

1) Créer la base de données et l'utilisateur
   - cPanel > MySQL Databases
   - Créer une base (ex: cpaneluser_ccclezoo_db)
   - Créer un utilisateur MySQL (ex: cpaneluser_ccclezoo_user)
   - Attribuer l'utilisateur à la base et donner tous les privilèges

2) Variables d'environnement
   - cPanel > Setup Node.js App (ou Application Manager): créer une app Node.js
   - Définir l'app root sur le dossier du projet (ex: /home/USER/ccczz-portal)
   - Définir Node.js version (>=18) et les variables d'environnement (DB_HOST, DB_USER, DB_PASS, DB_NAME)

3) Installer dépendances & build
   - Dans l'interface "Terminal" de cPanel ou via SSH : cd ~/path/to/ccczz-portal
   - npm install --production
   - npm run build
   - Redémarrer l'application depuis Setup Node.js App

4) Si votre hébergeur ne supporte pas Node.js
   - Utiliser `next export` pour générer un site statique (limité) ou déployer sur VPS/Platform-as-a-Service

5) Sécurité & SSL
   - Activer AutoSSL dans cPanel > SSL/TLS
   - Protéger .env (le garder hors du webroot ou restreindre l'accès)
   - Configurer un firewall, limiter accès SSH et activer 2FA si possible

6) Sauvegardes
   - Programmer dump MySQL régulier (mysqldump) et copie des assets (public/images)

7) Notes pour cPanel prefixes
   - cPanel préfixe DB/USER avec le nom du compte; ajustez .env en conséquence.
