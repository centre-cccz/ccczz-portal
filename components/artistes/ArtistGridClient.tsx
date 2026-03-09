'use client';

import React from 'react';
import ArtistGrid from './ArtistGrid';
import { Artist, ArtistMedia } from '@/lib/artistes/schema';

interface ArtistGridClientProps {
    initialArtists: (Artist & { mediaItems: ArtistMedia[] })[];
}

/**
 * Client wrapper for static artist grid display
 */
export function ArtistGridClient({ initialArtists }: ArtistGridClientProps) {
    return <ArtistGrid artists={initialArtists} />;
}

export default ArtistGridClient;
