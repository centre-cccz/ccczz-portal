# Page Partenaires - Documentation

## 📋 Vue d'ensemble

La page partenaires du CCCZ a été entièrement créée avec une architecture complète incluant :

- Page principale des partenaires
- Gestion et filtrage des partenaires
- Formulaire de demande de partenariat
- Composants réutilisables
- Données mock pour 10+ partenaires

## 🗂️ Structure des fichiers créés

### Pages (App Router)

```
/app/partenaires/
├── page.tsx                    # Page principale des partenaires
└── demande/
    └── page.tsx               # Formulaire de demande de partenariat

/Admin/
└── partenaires/
    └── page.tsx               # Panel admin de gestion des partenaires
```

### Composants

```
/components/
├── sections/
│   ├── PartnersHeroSection.tsx           # Hero section avec stats
│   ├── PartnershipBenefitsSection.tsx    # Avantages du partenariat
│   ├── PartnersGridSection.tsx           # Grille groupée par catégorie
│   ├── PartnersStatsSection.tsx          # Statistiques
│   └── BecomePartnerSection.tsx          # CTA devenir partenaire
├── cards/
│   ├── PartnerCard.tsx                   # Simple partner card
│   └── PartnerDetailCard.tsx             # Detailed partner card
├── forms/
│   └── PartnershipRequestForm.tsx        # Formulaire de demande
└── home/
    ├── PartnersSection.tsx               # Section pour home page
    └── PartnersPromotionSection.tsx      # Promotion complète
```

### Données Mock

```
/lib/mock-data/
└── partners.ts                # 10 partenaires avec détails complets
```

### Validation

```
/lib/validation/
└── partnership.ts             # Validation des demandes de partenariat
```

## 📊 Structure des données partners

```typescript
interface Partner {
  id: number;
  name: string;
  category: 'institutional' | 'cultural' | 'commercial' | 'educational';
  role: string;
  description: string;
  logo?: string;
  website?: string;
  contact?: string;
  focused_areas?: string[];
}
```

## 🎨 Catégories de partenaires

1. **Institutionnels** 🏛️ - Ministères, UNESCO, organismes gouvernementaux
2. **Culturels** 🎨 - Galeries, associations artistiques, centres culturels
3. **Commerciaux** 💼 - Sponsors, entreprises, banques
4. **Académiques** 📚 - Universités, écoles, centres de formation

## ✨ Fonctionnalités principales

### Page Partenaires (`/partenaires`)

- ✅ Hero section avec statistiques
- ✅ Section avantages du partenariat (4 cartes)
- ✅ Grille de partenaires groupée par catégorie
- ✅ Filtrage par catégorie
- ✅ Stats en temps réel
- ✅ Section "Comment ça marche"
- ✅ FAQ intégrée
- ✅ CTA pour devenir partenaire

### Page Demande (`/partenaires/demande`)

- ✅ Formulaire complet avec validation
- ✅ Champs pour organisation et contact
- ✅ Sélection de domaines d'intérêt
- ✅ Proposition de partenariat
- ✅ Real-time validation et feedback
- ✅ Success message après envoi
- ✅ Guide des types de partenariat
- ✅ Informations de contact

### Panel Admin (`/admin/partenaires`)

- ✅ Vue d'ensemble avec stats par catégorie
- ✅ Recherche et filtrage
- ✅ Tableau complet des partenaires
- ✅ Actions (Edit, Delete)
- ✅ Domaines d'intérêt affichés
- ✅ Indicateurs visuels par catégorie

## 🎯 Partenaires inclus

1. Ministère de la Culture et des Arts - Institutionnel
2. UNESCO - Institutionnel
3. Association des Artistes Congolais - Culturel
4. Institut Français de Kinshasa - Culturel
5. Université de Kinshasa - Académique
6. Banque Congolaise - Commercial
7. Fondation pour l'Afrique - Institutionnel
8. Galerie Urbaine Kinshasa - Culturel
9. RTNC (Médias) - Commercial
10. Organisation des Jeunes Artistes - Académique

## 🔗 Intégration avec les pages existantes

### Contact Page

- Lien depuis le menu de navigation
- Préselection `userType=partner` pour les partenaires
- Validation spécifique aux partenaires

### Home Page

- Section `PartnersPromotionSection` affichant 6 partenaires featured
- Lien vers page complète

### Navbar

- Lien `/partenaires` déjà configuré
- Liaison avec CTA "Devenir Partenaire"

## 📱 Responsive Design

- ✅ Mobile first approach
- ✅ Grid responsive (1 col mobile, 2 col tablette, 3+ col desktop)
- ✅ Formulaire optimisé mobile
- ✅ Filtres adaptatifs

## 🎨 Couleurs et styles

- **Primaire** : Green-700 (pour les CTA et accents)
- **Catégories** :
  - Institutionnel: Green-700
  - Culturel: Amber-600
  - Commercial: Blue-600
  - Académique: Purple-600

## 🔐 Sécurité et Validation

- ✅ Validation côté client du formulaire
- ✅ Vérification des emails
- ✅ Vérification des champs obligatoires
- ✅ Longueur minimale des messages
- ✅ Sélection minimale de domaines

## 📈 Prochaines étapes suggérées

1. **Backend** : Créer l'API pour :
   - Stocker les demandes de partenariat
   - Envoyer les emails de confirmation
   - Panel admin pour gérer les demandes

2. **Email** : Configurer :
   - Template d'email de confirmation
   - Email d'alerte admin
   - Email de réponse aux partenaires

3. **Images** : Ajouter :
   - Logos des partenaires
   - Images de catégories
   - Badge partenaire

4. **Analytics** : Tracker :
   - Nombre de demandes reçues
   - Taux de conversion
   - Domaines les plus demandés

## 🚀 Utilisation

### Pour accéder à la page partenaires

```
http://localhost:3000/partenaires
```

### Pour soumettre une demande

```
http://localhost:3000/partenaires/demande
```

### Pour le panel admin

```
http://localhost:3000/admin/partenaires
```

### Ajouter la section à la home page

```typescript
import PartnersPromotionSection from '@/components/home/PartnersPromotionSection';

// Dans page.tsx
<PartnersPromotionSection />
```

## 💡 Points personnalisables

1. **Partenaires** : Modifier `/lib/mock-data/partners.ts`
2. **Email contact** : Changer `partnerships@cccz.cd` dans les composants
3. **Domaines** : Ajouter/retirer dans `PartnershipRequestForm.tsx`
4. **Couleurs** : Modifier les classes Tailwind dans les sections

---

**Créé le** : 2026-02-16
**État** : ✅ Complet et fonctionnel
