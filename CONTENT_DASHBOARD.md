# 📊 TABLEAU DE BORD CONTENU — AGENT ÉDITEUR CCCZ

**Suivi**: Pages et contenu en génération  
**Date mise à jour**: 8 Février 2026  
**Statut global**: 🟡 À INITIER  

---

## 🌍 PAGES PUBLIQUES

### Accueil (`app/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Hero CCCZ | 🟡 À générer | 🔴 P1 | Éditeur | Texte court, impact |
| Notre Mission (preview) | 🟡 À générer | 🔴 P1 | Éditeur + DACPA | Max 3-4 lignes |
| Événements (preview) | 🟡 À générer | 🔴 P1 | Éditeur | Linked to /evenements |
| Espaces (preview) | 🟡 À générer | 🔴 P1 | Éditeur | Linked to /espaces |
| CTA Contact | 🟡 À générer | 🟠 P2 | Éditeur | Button + texte |
| CTA Billetterie | 🟡 À générer | 🟠 P2 | Éditeur + DF | Linked to ticketing system |

**Validation requise par**: Communication + DG  
**Prochaines étapes**: Créer brouillon page hero

---

### Notre Mission (`app/about/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Vision institutionnelle | 🟡 À générer | 🔴 P1 | Éditeur | From CHARTE_INSTITUTIONNELLE |
| Valeurs CCCZ | 🟡 À générer | 🔴 P1 | Éditeur | Inclusion, Transmission, Innovation |
| Directions & équipe | 🟡 À générer | 🟠 P2 | Éditeur + DG/DA | Organigramme |
| Histoire & patrimoine | 🟡 À générer | 🟠 P2 | Éditeur + Biblio | Historique CCCZ |
| Partenariats | 🟡 À générer | 🟠 P2 | Éditeur + DG | Logos + descriptions |

**Validation requise par**: Communication + DG + DACPA  
**Prochaines étapes**: Extraire charte institutionnelle

---

### Espaces & Activités (`app/espaces/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Galerie espaces | 🟡 À générer | 🔴 P1 | Éditeur + Com | Photos + descriptions |
| Descriptions activités | 🟡 À générer | 🔴 P1 | Éditeur + DACPA | Par espace |
| Horaires & tarifs | 🟡 À générer | 🟠 P2 | Éditeur + DA | From DACPA/DF |
| Réservations | 🟡 À générer | 🟠 P2 | Backend + Éditeur | CTA → système réservation |

**Validation requise par**: Communication + DACPA  
**Prochaines étapes**: Collecter données espaces auprès DACPA

---

### Agenda / Événements (`app/evenements/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Listing événements | 🟡 À générer | 🔴 P1 | Backend + Éditeur | Doit filtrer par date |
| Filtres (cat, date, lieu) | 🟡 À générer | 🔴 P1 | Frontend + Backend | UX/UI Designer validated |
| Événements à venir | 🟡 À générer | 🔴 P1 | Éditeur | Data-driven from DB |
| Événements passés | 🟡 À générer | 🟠 P2 | Éditeur | Archive |

**Validation requise par**: Communication + DACPA  
**Prochaines étapes**: Définir structure données événements

---

### Détail Événement (`app/evenements/[slug]/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Titre & description | 🟡 À générer | 🔴 P1 | Éditeur + DACPA | Contenu riche |
| Date, heure, lieu | 🟡 À générer | 🔴 P1 | Backend | From événement data |
| Billeterie | 🟡 À générer | 🔴 P1 | Backend + DF | Linked to payment system |
| Artistes & intervenants | 🟡 À générer | 🔴 P1 | Éditeur + DACPA | Fiches artistes linked |
| Galerie photos | 🟡 À générer | 🟠 P2 | Éditeur + Com | Post-événement |
| Partage social | 🟡 À générer | 🟠 P2 | Frontend | Meta tags for sharing |

**Validation requise par**: Communication + DACPA  
**Prochaines étapes**: Créer template événement

---

### Artistes (`app/artistes/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Répertoire artistes | 🟡 À générer | 🔴 P1 | Backend + Éditeur | Recherche + filtres |
| Fiches artistes | 🟡 À générer | 🟠 P2 | Éditeur + DACPA | Détail par artiste |
| Œuvres & galeries | 🟡 À générer | 🟠 P2 | Éditeur + Biblio | Images + descriptions |
| Bios culturelles | 🟡 À générer | 🟠 P2 | Éditeur + DACPA | Texte riche |

**Validation requise par**: Communication + DACPA + Bibliothèque  
**Prochaines étapes**: Collecter bios artistes CCCZ

---

