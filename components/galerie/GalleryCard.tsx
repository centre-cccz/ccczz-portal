import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    event: {
        slug: string;
        title: string;
        image?: string;
        date?: string;
        province?: string;
    };
}

export default function GalleryCard({ event }: Props) {
    return (
        <Link href={`/galerie/${event.slug}`}>
            <div className="cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-56 w-full bg-gray-200">
                    {event.image ? (
                        <Image src={event.image} alt={event.title} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gray-300">No image</div>
                    )}
                </div>

                <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{event.province} • {event.date}</p>
                </div>
            </div>
        </Link>
    );
}
