import React from 'react';
import events from '@/content/evenements.json';
import Image from 'next/image';

export default function GalleryEventPage({ params }: { params: { slug: string } }) {
    const ev = (events as any[]).find((e) => e.slug === params.slug);

    if (!ev) {
        return (
            <div className="py-24 text-center">
                <h1 className="text-2xl font-bold">Événement introuvable</h1>
                <p className="mt-2 text-gray-600">Cet événement n'existe pas dans les archives.</p>
            </div>
        );
    }

    const images = Array.isArray(ev.images) && ev.images.length > 0 ? ev.images : ev.image ? [ev.image] : [];

    return (
        <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold">{ev.title}</h1>
                <p className="mt-2 text-gray-600">{ev.location}</p>

                <div className="mt-6">
                    {/* Simple image slider */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {images.map((src: string, i: number) => (
                            <div key={i} className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                                <Image src={src} alt={`${ev.title} ${i + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 prose max-w-none">
                    <h2>Description</h2>
                    <p>{ev.description}</p>

                    {ev.organizer && (
                        <>
                            <h3>Organisateur</h3>
                            <p>{ev.organizer}</p>
                        </>
                    )}

                    {ev.participants && (
                        <>
                            <h3>Participants</h3>
                            <p>{ev.participants}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
