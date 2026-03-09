import React from 'react';
import { Metadata } from 'next';
import GalleryGrid from '@/components/galerie/GalleryGrid';
import events from '@/content/evenements.json';

export const metadata: Metadata = {
  title: 'Galerie Culturelle | CCCZ',
  description: 'Galerie des événements et archives visuelles du Centre Culturel Congolais le Zoo',
};

export default function GaleriePage() {
  // map events to gallery-friendly items
  const list = events.map((ev: any) => ({
    slug: ev.slug,
    title: ev.title,
    image: ev.image,
    date: ev.date,
    province: ev.location ? ev.location.split(' - ')[0] : undefined,
  }));

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Galerie Culturelle</h1>
          <p className="mt-2 text-gray-600">Archive visuelle des événements et expositions du CCCZ</p>
        </header>

        <section className="mb-8">
          {/* TODO: Dynamic filters UI can be added here */}
        </section>

        <GalleryGrid events={list} />
      </div>
    </div>
  );
}

