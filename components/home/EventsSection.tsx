import React from 'react';
import Image from 'next/image';
import EventCard from './EventCard';

// Événements majeurs 2026
const majorEvents = [
  {
    id: 'sefico-2026',
    title: 'SEFICO 3 — Semaine du Film Congolais',
    category: 'Cinéma',
    dateRange: '15-18 Avril 2026',
    location: 'Salle des Spectacles, Gombe',
    excerpt: 'Célébration nationale du cinéma congolais avec diffusion de films et rencontres avec réalisateurs.',
    image: '/images/evenements/projet_sefico_avril_2026.png',
    link: '/evenements#sefico-2026',
    icon: '🎬',
  },
  {
    id: 'special-30-juin',
    title: 'Spécial 30 Juin — Indépendance RDC',
    category: 'Commémoration',
    dateRange: '30 Juin 2026',
    location: 'Salle des Spectacles, Gombe',
    excerpt: 'Exposition des Présidents de la République et Ministres de la Culture (1960-2026).',
    image: '/images/evenements/expositio_tableaupresident.jpg',
    link: '/evenements#special-30-juin',
    icon: '🇨🇩',
  },
  {
    id: 'femme-2026',
    title: 'Mois de la Femme — JIF 2026 & Théâtre',
    category: 'Femme & Culture',
    dateRange: '8 & 27 Mars 2026',
    location: 'Salle des Spectacles & Musée National',
    excerpt: 'Conférence-débat, spectacle de théâtre, défilé de mode et célébration de la Journée Mondiale du Théâtre.',
    image: '/images/evenements/mois_de_la_femme.mp4',
    link: '/evenements#jif-2026-conference',
    icon: '👩',
  },
];

// Autres événements
const otherEvents = [
  {
    title: 'Festival Jeune Création',
    category: 'Festival',
    date: '12 Mai 2026',
    location: 'Place des Arts',
    price: 'Gratuit',
    status: 'Disponible' as const,
    statusKey: 'disponible' as const,
    slug: 'festival-jeune-creation',
    image: '/images/galerie/futures01.jpg',
    imageAlt: 'Festival Jeune Création',
  },
  {
    title: 'Atelier Numérique',
    category: 'Atelier',
    date: '20 Avril 2026',
    location: 'CCC Le Zoo',
    price: 'À partir de 5 $',
    status: 'Disponible' as const,
    statusKey: 'disponible' as const,
    slug: 'atelier-numerique',
    image: '/images/galerie/exposition01.jpg',
    imageAlt: 'Atelier Numérique',
  },
];

export default function EventsSection() {
  return (
    <>
      {/* Événements Majeurs - Featured Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ✨ Événements Majeurs 2026
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Trois grands projets culturels qui marqueront l'année — cinema, indépendance et célébration de la femme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {majorEvents.map((event) => (
              <a
                key={event.id}
                href={event.link}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="relative h-40 w-full bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{event.icon}</span>
                    <span className="text-xs font-semibold text-green-700 uppercase">{event.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.excerpt}</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>📅 {event.dateRange}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/evenements"
              className="inline-block px-8 py-4 bg-green-700 text-white font-bold rounded-lg hover:bg-green-600 transition"
            >
              Voir tous les événements &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Autres événements */}
      <section className="section events-section">
        <div className="container">
          <div className="events-header">
            <h2>Et aussi...</h2>
          </div>
          <div className="events-grid">
            {otherEvents.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
