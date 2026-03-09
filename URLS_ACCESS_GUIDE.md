# 🌐 Guide d'accès — URLs et connexions du portail CCCZ

**Créé:** Février 8, 2026  
**État:** Configuration pour développement local et Docker

---

## 📋 Résumé rapide

| Service | URL | État | Environnement |
|---------|-----|------|---------------|
| **Portail Web** | `http://localhost:3000` | Brouillons actifs | Next.js dev |
| **PhpMyAdmin** | `http://localhost:8081` | Gestion DB | Docker |
| **MySQL** | `localhost:3306` | Données | Docker |
| **Redis Cache** | `localhost:6379` | Cache | Docker |

---

## 🚀 Démarrage - Étapes essentielles

### 1️⃣ Lancer Docker (Base de données + Cache)

**Sur PowerShell / Terminal:**

```powershell
# Naviguez vers le dossier projet
cd c:\Users\ESTHER\github\ccczz-portal

# Démarrez les services Docker (MySQL + Redis + PhpMyAdmin)
docker-compose up -d
```

**Vérification du statut:**

```powershell
docker-compose ps
```

**Attendez 30 secondes** que les conteneurs soient en bonne santé.

---

### 2️⃣ Installer les dépendances Node.js

```powershell
npm install
```

---

### 3️⃣ Créer un fichier `.env.local`

À la racine du projet (`c:\Users\ESTHER\github\ccczz-portal\.env.local`):

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ccclezoo_portail
DB_USER=ccclezoo_julio
DB_PASS=user_secure_pwd_change_me

# JWT Secret (développement uniquement)
JWT_SECRET=dev_secret_key_change_in_production

# Environnement
NODE_ENV=development
```

---

### 4️⃣ Démarrer le serveur Next.js

```powershell
npm run dev
```

**Output attendu:**

```
> next dev

  ▲ Next.js 13.4.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2s
```

---

## 🌐 Pages et URLs accessibles

### **Pages publiques**

| Page | URL | Statut |
|------|-----|--------|
| Accueil | `http://localhost:3000` | Existe |
| Actualités | `http://localhost:3000/actualites` | ✅ BROUILLON |
| Événements (listing) | `http://localhost:3000/evenements` | ✅ BROUILLON |
| Détail événement (exemple) | `http://localhost:3000/evenements/festival-des-arts-2026` | ✅ BROUILLON |
| Billetterie | `http://localhost:3000/billetterie` | ✅ BROUILLON |
| Contact | `http://localhost:3000/contact` | Existe |
| À propos | `http://localhost:3000/about` | Existe |
| FAQ | `http://localhost:3000/faq` | Existe |
| Galerie | `http://localhost:3000/galerie` | Existe |

---

### **Pages Administrateur (requiert authentification)**

| Page | URL | Statut | Rôle requis |
|------|-----|--------|------------|
| Dashboard | `http://localhost:3000/admin/dashboard` | ✅ BROUILLON | `ROLE_ADMIN`, `ROLE_DG` |
| Connexion | `http://localhost:3000/admin/login` | Existe | Public |
| Partenaires | `http://localhost:3000/admin/partners` | Existe | `ROLE_ADMIN` |
| Soumissions | `http://localhost:3000/admin/submissions` | Existe | `ROLE_ADMIN` |
| Contacts | `http://localhost:3000/admin/contacts` | Existe | `ROLE_ADMIN` |

---

### **API Endpoints (requiert header JWT ou authentification)**

| Endpoint | Méthode | Accès | Détails |
|----------|---------|-------|---------|
| `/api/contact` | `POST` | Public | Soumission formulaire contact |
| `/api/events` | `GET` / `POST` | Authentifié | Événements (création admin) |
| `/api/tickets` | `GET` / `POST` | Authentifié | Billetterie |
| `/api/reports` | `GET` | Authentifié | Rapports (avec validation direction) |

**Example: Appel API avec authentification (PowerShell):**

