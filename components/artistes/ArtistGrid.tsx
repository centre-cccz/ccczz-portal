'use client';

import React from 'react';
import { Artist, ArtistMedia } from '@/lib/artistes/schema';
import ArtistCard from './ArtistCard';

interface ArtistGridProps {
    artists: (Artist & { mediaItems: ArtistMedia[] })[];
    isLoading?: boolean;
}

/**
 * Responsive grid component for displaying artists
 * 3 cols on desktop, 2 on tablet, 1 on mobile
 */
export function ArtistGrid({ artists = [], isLoading = false }: ArtistGridProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-lg" />
                        <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
                        <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (artists.length === 0) {
        return (
            <div className="py-12 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    Aucun artiste trouvé
                </h3>
                <p className="mt-1 text-gray-600">
                    Essayez d'ajuster vos filtres ou revenez plus tard
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
                <ArtistCard
                    key={artist.id}
                    artist={artist}
                    featured={artist.featured}
                />
            ))}
        </div>
    );
}

export default ArtistGrid;
