# PROJECT AUDIT — CCCZZ Portal

## 1) Analyse globale du projet

### Stack & structure
- Framework: Next.js (App Router actif via `app/`).
- UI: React + TailwindCSS.
- Data layer: `mysql2` avec pool custom (`lib/db.ts`).
- CI/CD: GitHub Actions présents, mais workflow de déploiement orienté cPanel remplacé par Vercel GitOps.

### package.json
- Scripts ajoutés/normalisés: `build`, `lint`, `test`, `deploy`, `db:migrate`.
- Observation: pas de vrai framework de tests unitaires actuellement; `test` est aligné sur lint en attendant une suite Jest/Vitest.

### next.config.js
- Optimisations ajoutées:
  - `poweredByHeader: false`
  - compression active
  - formats images AVIF/WebP
  - headers sécurité (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)

### Sécurité (audit rapide)
- ✅ Secrets sortis de la config VS Code et centralisés via variables d’environnement d’exemple.
- ✅ Valeurs de connexion DB par défaut durcies (`localhost`, pas d’hôte distant hardcodé).
- ✅ Ajout de `.env*` dans `.gitignore`.
- ⚠️ Ce dépôt contient beaucoup de fichiers historiques/docs ; un scan secret dédié (gitleaks/trufflehog) est recommandé en CI.

### Erreurs / risques potentiels
- Incompatibilité possible versions ESLint/Next selon setup local (à stabiliser via lockfile et versioning cohérent).
- Test runner non structuré (pas de couverture ni tests unitaires consolidés).
- Deux workflows CI/CD existaient avec stratégies différentes (risque de duplication).

---

## 2) Audit environnement VS Code (limitation conteneur)

Je ne peux pas lire directement les extensions installées sur ta machine Windows depuis ce conteneur.

### Commandes à exécuter localement (PowerShell)
```powershell
code --list-extensions
code --list-extensions --show-versions
```

### Configuration optimisée livrée dans le repo
- `.vscode/extensions.json` avec recommandations DevOps/Next.js/Supabase/MySQL.
- `.vscode/settings.json` nettoyé + format/lint auto-save.

---

## 3) Extensions recommandées

Recommandées et ajoutées dans `.vscode/extensions.json`:
- GitHub Copilot
- GitHub Copilot Chat
- GitLens
- Prisma
- MySQL (SQLTools + driver)
- Supabase
- Docker
- Prettier
- ESLint
- Thunder Client
- Vercel
- GitHub Actions

Unwanted (pour éviter conflits formatage):
- Code Runner
- Beautify

---

## 4) Configuration production

Fichiers ajoutés:
- `.env.example`
- `.env.production.example`

Couvrent:
- Next.js
- MySQL cPanel
- Supabase
- JWT/API keys
- Variables Vercel (usage CI uniquement)

---

## 5) CI/CD GitHub Actions (GitOps)

Workflow `.github/workflows/deploy.yml`:
1. Install dependencies (`npm ci`)
2. Lint (`npm run lint`)
3. Build Next.js (`npm run build`)
4. Test (`npm run test`)
5. Deploy Vercel (`vercel pull`, `vercel build`, `vercel deploy --prebuilt`)

Secrets GitHub requis:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 6) Configuration Vercel (cible)

À définir dans Vercel Project Settings:
- Build command: `npm run build`
- Install command: `npm ci`
- Output: Next.js standard
- Environment variables: toutes les variables `.env.production.example`
- Auto-deploy: activé sur push `main`
- Domain mapping: cPanel DNS -> Vercel (A/CNAME selon setup)

---

## 7) Hygiène secrets / gitignore

- `.gitignore` couvre désormais explicitement:
  - `.env*`
  - `node_modules`
  - `.next`

---

## 8) Optimisation SEO / performance / image

- Metadata de base ajoutée dans `app/layout.tsx` (title/description/OpenGraph).
- Images optimisées côté Next config (`avif`, `webp`).
- Headers de sécurité HTTP ajoutés.
- Recommandation future: remplacer `<img>` restants par `next/image` là où pertinent.

---

## 9) API routes (structure)

Routes existantes détectées sous `app/api/*` (contact, reports, artistes/submit, tickets, events).
Recommandations:
- Ajouter validation systématique input/output (zod ou équivalent).
- Ajouter rate limiting pour endpoints publics.
- Uniformiser réponses d’erreur (format JSON stable).

---

## 10) Plan d’amélioration priorisé

### Priorité haute
1. Activer secrets GitHub + Vercel.
2. Vérifier passage CI sur PR et main.
3. Ajouter vrai framework de tests (Vitest/Jest + RTL).

### Priorité moyenne
4. Ajouter scan sécurité (gitleaks) dans workflow.
5. Mettre en place Sentry/monitoring.
6. Introduire migrations DB automatisées et versionnées.

### Priorité basse
7. Optimiser Core Web Vitals page par page.
8. Durcir CSP (Content-Security-Policy) après inventaire scripts tiers.