```powershell
$headers = @{
  "Authorization" = "Bearer <YOUR_JWT_TOKEN>"
  "Content-Type" = "application/json"
}

$body = @{
  name = "Test"
  email = "test@example.com"
  message = "Message test"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

---

## 🗄️ Base de données — Accès PhpMyAdmin

### **URL PhpMyAdmin:**

```
http://localhost:8081
```

### **Identifiants:**

- **Utilisateur:** `ccclezoo_user`
- **Mot de passe:** `user_secure_pwd_change_me`
- **Base:** `ccclezoo_db`

### **Détails de connexion MySQL directe:**

- **Host:** `localhost`
- **Port:** `3306`
- **User:** `ccclezoo_user`
- **Password:** `user_secure_pwd_change_me`
- **Database:** `ccclezoo_db`

### **Connexion directe (PowerShell):**

```powershell
# Exemple avec mysql CLI (si installé localement)
mysql -h localhost -u ccclezoo_user -p -D ccclezoo_db
# Tapez le mot de passe: user_secure_pwd_change_me

# Requête de test
SELECT * FROM users LIMIT 5;
```

---

## 📊 Redis Cache

- **Host:** `localhost`
- **Port:** `6379`
- **Accès:** Redis CLI ou tableau de bord (en production)

**Test de connexion (PowerShell):**

```powershell
redis-cli -h localhost -p 6379 ping
# Retour attendu: PONG
```

---

## 🔐 Authentification & JWT

### **Pour accéder aux pages admin ou endpoints protégés:**

1. **Accédez à:** `http://localhost:3000/admin/login`
2. **Entrez les credentials** (définis en base de données)
3. **Recevez un JWT Bearer Token**
4. **Incluez dans le header** de vos requêtes:

   ```
   Authorization: Bearer <YOUR_TOKEN>
   ```

### **Développement — Bypass temporaire:**

En `NODE_ENV=development`, l'application accepte le header personnalisé:

```
X-Dev-User-Role: ROLE_DG
X-Dev-User-Id: dev-user-123
```

⚠️ **JAMAIS en production** — Voir `lib/withAuth.ts`

---

## 📝 Fichiers de contenu (sources des brouillons)

Les brouillons utilisent des fichiers JSON statiques:

| Fichier | Chemin | Utilité |
|---------|--------|---------|
| Actualités | `content/actualites.json` | Données brouillon news |
| Événements | `content/evenements.json` | Données brouillon événements |
| Billetterie | `content/billetterie.json` | Configuration tarifs |

---

## 🛑 Arrêter les services

### **Arrêter Next.js (Ctrl+C dans le terminal)**

### **Arrêter Docker:**

```powershell
docker-compose down
```

### **Arrêter et supprimer tous les volumes:**

```powershell
docker-compose down -v
```

---

## 📋 Checklist de démarrage complet

- [ ] Docker installé et en cours d'exécution
- [ ] Dossier projet cloné: `c:\Users\ESTHER\github\ccczz-portal`
- [ ] `docker-compose up -d` exécuté
- [ ] `npm install` exécuté
- [ ] `.env.local` créé avec les variables
- [ ] `npm run dev` en cours d'exécution
- [ ] **Ouvrir navigateur:** `http://localhost:3000`

---

## 🆘 Dépannage

### **Le portail ne démarre pas?**

```powershell
# Vérifiez les erreurs
npm run dev

# Nettoyez le cache Next.js
rm -r .next
npm run dev
```

### **PhpMyAdmin ne répond pas?**

```powershell
# Vérifiez l'état des conteneurs
docker-compose ps

# Relancez les services
docker-compose restart
```

### **Erreur de connexion DB?**

```powershell
# Vérifiez les variables .env.local
# Ensuite testez la connexion:
docker-compose exec db mysql -u ccclezoo_user -p -e "SELECT 1;"
```

---

## 📞 Support

Pour toute question, consultez:

- `docs/CODEX_INSTRUCTIONS.md` — Règles gouvernance
- `docs/DESIGN_SYSTEM.md` — Système de design
- `README.md` — Documentation générale

---

**Mise à jour:** Février 8, 2026  
**Préparé par:** Agent Éditeur & Générateur de Contenus Web
