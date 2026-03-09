'use client';

import React from 'react';
import GalleryCard from './GalleryCard';

interface EventItem {
    slug: string;
    title: string;
    image?: string;
    date?: string;
    province?: string;
}

interface Props {
    events: EventItem[];
}

export default function GalleryGrid({ events }: Props) {
    if (!events || events.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-600">Aucun élément dans la galerie</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
                <GalleryCard key={e.slug} event={e} />
            ))}
        </div>
    );
}
