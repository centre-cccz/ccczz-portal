# 🚀 Guide de Déploiement cPanel - CCCZ Portal

**Hébergement :** Webhosting Pro (cPanel)  
**IP :** 41.79.235.70  
**Domaine :** <www.ccclezoo.cd>  
**Répertoire :** /home/ccclezoo  
**Base de données :** ccclezoo_portail  
**Utilisateur DB :** ccclezoo_julio  
**Email :** <julio@ccclezoo.cd>

---

## ✅ Étape 1 : Vérifications préalables

### Via cPanel - Vérifier les prérequis

1. **Accédez à votre cPanel :**
   - URL : `https://41.79.235.70:2083` ou `https://www.ccclezoo.cd:2083`
   - Utilisateur : `ccclezoo` (ou votre username cPanel)
   - Mot de passe : [Votre mot de passe cPanel]

2. **Vérifiez Node.js :**
   - cPanel > **Setup Node.js App** (ou **Application Manager**)
   - Vérifiez que Node.js est disponible (v18+ requis)
   - Si absent, contact votre hébergeur

3. **Vérifiez la base de données :**
   - cPanel > **MySQL Databases**
   - Confirmez que `ccclezoo_portail` existe
   - Confirmez que `ccclezoo_julio` est associé avec tous les privilèges

---

## 🔧 Étape 2 : Préparer les accès SSH/FTP

### Option A : SSH (Recommandé)

1. **Activer SSH dans cPanel :**
   - cPanel > **SSH Access**
   - Cliquez sur "Manage SSH Keys"
   - Générez une nouvelle clé ou utilisez une existante

2. **Depuis votre PC, connectez-vous :**

```powershell
# Windows PowerShell - Installer SSH si nécessaire
ssh ccclezoo@41.79.235.70

# Ou avec mot de passe (déconseillé)
ssh ccclezoo@41.79.235.70 -p 22
```

### Option B : FTP

Si SSH n'est pas disponible, utilisez FTP :

```powershell
# Windows - Utilisez FileZilla ou WinSCP
# Host: 41.79.235.70
# User: ccclezoo
# Password: [votre mot de passe]
# Port: 21 (FTP) ou 22 (SFTP)
```

---

## 📦 Étape 3 : Upload et déploiement

### Via SSH (Avec Terminal PowerShell)

```powershell
# 1. Connectez-vous au serveur
ssh ccclezoo@41.79.235.70

# 2. Naviguez vers le répertoire
cd /home/ccclezoo
cd public_html  # La plupart des hébergeurs déploient ici

# 3. Clonez le projet depuis GitHub (si disponible)
git clone https://github.com/VOTRE_REPO/ccczz-portal.git .

# OU : Uploadez via FTP/SCP et décompressez

# 4. Naviguez vers le dossier du projet
cd /home/ccclezoo/public_html  # ou votre répertoire

# 5. Créez le fichier .env pour production
nano .env.local  # Ou utilisez votre éditeur

# 6. Collez ce contenu (adapter les passwords) :
```

**Contenu du `.env.local` sur serveur :**

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://www.ccclezoo.cd
NEXT_PUBLIC_BASE_URL=https://www.ccclezoo.cd
NEXT_TELEMETRY_DISABLED=1

DB_HOST=localhost
DB_PORT=3306
DB_NAME=ccclezoo_portail
DB_USER=ccclezoo_julio
DB_PASS=your_actual_db_password_here
DB_CHARSET=utf8mb4

JWT_SECRET=secure_random_key_here
SESSION_SECRET=secure_random_key_here
NEXTAUTH_SECRET=secure_random_key_here

NEXTAUTH_URL=https://www.ccclezoo.cd
```

---

## 🔨 Étape 4 : Installation et Build

### Via SSH Terminal

```powershell
# 1. Installez les dépendances (production only)
npm install --production

# 2. Build l'application
npm run build

# 3. Vérifiez que le build a réussi
ls -la .next/

