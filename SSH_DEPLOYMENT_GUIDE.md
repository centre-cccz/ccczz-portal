# ✅ Configuration SSH cPanel + Déploiement automatisé

**Informations de votre infrastructure :**

- 🔗 Repo GitHub: `git@github.com:centre-cccz/ccczz-portal.git`
- 🖥️ Serveur cPanel: `41.79.235.70`
- 👤 User: `ccclezoo`
- 📁 Répertoire: `/home/ccclezoo/public_html`
- 🔑 Clé SSH cPanel: **Déjà fournie**

---

## 🔑 **Étape 1 : Configurer SSH sur cPanel**

### 1.1 Accédez à cPanel et validez votre clé SSH

```
https://41.79.235.70:2083
User: ccclezoo
Password: [votre mot de passe cPanel]
```

### 1.2 Allez à **SSH Access** > **Manage SSH Keys**

1. Vérifiez que votre clé publique est enregistrée :

   ```
   ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC/CNweGbiJFqmEla6ivRrdAkWhQPX2AQ70N/7RgtdeDfGj0FHBJUjBqLu9i/w/PiOSUKghM7YBZZrVTzHGixoQxZ0vHtITbJqkTfjjHO9bFUO6ANrT/NJVVrESX/5br7YrmAkEUJyL4Hk2EqfYkS421GYBOhFfiKUJTHuY/oCi2c/sIvyriu1qkPZT0sQI7JXMTJvZ75EglVPxb4OWh4Zj8Pyzd7uac9a3aiz9byfTp0yxAT+zGUgAbqxggcpjV0qeAQpbRgVcCq1udHCwdhqum5uDDDf8wbfJaANIhFuF4pVYAyMkbR71fTfZESrAwmIxuwUhBn/Y2MKKsk4v8INL
   ```

2. Si elle n'existe pas, importez-la :
   - **Import Key** > Collez la clé publique ci-dessus

### 1.3 Configurer GitHub comme host connu

Depuis votre PC, enregistrez GitHub :

```powershell
# Windows PowerShell
ssh-keyscan -H github.com >> $env:USERPROFILE\.ssh\known_hosts

# Linux/Mac
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

---

## 📦 **Étape 2 : Préparation locale (Windows)**

### 2.1 Cloner le repo GitHub

```powershell
cd c:\Users\ESTHER\github
git clone git@github.com:centre-cccz/ccczz-portal.git
cd ccczz-portal
```

### 2.2 Exécuter le script de déploiement

```powershell
# De la racine du projet
.\deploy-from-github.ps1
```

**Ce script va :**

- ✅ Cloner depuis GitHub
- ✅ Installer les dépendances
- ✅ Builder l'app
- ✅ Uploader via SSH/SCP vers cPanel
- ✅ Préparer le serveur

---

## 🚀 **Étape 3 : Déploiement rapide avec SSH (RECOMMANDÉ)**

### Plus facile : Utiliser SSH directement

```powershell
# Test de connexion SSH
ssh ccclezoo@41.79.235.70

# Vous devriez être connecté sans mot de passe
# Si demande d'authentification, vérifier les clés SSH
```

### 3.1 Depuis le serveur cPanel via SSH

```bash
# Exécuter le script de déploiement distant
ssh ccclezoo@41.79.235.70 << 'EOF'
cd /home/ccclezoo/public_html
bash deploy-remote.sh
EOF
```

**OU directement sur le serveur :**

```bash
# Après connexion SSH
ssh ccclezoo@41.79.235.70

# Une fois connecté au serveur
cd /home/ccclezoo/public_html
bash deploy-remote.sh
```

---

## 🎯 **Étape 4 : Configuration finale dans cPanel**

### 4.1 Créer l'application Node.js

1. **cPanel > Setup Node.js App** (ou Application Manager)

2. **Créer une nouvelle application :**
   - **App Name:** `ccclezoo-portal`
   - **Node.js Version:** `18.x` ou `20.x` (la plus récente)
   - **Application Root:** `/home/ccclezoo/public_html`
   - **Application Startup File:** `npm start`
   - **Application URL:** `www.ccclezoo.cd`

3. **Ajouter les variables d'environnement :**

   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Sauvegarder et attendre 30 secondes**

---

## 🗄️ **Étape 5 : Initialiser la base de données**

### 5.1 Importer le schéma (première fois uniquement)

**Via cPanel phpMyAdmin :**

1. Accédez: `cPanel > phpMyAdmin`
2. Sélectionnez la base: `ccclezoo_portail`
3. Cliquez sur **Import**
4. Choisissez le fichier: `/home/ccclezoo/public_html/db/schema_complete.sql`
5. Cliquez **Exécuter**

**OU via SSH :**

```bash
ssh ccclezoo@41.79.235.70 << 'EOF'
mysql -u ccclezoo_julio -p ccclezoo_portail < /home/ccclezoo/public_html/db/schema_complete.sql
EOF
```

---

## ✅ **Vérification finale**

### Tester votre site

```
https://www.ccclezoo.cd           ← Accueil
https://www.ccclezoo.cd/actualites
https://www.ccclezoo.cd/evenements
https://www.ccclezoo.cd/api/contact
```

### Vérifier les logs

**Via SSH :**

```bash
ssh ccclezoo@41.79.235.70 "tail -f /home/ccclezoo/public_html/logs/node_errors.log"
```

**OU via cPanel > Terminal**

---

## 🔄 **Déploiements futurs (mise à jour rapide)**

### Déployer les mises à jour depuis GitHub

```powershell
# Depuis votre PC
ssh ccclezoo@41.79.235.70 << 'EOF'
cd /home/ccclezoo/public_html
git fetch origin
git pull origin main
npm install --production
npm run build
echo "Mise à jour complète !"
EOF
```

**OU créer un webhook GitHub pour déploiement automatique :**

```bash
# Sur le serveur, créer un script de déploiement simple
nano /home/ccclezoo/auto-deploy.sh
```

Contenu :

```bash
#!/bin/bash
cd /home/ccclezoo/public_html
git fetch origin
git pull origin main
npm install --production
npm run build
# Redémarrer l'app (voir cPanel)
```

---

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| **SSH : permission denied** | Vérifier que la clé publique est dans cPanel |
| **SCP non disponible** | Installer OpenSSH ou utiliser WSL sur Windows |
| **Node.js modules error** | Relancer `npm install --production` |
| **502 Bad Gateway** | Redémarrer l'app dans cPanel > Setup Node.js App |
| **Base de données vide** | Importer le schéma avec `deploy-remote.sh` ou phpMyAdmin |

---

## 📞 Contacts

- **Email support:** <julio@ccclezoo.cd>
- **Domaine:** <www.ccclezoo.cd>
- **Serveur:** 41.79.235.70

**✨ Vous êtes prêt à déployer automatiquement ! 🚀**