### Actualités (`app/actualites/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Listing actualités | 🟡 À générer | 🔴 P1 | Backend + Éditeur | Paginé, récent en premier |
| Recherche & filtres | 🟡 À générer | 🟠 P2 | Frontend | Par tags, date, auteur |
| Actualités à la une | 🟡 À générer | 🔴 P1 | Éditeur | Curated highlights |
| Archives | 🟡 À générer | 🟠 P2 | Backend | Par année |

**Validation requise par**: Communication  
**Prochaines étapes**: Créer template actualité

---

### Galerie / Archives (`app/galerie/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Galerie photos | 🟡 À générer | 🟠 P2 | Éditeur + Com | Événements, expositions |
| Archives historiques | 🟡 À générer | 🟠 P2 | Éditeur + Biblio | Patrimoine CCCZ |
| Collections CCCZ | 🟡 À générer | 🟠 P3 | Éditeur + Biblio | Œuvres conservées |
| Documentaires | 🟡 À générer | 🟠 P3 | Éditeur + Biblio | Vidéos, archives vidéo |

**Validation requise par**: Communication + Bibliothèque  
**Prochaines étapes**: Inventorier assets existants

---

### Contact (`app/contact/page.tsx`)

| Élément | Statut | Priorité | Responsable | Notes |
|---------|--------|----------|-------------|-------|
| Formulaire contact | 🔴 FAIT | 🔴 P1 | Backend (API READY) | Sécurisé, isolation EXTERNAL |
| Adresses & téléphones | 🟡 À générer | 🔴 P1 | Éditeur + DA | Siège + succursales |
| Horaires | 🟡 À générer | 🔴 P1 | Éditeur + DA | Lun-Ven, week-end |
| Map localisation | 🟡 À générer | 🟠 P2 | Frontend | Google Maps embed |

**Validation requise par**: Communication + Administration  
**Prochaines étapes**: Confirmer coordonnées CCCZ

---

## 🏛️ PAGES INTERNES (Admin)

### Brouillons Actualités

| Élément | Statut | Notes |
|---------|--------|-------|
| Éditeur enrichi | 🟡 À implémenter | WYSIWYG editor |
| Statut workflow | 🟡 À implémenter | BROUILLON→VALIDATION→PUBLIÉ |
| Média upload | 🟡 À implémenter | Images + documents |

---

### Brouillons Événements

| Élément | Statut | Notes |
|---------|--------|-------|
| Fiche événement | 🟡 À implémenter | Form complet |
| Validation DACPA | 🟡 À implémenter | Approbation requis |

---

---

## 📈 MÉTRIQUES GLOBALES

| Métrique | Valeur | Trend |
|----------|--------|-------|
| Pages publiques | 9 | - |
| Pages complètement générées | 0 | 📍 À démarrer |
| Contenu en validation | 0 | ⏳ En attente |
| Contenu approuvé | 0 | ⏳ En attente |
| Contenu publié | 0 | 🚀 À venir |
| **% Complétude** | **0%** | 🔴 TO START |

---

## 🎯 PRIORITÉS IMMÉDIAT

### Week 1: Setup & Pages Critiques

1. ✅ **Créer CONTENT_MANAGEMENT_SYSTEM.md** ← FAIT
2. 📋 **Générer page Accueil** (brouillon)
3. 📋 **Générer page Contact** (brouillon)
4. 📋 **Générer page Espaces** (brouillon)
5. 🔔 **Notifier Communications & DG** pour approbation

### Week 2: Actualités & Événements

1. 📋 **Template actualité** (structure, sources)
2. 📋 **Template événement** (structure, données)
3. 📋 **Fiche artiste** (structure, validation)

### Week 3-4: Contenu Secondaire

1. 📋 **Galerie/Archives** (inventaire assets)
2. 📋 **Pages statiques** (Mission, Partenariats)

---

## 📞 CONTACTS VALIDATION

| Direction | Contact | Rôle | Email |
|-----------|---------|------|-------|
| Communication | À confirmer | Content approval | TBD |
| DACPA | À confirmer | Events & culture | TBD |
| Bibliothèque | À confirmer | Archives | TBD |
| Direction Générale | À confirmer | Final approval | TBD |

---

## 🎬 PROCHAINE ACTION

**→ Attendre instructions utilisateur:**

Quelle page / quel contenu générer en premier?

Options:

- [ ] Accueil (page d'entrée)
- [ ] Contact (formulaire API ready)
- [ ] Espaces (contenu institutionnel)
- [ ] Actualité (exemple workflow validation)
- [ ] Événement (template)
- [ ] Autre?

**En attente** ⏳
