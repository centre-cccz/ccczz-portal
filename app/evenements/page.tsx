import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import events from '../../content/evenements.json';

export default function EvenementsPage() {
  // Trier par date
  const sortedEvents = [...events].sort((a: any, b: any) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Séparer les événements majeurs
  const majorEvents = sortedEvents.filter((e: any) =>
    ['sefico-2026', 'special-30-juin', 'jif-2026-conference', 'theatre-mondial-2026'].includes(e.slug)
  );
  const otherEvents = sortedEvents.filter((e: any) =>
    !['sefico-2026', 'special-30-juin', 'jif-2026-conference', 'theatre-mondial-2026'].includes(e.slug)
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Événements & Programmation</h1>
          <p className="text-lg text-green-100">
            Découvrez notre programmation culturelle et artistique pour 2026 — Une célébration de notre patrimoine,
            de nos artistes et de notre identité.
          </p>
        </div>
      </section>

      {/* Événements Majeurs */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">Événements Majeurs 2026</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {majorEvents.map((e: any) => (
            <div key={e.slug} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              {e.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    {e.category === 'cinema' && '🎬 SEFICO'}
                    {e.category === 'independence' && '🇨🇩 30 JUIN'}
                    {e.category === 'womens-month' && '👩 FEMME'}
                    {e.category === 'cultural' && '🎨 CULTUREL'}
                  </span>
                  <span className="text-sm text-gray-600 font-semibold">
                    {e.dateEnd ? `${e.date} au ${e.dateEnd}` : e.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{e.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{e.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 <strong>{e.location}</strong></p>
                  {e.time && <p>⏰ <strong>{e.time}</strong></p>}
                  {e.participants && <p>👥 <strong>{e.participants}</strong></p>}
                </div>

                <div className="flex gap-3">
                  <a
                    href={`#${e.slug}`}
                    className="flex-1 px-4 py-2 bg-green-700 text-white rounded font-semibold hover:bg-green-600 transition text-center text-sm"
                  >
                    Plus de détails
                  </a>
                  <a
                    href="/billetterie"
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition text-center text-sm"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Détails Complets des Événements Majeurs */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {majorEvents.map((e: any) => (
          <div key={e.slug} id={e.slug} className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{e.title}</h3>
              <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-green-100 text-green-800 rounded">
                {e.status}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-3 mb-6">
              {e.description.split('\n\n').map((para: string, idx: number) => (
                <p key={idx} className="text-justify">{para}</p>
              ))}
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-center p-4 bg-gray-50 rounded">
              <div>
                <p className="text-2xl font-bold text-green-700">{e.dateEnd ? '4 jours' : '1 jour'}</p>
                <p className="text-xs text-gray-600">DURÉE</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{e.participants || 'Multi'}</p>
                <p className="text-xs text-gray-600">PARTICIPANTS</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{e.pricing || 'À définir'}</p>
                <p className="text-xs text-gray-600">TARIFS</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">Libre</p>
                <p className="text-xs text-gray-600">ACCÈS</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Autres Événements */}
      {otherEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12 border-t">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Autres Événements</h2>

          <div className="space-y-4">
            {otherEvents.map((e: any) => (
              <div key={e.slug} className="bg-white p-5 rounded-lg border border-gray-200 hover:border-green-400 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{e.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 {e.date} • 📍 {e.location}
                    </p>
                    <p className="text-gray-700 mt-2">{e.excerpt}</p>
                  </div>
                  <a
                    href="/billetterie"
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap ml-4"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="bg-green-700 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Vous organisez un événement culturel ?</h2>
          <p className="text-green-100 mb-6">
            Contactez-nous pour discuter de vos projets, partenariats et opportunités de collaboration.
          </p>
          <a
            href="/contact?type=event"
            className="inline-block px-8 py-3 bg-white text-green-700 font-bold rounded hover:bg-green-50 transition"
          >
            Nous Contacter
          </a>
        </div>
      </section>
    </main>
  );
}

