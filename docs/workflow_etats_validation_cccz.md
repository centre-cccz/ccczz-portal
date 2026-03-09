# Workflow de validation avec états (Draft → Validé → Publié) – CCCZ

Ce document définit le **workflow officiel de gestion des états de validation** des contenus, fonctionnalités et décisions du projet numérique du **Centre Culturel Congolais Le Zoo (CCCZ)**.

Il garantit la **traçabilité**, la **responsabilité institutionnelle** et le **contrôle hiérarchique** avant toute publication.

---

## 🎯 Objectif du Workflow

- Éviter toute publication non autorisée
- Clarifier qui peut modifier, valider ou publier
- Assurer une traçabilité administrative
- Aligner le numérique avec les pratiques d’une institution publique

---

## 🔁 États Officiels

Chaque élément (contenu, page, donnée, fonctionnalité) suit obligatoirement les **états suivants** :

```
DRAFT → EN VALIDATION → VALIDÉ → PUBLIÉ
            ↑                ↓
        CORRECTION ← REFUSÉ
```

---

## 📝 Description des États

### 1️⃣ DRAFT (Brouillon)

**Description :**
- État initial de travail
- Contenu ou fonctionnalité en cours de création

**Qui peut agir :**
- Agents IA spécialisés
- Agent Manager IA

**Actions autorisées :**
- Créer
- Modifier
- Supprimer

**Interdiction :**
- Aucune diffusion publique

---

### 2️⃣ EN VALIDATION

**Description :**
- Élément soumis à une ou plusieurs directions compétentes

**Qui peut agir :**
- Agent Manager IA (soumission)
- Directions concernées (lecture uniquement)

**Actions autorisées :**
- Consultation
- Commentaires
- Demande de correction

---

### 3️⃣ VALIDÉ

**Description :**
- Élément approuvé officiellement par la direction compétente

**Qui peut agir :**
- Direction compétente
- Direction Générale (si requis)

**Actions autorisées :**
- Approbation formelle

**Restriction :**
- Toute modification renvoie automatiquement à l’état DRAFT

---

### 4️⃣ PUBLIÉ

**Description :**
- Élément visible publiquement ou actif en production

**Qui peut agir :**
- Agent Manager IA (exécution)
- DevOps (mise en ligne technique)

**Actions autorisées :**
- Consultation publique

**Interdiction :**
- Modification directe (retour DRAFT obligatoire)

---

### ❌ État REFUSÉ

**Description :**
- Élément rejeté avec justification

**Qui peut agir :**
- Direction compétente
- Direction Générale

**Conséquence :**
- Retour obligatoire à l’état DRAFT

---

## 🧩 Rôle de l’Agent Manager IA

L’Agent Manager IA est le **gardien des états**.

Il doit :
- Assigner l’état correct à chaque élément
- Identifier la ou les directions compétentes
- Bloquer toute publication non validée
- Conserver l’historique des décisions

---

## 🏛️ Matrice de Validation (exemples)

| Élément | Direction compétente | DG requise |
|------|---------------------|------------|
| Fiche artiste | DACPA | Non |
| Archive documentaire | Bibliothèque | Non |
| Page institutionnelle | DG | Oui |
| Données RH | DA | Oui |
| Partenariat | DG + DF | Oui |

---

## 🛡️ Règles Institutionnelles

- Toute validation doit être traçable (date, responsable)
- Les validations orales sont interdites
- Les contenus sensibles nécessitent la DG
- L’IA n’a aucun pouvoir de validation finale

---

## 📁 Emplacement Recommandé

```
docs/WORKFLOW_ETATS_VALIDATION_CCCZ.md
```

Ce document constitue la **référence officielle des états de validation** du projet numérique du **Centre Culturel Congolais Le Zoo (CCCZ)**.

