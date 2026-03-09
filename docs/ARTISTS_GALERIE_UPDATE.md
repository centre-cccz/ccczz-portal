Résumé des modifications — Artistes & Galerie

Ajoutés:

- Prisma schema: `prisma/schema.prisma` (models: `Artist`, `ArtistMedia`, `GalleryEvent`)
- Prisma client singleton: `lib/prisma.ts`
- Client component for artists page: `components/artistes/ArtistsPageContentClient.tsx`
- Artist profile page: `app/artistes/[slug]/page.tsx`
- Gallery pages and components:
  - `app/galerie/page.tsx`
  - `app/galerie/[slug]/page.tsx`
  - `components/galerie/GalleryGrid.tsx`
  - `components/galerie/GalleryCard.tsx`

Mise à jour:

- `app/artistes/page.tsx` now uses the client component and serializes server data for client rendering.

Notes d'installation:

1. Ajoutez `DATABASE_URL` dans l'environnement (MySQL). Exemple:

```
DATABASE_URL=mysql://user:pass@localhost:3306/ccczz
```

1. Installer Prisma si nécessaire:

```bash
npm install prisma @prisma/client
npx prisma generate
npx prisma migrate dev --name init_artists_gallery
```

1. Les pages de la galerie utilisent `content/evenements.json` comme source. Pour migrer vers la base, adaptez `app/galerie/page.tsx`.

Sécurité & suivi:

- Validation Zod déjà présente dans `lib/artistes/schema.ts` pour les formulaires de soumission.
- Prévoir middleware de contrôle d'uploads et rate-limiting avant d'activer les soumissions publiques.
