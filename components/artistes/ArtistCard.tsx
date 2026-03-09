import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artist, ArtistMedia, disciplineLabels } from '@/lib/artistes/schema';

interface ArtistCardProps {
    artist: Artist & { mediaItems: ArtistMedia[] };
    featured?: boolean;
}

/**
 * Artist card component used in grid view
 * Shows featured image, name, disciplines, with hover effects
 */
export function ArtistCard({ artist, featured = false }: ArtistCardProps) {
    const featuredImage = artist.mediaItems?.[0];
    const disciplineList = artist.disciplines
        .slice(0, 2)
        .map((d) => disciplineLabels[d as any])
        .join(', ');

    return (
        <Link href={`/artistes/${artist.slug}`}>
            <div className={`group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl ${featured ? 'ring-2 ring-amber-400' : ''}`}>
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                    {featuredImage?.url ? (
                        <Image
                            src={featuredImage.url}
                            alt={artist.name}
                            fill
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : artist.profileImage ? (
                        <Image
                            src={artist.profileImage}
                            alt={artist.name}
                            fill
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                            <svg
                                className="h-16 w-16 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Featured Badge */}
                    {featured && (
                        <div className="absolute right-0 top-0 bg-amber-400 px-3 py-1 text-sm font-semibold text-white">
                            ★ En vedette
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="bg-white p-4 transition-colors duration-300 group-hover:bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {artist.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {disciplineList}
                    </p>

                    <p className="mt-2 text-xs text-gray-500 line-clamp-3">
                        {artist.bio}
                    </p>

                    {/* Hover CTA */}
                    <div className="mt-3 flex items-center text-sm font-semibold text-amber-600 transition-transform duration-300 group-hover:translate-x-1">
                        Voir le profil →
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ArtistCard;
