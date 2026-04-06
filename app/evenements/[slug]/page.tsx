/*
META
status: PRODUCTION
directions_validated: ["Communication", "DACPA", "Direction Générale"]
last_updated: 2026-02-15
*/

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import events from '../../../content/evenements.json';

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = events.find((x: any) => x.slug === params.slug);
  if (!event) return { title: 'Événement non trouvé' };

  return {
    title: `${event.title} | CCCZ`,
    description: event.description?.substring(0, 160),
    keywords: [event.title, 'événement', 'CCCZ', event.location],
    openGraph: {
      title: event.title,
      description: event.description,
      type: 'event',
      locale: 'fr_CD',
    },
  };
}

export default function EventDetail({ params }: { params: { slug: string } }) {
  const event = events.find((x: any) => x.slug === params.slug);
  if (!event) return notFound();

  // Status color mapping
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    Disponible: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Places disponibles' },
    Complet: { bg: 'bg-red-100', text: 'text-red-800', label: '✕ Complet' },
    'À confirmer': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⟳ À confirmer' },
  };

  const status = statusColors[event.status || 'Disponible'] || statusColors.Disponible;

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      {event.image && (
        <div className="relative h-48 md:h-96 w-full bg-gray-300 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold mb-3 ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 md:py-16 grid md:grid-cols-3 gap-8">
        {/* Content Column */}
        <div className="md:col-span-2">
          {/* Title & Meta */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              {event.category === 'cinema' && '🎬 SEFICO'}
              {event.category === 'independence' && '🇨🇩 INDÉPENDANCE'}
              {event.category === 'womens-month' && '👩 FEMME'}
              {event.category === 'cultural' && '🎨 CULTUREL'}
              {!['cinema', 'independence', 'womens-month', 'cultural'].includes(event.category) && '🎪 ÉVÉNEMENT'}
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <span className="font-semibold">
                  {event.dateEnd ? `${event.date} au ${event.dateEnd}` : event.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <span className="font-semibold">{event.time || 'À confirmer'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span className="font-semibold">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Main Description */}
          <section className="mb-12 prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-700 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
            </div>
          </section>

          {/* Details Grid */}
          <section className="grid md:grid-cols-2 gap-6 mb-12">
            {event.participants && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">👥 Intervenant(s)</h3>
                <p className="text-gray-700">{event.participants}</p>
              </div>
            )}

            {event.venue && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🎪 Lieu de Programmation</h3>
                <p className="text-gray-700">{event.venue}</p>
              </div>
            )}

            {event.duration && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">⏱️ Durée</h3>
                <p className="text-gray-700">{event.duration}</p>
              </div>
            )}

            {event.pricing && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💰 Tarification</h3>
                <p className="text-gray-700">{event.pricing}</p>
              </div>
            )}
          </section>

          {/* Extended Content */}
          {event.content && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de cet événement</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {event.content}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {event.gallery && event.gallery.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galerie de l'événement</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {event.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${event.title} - Photo ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organizer Info */}
          <section className="bg-green-50 p-8 rounded-lg border-l-4 border-green-700">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Organisateur</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Institution:</strong> Centre Culturel Congolais Le Zoo</p>
              <p><strong>Direction responsable:</strong> DACPA (Direction Activités & Création Culturelle)</p>
              <p><strong>Validation:</strong> Communication & Direction Générale</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Booking Card */}
          <div className="bg-gradient-to-br from-green-700 to-green-900 text-white p-8 rounded-lg shadow-lg sticky top-6">
            <h3 className="text-2xl font-bold mb-6">Participer à l'événement</h3>

            <div className="space-y-4 mb-8">
              <div className="bg-white/20 p-4 rounded">
                <p className="text-sm opacity-90">Date</p>
                <p className="font-semibold text-lg">{event.date}</p>
              </div>
              <div className="bg-white/20 p-4 rounded">
                <p className="text-sm opacity-90">Lieu</p>
                <p className="font-semibold">{event.location}</p>
              </div>
              <div className={`${status.bg} ${status.text} p-4 rounded font-semibold text-center`}>
                {status.label}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/billetterie"
                className="block w-full px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
              >
                🎟️ Réserver une place
              </a>
              <a
                href="/contact"
                className="block w-full px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-700 transition text-center"
              >
                 📧 Nous contacter
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-white/30 space-y-3 text-sm opacity-90">
              <p>
                <span className="text-lg">❓</span> Des questions ?
              </p>
              <p>
                Consultez notre <Link href="/faq" className="underline font-semibold">FAQ</Link> ou contactez-nous
              </p>
            </div>
          </div>

          {/* Share Card */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-4">Partager cet événement</h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
                📘 Facebook
              </button>
              <button className="w-full px-4 py-2 bg-sky-500 text-white rounded font-semibold hover:bg-sky-600 transition">
                𝕏 Twitter
              </button>
              <button className="w-full px-4 py-2 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-800 transition">
                💬 WhatsApp
              </button>
              <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-100 transition">
                🔗 Copier le lien
              </button>
            </div>
          </div>

          {/* Related Events */}
          <div className="mt-8">
            <h4 className="font-bold text-gray-900 mb-4">Autres événements</h4>
            <div className="space-y-3">
              {events
                .filter((e: any) => e.slug !== event.slug && e.category === event.category)
                .slice(0, 3)
                .map((relatedEvent: any) => (
                  <Link
                    key={relatedEvent.slug}
                    href={`/evenements/${relatedEvent.slug}`}
                    className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition group"
                  >
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">
                      {relatedEvent.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{relatedEvent.date}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Events */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-6 text-center">
          <Link href="/evenements" className="inline-block px-6 py-3 border-2 border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">
            ← Retour à l'agenda
          </Link>
        </div>
      </section>
    </main>
  );
}
