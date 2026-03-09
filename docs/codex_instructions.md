# Instructions Codex – Reproduction du Portail CCCZ

## Contexte
Ce document sert d’instructions **officielles** à utiliser dans VS Code avec Codex pour reproduire la page d’accueil du **Centre Culturel Congolais Le Zoo (CCCZ)** de manière fidèle, productive et scalable.

Le site est un **portail institutionnel culturel**, avec une forte identité africaine, patrimoniale et communautaire.

---

## Rôle de Codex

Agir comme :
- Senior Frontend Engineer
- UI Architect spécialisé en portails culturels institutionnels

Objectif principal :
> Reproduire fidèlement le design observé du portail CCCZ tout en améliorant la qualité du code, la maintenabilité et l’expérience utilisateur.

---

## Stack technique imposée

- React / Next.js
- Tailwind CSS
- Composants réutilisables
- Responsive (desktop / tablette / mobile)

---

## Contraintes globales

- Fidélité visuelle prioritaire
- Respect strict de la hiérarchie visuelle
- Code clair, modulaire et commenté
- UX institutionnelle (sobre, élégante, culturelle)
- Pas de génération massive : travailler **section par section**

---

## Identité visuelle observée

- Palette dominante :
  - Vert foncé institutionnel
  - Brun / terre africaine
  - Beige clair / fond neutre

- Typographie :
  - Titres élégants (serif ou équivalent)
  - Textes lisibles, bien espacés

- UI :
  - Cartes avec coins légèrement arrondis
  - Ombres douces
  - Boutons clairs avec hiérarchie visuelle nette

---

## Structure globale de la page d’accueil

1. Header / Navigation
2. Hero Section immersive
3. Promotion de la culture congolaise
4. Événements à venir
5. Espaces et événements
6. Communauté
7. Footer institutionnel

---

## Instructions par section

### 1. Header / Navbar

- Logo à gauche (icône + nom du centre)
- Menu horizontal :
  - Accueil
  - Événements
  - Artistes
  - Galerie
  - Partenaires
  - Contact
- Bouton CTA à droite : **Devenir Partenaire**
- Header sticky avec ombre légère

---

### 2. Hero Section

- Section plein écran
- Image de fond culturelle (danse traditionnelle)
- Overlay sombre/brun pour lisibilité
- Texte aligné à gauche :
  - Petit texte : "Bienvenue au CCCZ"
  - Titre principal fort : "Centre Culturel Congolais Le Zoo"
  - Description institutionnelle courte

Boutons :
- CTA principal : Nos Événements (vert plein)
- CTA secondaire : Découvrir nos Artistes (outline clair)

Priorité : **lisibilité du texte sur l’image**

---

### 3. Promotion de la Culture Congolaise

- Fond clair
- Titre centré
- Texte introductif
- 4 cartes alignées :
  - Préservation
  - Communauté
  - Rayonnement
  - Création

Cartes :
- Icône
- Titre
- Description courte
- Ombre douce + hover discret

---

### 4. Événements à venir

- Titre à gauche
- Bouton "Voir tous les événements" à droite
- Grille de cartes événements

Carte événement :
- Image en haut
- Badge catégorie
- Titre
- Date + lieu
- Hover léger

Section réutilisable pour la page Événements.

---

### 5. Espaces et événements

- Layout en deux colonnes :
  - Texte à gauche (titre, description, bouton)
  - Images empilées à droite (effet profondeur)

Bouton : Explorer nos espaces

---

### 6. Rejoignez notre communauté

- Fond vert foncé
- Titre centré
- 3 cartes :
  - Artistes
  - Partenaires
  - Visiteurs

Chaque carte :
- Icône
- Description
- Bouton d’action

Section clé pour la mission du CCCZ.

---

### 7. Footer

- Fond sombre
- Texte clair
- Colonnes :
  - Logo + description
  - Navigation
  - Contacts
  - Newsletter / réseaux sociaux

---

## Organisation du code recommandée

```
/components
  /layout
  /sections
  /ui
/pages
/styles
/docs
```

---

## Règles de qualité et productivité

- Un composant = un fichier
- Aucun style dupliqué
- Composants UI génériques (Button, Card, Section)
- Commenter les choix structurants
- Préparer l’extension future (SEO, multilingue, CMS)

---

## Instruction finale à Codex

> Explique brièvement chaque composant créé et signale les points améliorables sans modifier l’identité visuelle du CCCZ.

---

**Document officiel – CCCZ**

