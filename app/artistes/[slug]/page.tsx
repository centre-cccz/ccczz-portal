import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        // adapt to `public_artists` table used on cPanel
        const rows: any[] = await prisma.query(
            `SELECT id, slug, name, biography AS bio, image_url AS profileImage, website_url FROM public_artists WHERE slug = ? LIMIT 1`,
            [params.slug]
        );
        const artist = rows && rows[0];
        if (!artist) return { title: 'Artiste introuvable' };
        return {
            title: `${artist.name} | Nos Artistes`,
            description: artist.bio?.slice(0, 160) ?? undefined,
            openGraph: { title: `${artist.name} | Nos Artistes`, description: artist.bio?.slice(0, 160) },
        };
    } catch (error: any) {
        console.error('generateMetadata artist error:', error);
        return { title: 'Artiste' };
    }
}

export default async function ArtistProfile({ params }: { params: { slug: string } }) {
    try {
        // fetch artist row from public_artists and adapt shape to expected fields
        const rows: any[] = await prisma.query(
            `SELECT id, slug, name, specialization AS disciplines, biography AS bio, image_url AS profileImage, website_url AS website, created_at, updated_at FROM public_artists WHERE slug = ? LIMIT 1`,
            [params.slug]
        );
        const artistRow = rows && rows[0];

        if (!artistRow) {
            return (
                <div className="py-24 text-center">
                    <h1 className="text-2xl font-bold">Artiste introuvable</h1>
                    <p className="mt-2 text-gray-600">Vérifiez l'URL ou revenez au répertoire des artistes.</p>
                </div>
            );
        }

        // No separate media table in the public schema; return empty media array
        const media: any[] = [];

        // parse disciplines string into array
        let disciplines: string[] = [];
        if (artistRow.disciplines && typeof artistRow.disciplines === 'string') {
            disciplines = artistRow.disciplines.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        const artist = {
            ...artistRow,
            disciplines,
            socialLinks: null,
            mediaItems: media,
        };

        // Render below using the normalized `artist`

        // continue with rendering using `artist`
    } catch (error: any) {
        console.error('Artist profile data error:', error);
        return (
            <div className="py-24 text-center">
                <h1 className="text-2xl font-bold">Artiste introuvable</h1>
                <p className="mt-2 text-gray-600">Les données de l'artiste sont temporairement indisponibles.</p>
            </div>
        );
    }

    // NOTE: we keep the original rendering structure but use the `artist` variable
    // created above. To avoid duplicating the whole JSX block inside the try/catch,
    // we re-query / normalize earlier and then fallthrough to the same render.

    // If we reached this point inside the try block earlier, `artist` and its
    // mediaItems are available in scope; however due to TypeScript flow we will
    // re-run a lightweight fetch to obtain the normalized artist for rendering.
    const rowsFinal: any[] = await prisma.query(
        `SELECT id, slug, name, specialization AS disciplines, biography AS bio, image_url AS profileImage, website_url AS website, created_at, updated_at FROM public_artists WHERE slug = ? LIMIT 1`,
        [params.slug]
    );
    const aRow = rowsFinal && rowsFinal[0];
    const disciplinesFinal = aRow && aRow.disciplines && typeof aRow.disciplines === 'string'
        ? aRow.disciplines.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    const artistFinal = {
        ...aRow,
        disciplines: disciplinesFinal,
        socialLinks: null,
        mediaItems: [],
    };

    return (
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="w-full md:w-1/3">
                        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-100">
                            {artistFinal.profileImage ? (
                                <Image src={artistFinal.profileImage} alt={artistFinal.name} fill className="object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-gray-200">No image</div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-900">{artistFinal.name}</h1>
                        <p className="mt-3 text-gray-700 whitespace-pre-line">{artistFinal.bio}</p>

                        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                            {artistFinal.mediaItems.map((m: any) => (
                                <div key={m.id} className="overflow-hidden rounded-lg bg-gray-50">
                                    {m.type === 'IMAGE' ? (
                                        <div className="relative h-48 w-full">
                                            <Image src={m.url} alt={m.title} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="p-4">{m.title}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