# 4. Test du serveur (démarrage temporaire)
npm run start &
# Pressez Ctrl+C après vérification
```

---

## 🌐 Étape 5 : Configurer Node.js dans cPanel

### Via l'interface cPanel

1. **Accédez à cPanel** > **Setup Node.js App**

2. **Créez une nouvelle application :**
   - **App Name** : `ccclezoo-portal`
   - **Node.js Version** : `18.x` ou `20.x` (la plus récente supportée)
   - **Application Root** : `/home/ccclezoo/public_html`
   - **Application Startup File** : `npm start` ou `node_modules/.bin/next start`
   - **Application URL** : `www.ccclezoo.cd` (déjà configuré)

3. **Ajoutez les variables d'environnement** dans cPanel :
   - **PORT** : `3000` (cPanel gérera le mapping)
   - **NODE_ENV** : `production`

4. **Sauvegardez et attendez 30 secondes**

---

## 🔗 Étape 6 : Configurer le reverse proxy (NGINX/Apache)

cPanel redirige automatiquement les requêtes vers votre app Node.js sur le port 3000.

**Si l'app ne répond pas :**

1. **Redémarrez l'application cPanel :**
   - cPanel > Setup Node.js App > Redémarrer l'app

2. **Vérifiez les logs :**
   - cPanel > Terminal ou SSH > `tail -f logs/node_errors.log`

---

## 🔐 Étape 7 : SSL/HTTPS

1. **Activez AutoSSL dans cPanel :**
   - cPanel > **SSL/TLS Status**
   - Cliquez sur votre domaine
   - Autorenew : ✅ Activé

2. **Forcez HTTPS :**
   - `.htaccess` dans `/home/ccclezoo/public_html/` :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 🗄️ Étape 8 : Base de données MySQL

### Initialiser la base (si vide)

```powershell
# Via SSH, importer le schéma
ssh ccclezoo@41.79.235.70

# Connectez-vous à MySQL
mysql -u ccclezoo_julio -p ccclezoo_portail

# Depuis le terminal local
ssh ccclezoo@41.79.235.70 "mysql -u ccclezoo_julio -p ccclezoo_portail < /home/ccclezoo/public_html/db/schema_complete.sql"

# OU : Depuis cPanel
# - cPanel > phpMyAdmin
# - Sélectionnez `ccclezoo_portail`
# - Import > Choisissez `schema_complete.sql` > Exécutez
```

---

## 📋 Commandes SSH complètes (Copier-coller)

```powershell
# 1. Connexion
ssh ccclezoo@41.79.235.70

# 2. Navigation
cd /home/ccclezoo/public_html

# 3. Préparation
git clone <votre_repo> .  # Ou upload via FTP
npm install --production
npm run build

# 4. Vérification
curl http://localhost:3000

# 5. Démarrage
npm start
```

---

## ✅ Vérification finale

### Tester votre site

```
https://www.ccclezoo.cd          ← Page d'accueil
https://www.ccclezoo.cd/actualites
https://www.ccclezoo.cd/evenements
https://www.ccclezoo.cd/api/contact  (POST test)
```

### Vérifier les logs en cas d'erreur

```powershell
# Via SSH
tail -f /home/ccclezoo/public_html/logs/node_errors.log

# Ou via cPanel > Terminal
cat /home/ccclezoo/public_html/.pm2/logs/ccclezoo-portal-error.log
```

---

## 🐛 Dépannage courant

| Problème | Solution |
|----------|----------|
| **502 Bad Gateway** | Redémarrez l'app Node.js dans cPanel |
| **Port déjà utilisé** | Changez `PORT=3000` à un autre port libre |
| **BD non trouvée** | Vérifiez `DB_HOST`, `DB_USER`, `DB_PASS` dans `.env.local` |
| **Redis non disponible** | Commentez les variables `REDIS_*` (pas sur cPanel partagé) |

---

## 📞 Support et contacts

- **Hébergeur** : Votre fournisseur cPanel
- **Email** : <julio@ccclezoo.cd>
- **Domaine** : <www.ccclezoo.cd>
- **IP** : 41.79.235.70

---

**✨ Vous êtes prêt à déployer ! 🚀**
