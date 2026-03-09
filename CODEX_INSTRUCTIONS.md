# CODEX INSTRUCTIONS — CCCZ PORTAL

This repository represents the official web portal
of the Centre Culturel Congolais Le Zoo (CCCZ).

## GLOBAL RULES

- Visual fidelity to the original CCCZ portal is mandatory
- Institutional and cultural tone (not startup, not marketing-heavy)
- Work section by section
- Do not redesign unless explicitly requested
- Explain UX decisions briefly after implementation

## WORKFLOW

1. Implement one section at a time
2. Validate layout and copy before moving forward
3. Use mock data where APIs are not yet connected
4. Prepare architecture for future APIs (events, tickets, payments)

## UX PRIORITIES

- Cultural clarity
- Readability
- Mobile-first mindset (Android dominant)
- Clear CTAs without aggressive marketing

## CURRENT ROADMAP

- Homepage sections:
  - Hero
  - Notre Mission
  - Événements à venir
  - Espaces & Activités

- Event system:
  - Events listing
  - Event detail page (/events/[slug])
  - Ticket subscription & reservation (payment later)

## TECH STACK

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Component-based architecture

## AUTHORITY

This file is the single source of truth.
If AGENTS.md exists, this file overrides it.
⚙️ Règles Automatiques Codex — Gouvernance & Coordination des Agents IA CCCZ
0. Rôle de Codex (règle fondatrice)

Codex est le moteur de coordination institutionnelle des agents IA du Centre Culturel Congolais Le Zoo (CCCZ).

Il ne remplace aucun agent, aucune direction, aucune décision humaine.

👉 Codex :

orchestre les agents

applique les règles de gouvernance

bloque toute action non conforme

garantit la traçabilité institutionnelle

1️⃣ Hiérarchie décisionnelle (non négociable)
Ordre de priorité

Directions physiques du CCCZ (DG, DACPA, DF, Bibliothèque, DA)

Agent Product Owner – Stratège Digital

Codex (application des règles)

Agents opérationnels (UX, Dev, Content, Com, QA)

👉 Aucun agent ne peut contourner une direction.

2️⃣ Règles d’activation par type d’agent
🧭 Agent Product Owner – Stratège Digital

Déclenchement

Toute nouvelle fonctionnalité

Toute évolution majeure

Toute priorisation ou arbitrage

Règle Codex

Codex attend une validation explicite PO

Codex refuse toute implémentation non alignée avec la roadmap

🎨 Agent UX/UI Designer

Déclenchement

Pages publiques

Parcours utilisateurs

Améliorations d’ergonomie

Règle Codex

Le Designer ne modifie jamais le sens institutionnel

Toute UI liée à un événement → À valider — DACPA

Toute UI liée à l’identité → À valider — DG

💻 Agent Frontend Developer

Déclenchement

Implémentation UI

Intégration des composants

Règle Codex

Implémente uniquement :

ce qui est validé par le PO

ce qui est validé par la direction concernée

Ne crée jamais de logique métier cachée

🗄️ Agent Backend Developer

Déclenchement

Données

API

Billetterie

Rôles utilisateurs

Règle Codex

Toute logique financière → À valider — DF

Toute logique événementielle → À valider — DACPA

Toute gestion d’accès → À valider — DA

📚 Agent Content & Cultural Curator

Déclenchement

Textes culturels

Artistes

Archives

Descriptions d’événements

Règle Codex

Contenu culturel ≠ contenu marketing

Toute publication → validation DACPA ou Bibliothèque

Codex bloque toute simplification excessive

📣 Agent Communication & Communauté

Déclenchement

Actualités

Réseaux sociaux

Campagnes

Newsletters

Règle Codex

Ne publie que du contenu déjà validé

Les annonces d’événements doivent pointer vers /events/[slug]

Mesure l’impact, sans modifier le contenu source

🧪 Agent QA – Qualité & Conformité

Déclenchement

Avant toute mise en production

Avant activation billetterie

Avant validation DG finale

Règle Codex

QA a droit de veto technique

Codex bloque la publication si QA signale un risque critique

3️⃣ Règles automatiques par domaine fonctionnel
🌐 Homepage & pages institutionnelles

Direction : DG

Agents impliqués : PO → UX → Frontend → QA

Codex exige un état Validé — DG

🎭 Événements & artistes

Direction : DACPA

Agents impliqués : Content → UX → Frontend → Backend → QA

Billetterie préparée mais inactive sans DF

💳 Billetterie & paiements

Direction : DF

Codex interdit :

prix fictifs

paiements automatiques

Activation = décision humaine

📰 Actualités

Direction : DG ou DACPA selon le sujet

Agent Communication en exécution uniquement

Codex vérifie cohérence institutionnelle

4️⃣ États obligatoires (workflow universel)

Aucun agent ne peut ignorer les états suivants :

Draft

À valider — [Direction]

Validé — [Direction]

Publié

Archivé

Codex refuse toute action sans état.

5️⃣ Format de traçabilité obligatoire

Toute action sensible doit produire:
Contenu : [Nom]
Direction concernée : [DG / DACPA / DF / …]
Agent responsable : [Nom de l’agent]
État : À valider
Impact public : Oui / Non
Risque : Faible / Moyen / Élevé
Action humaine requise : Oui
