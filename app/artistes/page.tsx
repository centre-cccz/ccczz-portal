import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArtistsPageContentClient from '@/components/artistes/ArtistsPageContentClient';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Nos Artistes | Centre Culturel Congolais le Zoo',
  description:
    'Découvrez les talents et créativités du Centre Culturel Congolais le Zoo. Répertoire institutional d\'artistes en arts visuels, musique, danse, théâtre et plus.',
  keywords: [
    'artistes',
    'talents',
    'créativité',
    'arts visuels',
    'musique',
    'danse',
    'théâtre',
    'CCCZ',
  ],
  openGraph: {
    title: 'Nos Artistes | CCCZ',
    description: 'Découvrez les talents du Centre Culturel Congolais le Zoo',
    type: 'website',
    locale: 'fr_CD',
  },
};

/**
 * Artists hub main page - Server component
 * Fetches artists, renders with client components for interactivity
 */
export default async function ArtistsPage() {
  // The production / cPanel schema uses `public_artists` (snake_case).
  // Adapt queries to that table and provide robust error handling so the page
  // doesn't crash at runtime when DB is misconfigured or tables differ.
  try {
    const artistsRows: any[] = await prisma.query(
      `SELECT id, slug, name, specialization AS disciplines, biography AS bio, image_url AS profileImage, website_url AS website, is_visible, created_at, updated_at
       FROM public_artists
       WHERE is_visible = 1
       ORDER BY published_at DESC, created_at DESC`
    );

    const countRows: any[] = await prisma.query(
      `SELECT COUNT(*) as cnt FROM public_artists WHERE is_visible = 1`
    );
    const total = (countRows && (countRows as any)[0] && (countRows as any)[0].cnt) || artistsRows.length;

    // Build normalized artists shape expected by client components
    const artistsWithMedia = artistsRows.map((a: any) => {
      // `specialization` in DB may be a comma-separated string; convert to array
      let disciplines: string[] = [];
      if (a.disciplines && typeof a.disciplines === 'string') {
        disciplines = a.disciplines.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      // No dedicated ArtistMedia table in this schema; leave media empty
      const mediaItems: any[] = [];

      return {
        id: a.id,
        slug: a.slug,
        name: a.name,
        disciplines,
        bio: a.bio || '',
        profileImage: a.profileImage || a.image_url || null,
        website: a.website || null,
        publicProfile: !!a.is_visible,
        featured: false,
        createdAt: a.created_at ? new Date(a.created_at).toISOString() : null,
        updatedAt: a.updated_at ? new Date(a.updated_at).toISOString() : null,
        mediaItems,
      };
    });

    return <ArtistsPageContentClient initialArtists={artistsWithMedia as any} total={total} />;
  } catch (error: any) {
    // Log the error server-side with details and show a friendly message to users
    console.error('ArtistsPage data error:', error);
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">Répertoire des artistes indisponible</h1>
        <p className="mt-2 text-gray-600">Les données des artistes sont temporairement indisponibles. Veuillez réessayer plus tard.</p>
      </div>
    );
  }
}

