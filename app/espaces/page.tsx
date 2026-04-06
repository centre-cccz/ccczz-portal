import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Espaces & Activités | Centre Culturel Congolais Le Zoo',
  description: 'Découvrez les espaces du CCCZ et les activités proposées — Salle de spectacle, galerie, ateliers créatifs et plus.',
  keywords: ['espaces', 'activités', 'ateliers', 'spectacle', 'galerie', 'CCCZ'],
  openGraph: {
    title: 'Espaces & Activités | CCCZ',
    description: 'Les lieux et programmes du Centre Culturel Congolais Le Zoo',
    type: 'website',
    locale: 'fr_CD',
  },
};

export default function EspacesPage() {
  const spaces = [
    {
      id: 'salle-spectacle',
      name: 'Salle de Spectacle',
      badge: 'Spectacle vivant',
      image: '/images/espace/espace_construction-podium.png',
      imageAlt: 'Salle de spectacle du CCCZ',
      description: 'Une scène modulable de 500 places pour concerts, théâtre, danse et grandes rencontres culturelles.',
      capacity: '500 personnes',
      features: ['Scène modulable', 'Système son professionnel', 'Éclairage LED', 'Accès PMR'],
      activities: ['Concerts', 'Théâtre', 'Danse', 'Conférences', 'Galas culturels'],
    },
    {
      id: 'galerie-exposition',
      name: 'Galerie d\'Exposition',
      badge: 'Arts visuels',
      image: '/images/directions/galérie.png',
      imageAlt: 'Galerie du CCCZ',
      description: 'Un espace lumineux de 200 m² pour accueillir les œuvres contemporaines et les patrimoines visuels.',
      capacity: '200 m²',
      features: ['Éclairage naturel', 'Murs blancs', 'Climatisation', 'Système de accrochage flexible'],
      activities: ['Expositions temporaires', 'Installations d\'art', 'Œuvres congolaises', 'Projets internationaux'],
    },
    {
      id: 'espace-creatif',
      name: 'Espace Créatif & Ateliers',
      badge: 'Ateliers & résidences',
      image: '/images/espace/espace_02.png',
      imageAlt: 'Espace créatif du CCCZ',
      description: 'Ateliers, résidences d\'artistes et médiations pour soutenir la création locale et l\'expérimentation.',
      capacity: '80 personnes (modulable)',
      features: ['Studios privés', 'Équipement de base', 'Wifi', 'Accès 24/7 pour résidences'],
      activities: ['Ateliers de formation', 'Résidences d\'artistes', 'Mentoring', 'Projets collaboratifs'],
    },
    {
      id: 'salle-polyvalente',
      name: 'Salle Polyvalente',
      badge: 'Rencontres & conférences',
      image: '/images/directions/portail_zoo.png',
      imageAlt: 'Salle polyvalente du CCCZ',
      description: 'Un lieu adaptable pour conférences, projections, séminaires et dialogues culturels.',
      capacity: '200 personnes',
      features: ['Tables modulables', 'Vidéoprojecteur', 'Són intégré', 'Espace buffet'],
      activities: ['Conférences', 'Projections', 'Séminaires', 'Réunions institutionnelles'],
    },
    {
      id: 'cour-culturelle',
      name: 'Cour Culturelle',
      badge: 'Vie publique',
      image: '/images/espace/espace_03.png',
      imageAlt: 'Cour du CCCZ',
      description: 'Un espace ouvert pour les programmations publiques, les festivals et la convivialité.',
      capacity: 'Illimitée (en plein air)',
      features: ['Acoustique naturelle', 'Espace pour food trucks', 'Zone VIP', 'Éclairage ambiant'],
      activities: ['Concerts en plein air', 'Festivals', 'Marchés culturels', 'Pique-niques communautaires'],
    },
    {
      id: 'espace-jeunesse',
      name: 'Espace Jeunesse',
      badge: 'Transmission & apprentissage',
      image: '/images/directions/exposition01.jpg',
      imageAlt: 'Espace jeunesse du CCCZ',
      description: 'Un lieu d\'apprentissage, d\'expression et d\'accompagnement pour les jeunes publics (14-30 ans).',
      capacity: '60 personnes',
      features: ['Équipement multimédia', 'Studio d\'enregistrement basique', 'Espace coWorking', 'Bibliothèque jeunesse'],
      activities: ['Ateliers numériques', 'Formation artistique', 'Mentorat', 'Débats & discussions'],
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              NOS ESPACES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Espaces & Activités
            </h1>
            <p className="text-lg text-green-100">
              Découvrez les lieux et les programmes du Centre Culturel Congolais Le Zoo — 
              Un réseau d'espaces dédiés à la création, la diffusion et la transmission culturelle.
            </p>
          </div>
        </div>
      </section>

      {/* Espaces Directory */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              RÉPERTOIRE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos 6 espaces principaux
            </h2>
            <p className="text-lg text-gray-600">
              Chaque espace est conçu pour accueillir des activités spécifiques et contribuer à la mission du CCCZ.
            </p>
          </div>

          <div className="space-y-8">
            {spaces.map((space, idx) => (
              <div key={space.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border-l-4 border-green-700">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="md:col-span-1 relative h-48 md:h-auto bg-gray-300">
                    <Image
                      src={space.image}
                      alt={space.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-3">
                          {space.badge}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">{space.name}</h3>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{space.description}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Capacité</h4>
                        <p className="text-gray-700">{space.capacity}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Équipements</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {space.features.slice(0, 2).map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                          {space.features.length > 2 && (
                            <li>• + {space.features.length - 2} autre(s)</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Activités proposées</h4>
                      <div className="flex flex-wrap gap-2">
                        {space.activities.map((activity, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horaires & Coordonnées */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            <div>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
                HORAIRES
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Quand nous visiter ?
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">En semaine</h3>
                  <p className="text-gray-700">Lundi — Vendredi: 09h00 — 18h00</p>
                  <p className="text-sm text-gray-600 mt-2">Prévoir 1h minimum pour une visite</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Week-end</h3>
                  <p className="text-gray-700">Samedi — Dimanche: 11h00 — 19h00</p>
                  <p className="text-sm text-gray-600 mt-2">Programmations spéciales le week-end</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Jours fériés</h3>
                  <p className="text-gray-700">Sur demande — Contactez-nous préalablement</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-700">
                  <p className="text-sm text-gray-700">
                    <strong>Réservation recommandée</strong> pour les groupes de +10 personnes et les ateliers.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
                ACCÈS
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Où sommes-nous ?
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Adresse Principale</h3>
                  <p className="text-gray-700">
                    Centre Culturel Congolais Le Zoo<br/>
                    Boulevard du Fleuve<br/>
                    Gombe, Kinshasa<br/>
                    République Démocratique du Congo
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded">📍 Gombe</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded">🇨🇩 RDC</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-700">
                    <strong>Téléphone:</strong> +243 XXX XXX XXX<br/>
                    <strong>Email:</strong> info@cccz.cd<br/>
                    <strong>Web:</strong> www.cccz.cd
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Accessibilité</h3>
                  <p className="text-gray-700">✓ Accès PMR<br/>✓ Ascenseurs<br/>✓ Toilettes adaptées<br/>✓ Parking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs & Réservations */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              TARIFS & RÉSERVATIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accès gratuit ou payant selon les activités
            </h2>
            <p className="text-lg text-gray-600">
              Le CCCZ privilégie l'accès gratuit pour les expositions et certains événements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-green-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expositions & Visites</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-green-700 mb-2">Gratuit</div>
                <p className="text-sm text-gray-600">Pour les citoyens congolais</p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Accès galerie</li>
                <li>✓ Expositions temporaires</li>
                <li>✓ Visites guidées (groupe)</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ateliers & Formations</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-700 mb-2">5 — 50 $</div>
                <p className="text-sm text-gray-600">Selon le type et la durée</p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Demi-journée: 5 — 15 $</li>
                <li>✓ Journée complète: 20 — 35 $</li>
                <li>✓ Forfaits groupe: negociable</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-purple-700">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Événements & Spectacles</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-purple-700 mb-2">Variable</div>
                <p className="text-sm text-gray-600">Selon l'événement</p>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Gratuit pour la plupart</li>
                <li>✓ Quelques événements payants</li>
                <li>✓ Réservations via billetterie</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-lg border-l-4 border-green-700">
            <h3 className="font-bold text-gray-900 mb-3">🎟️ Réserver un espace ou une activité</h3>
            <p className="text-gray-700 mb-4">
              Pour réserver un espace, participer à un atelier ou organiser un événement, veuillez nous contacter directement.
            </p>
            <a href="/contact" className="inline-block px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition">
              Formulaire de réservation
            </a>
          </div>
        </div>
      </section>

      {/* Programme & Événements */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              PROGRAMMATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Consultez notre agenda
            </h2>
            <p className="text-lg text-gray-600">
              Chaque mois apporte de nouvelles activités, expositions et événements culturels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <a href="/actualites" className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg border-2 border-green-300 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700">
                📰 Actualités & Nouvelles
              </h3>
              <p className="text-gray-700 mb-4">
                Restez informé des dernières nouvelles du CCCZ — expositions, projets, partenariats.
              </p>
              <span className="text-green-700 font-semibold group-hover:translate-x-1 transition">Lire les actualités →</span>
            </a>

            <a href="/evenements" className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border-2 border-blue-300 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">
                🎪 Agenda & Événements
              </h3>
              <p className="text-gray-700 mb-4">
                Consultez tous les événements à venir — spectacles, conférences, festivals.
              </p>
              <span className="text-blue-700 font-semibold group-hover:translate-x-1 transition">Voir l'agenda →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à nous rendre visite ?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Venez découvrir nos espaces, participer à nos ateliers et partager la richesse culturelle du Congo au CCCZ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition">
              Nous contacter
            </a>
            <a href="/evenements" className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-700 transition">
              Voir nos événements
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
