/*
META
status: BROUILLON
directions_notified: ["Communication", "DACPA"]
next_steps: ["Valider fiche artiste/organisateur", "Ajouter détails logistiques"]
*/

import React from 'react';
import { notFound } from 'next/navigation';
import events from '../../../content/evenements.json';

export default function EventDetail({ params }: { params: { slug: string } }) {
    const e = events.find((x: any) => x.slug === params.slug);
    if (!e) return notFound();

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-2">{e.title} (BROUILLON)</h1>
            <p className="text-sm text-gray-600">{e.date} — {e.location}</p>
            <section className="mt-4 text-gray-700">
                <h2 className="text-xl font-medium">Description</h2>
                <p className="mt-2">{e.description}</p>
            </section>

            <section className="mt-6">
                <h3 className="text-lg font-medium">Informations pratiques</h3>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                    <li>Durée estimée: {e.duration || '—'}</li>
                    <li>Tarifs: {e.pricing || 'À définir'}</li>
                    <li>Accès / billetterie: {e.ticketing || 'À définir'}</li>
                </ul>
            </section>
        </main>
    );
}
