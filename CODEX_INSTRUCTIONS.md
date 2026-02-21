# Directives opérationnelles Codex — ccczz-portal (CCCZ)

## 1) Environnement de conception (modifiable)

- **Chemin** : `C:\Users\ESTHER\github\ccczz-portal`
- **Statut** : privé / développement.
- **Portée des modifications autorisées** :
  - `app/`
  - `components/`
  - `styles/`
  - `public/`
  - `docs/`
  - `scripts/`
  - `data/`
  - `package.json`
  - `next.config.js`
  - `README.md`

### Règles

- Créer / modifier / supprimer des fichiers uniquement dans cet environnement.
- Respecter systématiquement :
  - `CODEX_INSTRUCTIONS.md`
  - `docs/AGENTS_CCCZ.md`
  - la gouvernance CCCZ.

## 2) Environnement de publication (interdit en écriture)

- **Chemin** : `C:\Users\ESTHER\Documents\github\ccczz-portal`
- **Statut** : public / publication.

### Interdictions absolues

- Ne jamais modifier directement ce dossier.
- Ne pas y créer de fichiers.
- Ne pas y tester le code.

> Ce dossier doit être alimenté uniquement par un build validé.

## 3) Fichiers et données interdits au public

Toujours exclure de la version publique :

- `.env*`
- `docs/`
- `scripts/`
- `data/`
- `AGENTS_CCCZ.md`
- `CODEX_INSTRUCTIONS.md`
- `GOVERNANCE.md`

Aucun secret, aucune documentation interne, aucune instruction IA.

## 4) Préparation de la version publique (obligatoire)

### Étape 1 — Vérification

Confirmer :

- que tous les contenus sont en état **« Validé — Direction concernée »** ;
- qu'aucun fichier interdit n'est exposé ;
- que le build est stable.

### Étape 2 — Build

Commande à exécuter :

```bash
npm run build
```

Le résultat du build est la seule source autorisée pour la publication.

### Étape 3 — Contenu publiable

Identifier clairement :

- `.next/`
- `public/`
- les fichiers de configuration nécessaires à l'exécution.

## 5) Actions GitHub → cPanel (sans accès direct)

Codex n'a aucun accès direct à cPanel/FTP.

### Autorisé

- Proposer une structure de déploiement.
- Proposer un workflow GitHub Actions.
- Proposer une checklist de publication.
- Indiquer les fichiers à transférer.

### Interdit

- Déployer réellement.
- Manipuler des identifiants FTP.
- Générer ou demander des mots de passe.

## 6) Workflow recommandé

```text
develop / feature/*
        ↓
merge → main
        ↓
npm run build
        ↓
dossier public (Documents)
        ↓
FTP / cPanel (manuel ou CI)
```

Toujours travailler avant le build, jamais après.

## 7) Règle finale (non négociable)

Si une action dépasse le périmètre (publication réelle, paiement, accès serveur),
arrêter le flux et signaler exactement :

**« Action humaine requise »**
