import React from 'react';
import { Metadata } from 'next';
import ValuesSection from '@/components/home/ValuesSection';
import ArtistsSection from '@/components/home/ArtistsSection';
import VisitorsSection from '@/components/home/VisitorsSection';

export const metadata: Metadata = {
  title: 'Notre Mission | Centre Culturel Congolais Le Zoo',
  description: 'Découvrez la mission, les valeurs et l\'histoire du Centre Culturel Congolais Le Zoo — Institution de préservation et promotion du patrimoine culturel congolais.',
  keywords: ['mission', 'culture', 'patrimoine', 'Congo', 'CCCZ'],
  openGraph: {
    title: 'Notre Mission | CCCZ',
    description: 'Institution de préservation et promotion du patrimoine culturel congolais',
    type: 'website',
    locale: 'fr_CD',
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              NOTRE INSTITUTION
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Centre Culturel Congolais Le Zoo
            </h1>
            <p className="text-lg text-green-100 leading-relaxed">
              Une institution nationale dédiée à la préservation, à la création et à la transmission du patrimoine culturel congolais. 
              Depuis sa fondation, le CCCZ œuvre pour favoriser le lien entre traditions ancestrales et innovations contemporaines.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            {/* Mission */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  MISSION
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos objectifs structurants
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Promouvoir</strong> la création, la formation et la préservation du patrimoine culturel congolais 
                  en favorisant l'accès des jeunes aux arts et aux technologies.
                </p>
                <ul className="space-y-3 mt-4">
                  <li className="flex gap-3">
                    <span className="text-green-700 font-bold">•</span>
                    <span><strong>Sauvegarde du patrimoine:</strong> Documenter et valoriser nos mémoires, gestes et récits</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-700 font-bold">•</span>
                    <span><strong>Transmission générationnelle:</strong> Transférer le savoir-faire aux jeunes créateurs</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-700 font-bold">•</span>
                    <span><strong>Création contemporaine:</strong> Soutenir l'émergence de nouvelles voix artistiques</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-700 font-bold">•</span>
                    <span><strong>Rayonnement international:</strong> Porter la culture congolaise au-delà des frontières</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  VISION
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Où nous voulons aller
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Être <strong>le centre culturel de référence</strong> pour la préservation, l'innovation et la promotion 
                  du patrimoine culturel congolais — un lieu vivant où traditions et technologies se rencontrent et dialoguent.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-green-700 mt-6">
                  <p className="text-sm text-gray-600">
                    <strong>2026 & Au-delà:</strong> Consolider notre présence physique, affirmer notre expertise numérique, 
                    élargir nos partenariats régionaux et internationaux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <ValuesSection />

      {/* Histoire & Patrimoine */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              HISTOIRE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Le CCCZ: Une institution au service du patrimoine
            </h2>
            <p className="text-lg text-gray-600">
              Fondée avec pour mission de préserver et promouvoir la richesse culturelle congolaise, 
              l'institution s'inscrit dans une continuité historique de protection du patrimoine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-green-700 mb-3">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bibliothèque & Archives</h3>
              <p className="text-gray-700">
                Possession et numérisation progressive de fonds de manuscrits, enregistrements sonores 
                et collections photographiques du patrimoine congolais.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-green-700 mb-3">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collections & Expositions</h3>
              <p className="text-gray-700">
                Mise en avant d'œuvres d'art, d'artefacts historiques et d'installations contemporaines 
                reflétant la diversité et la richesse des expressions congolaises.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-3xl font-bold text-green-700 mb-3">🎭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Programmation Culturelle</h3>
              <p className="text-gray-700">
                Événements, résidences d'artistes, formations et ateliers pour cultiver la création 
                et l'engagement auprès de tous les publics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directions & Équipe */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              GOUVERNANCE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Directions & Équipe
            </h2>
            <p className="text-lg text-gray-600">
              Le CCCZ est piloté par des directions spécialisées travaillant en coordination pour réaliser sa mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Direction Générale',
                abbr: 'DG',
                role: 'Pilotage stratégique & gouvernance institutionnelle',
                icon: '🎯',
              },
              {
                name: 'Direction Activités & Création Culturelle',
                abbr: 'DACPA',
                role: 'Programmation, événements, arts vivants',
                icon: '🎪',
              },
              {
                name: 'Direction Financière',
                abbr: 'DF',
                role: 'Gestion budgétaire & ressources',
                icon: '💰',
              },
              {
                name: 'Direction Administration',
                abbr: 'DA',
                role: 'Ressources humaines, infrastructures, logistique',
                icon: '🏢',
              },
              {
                name: 'Bibliothèque & Archives',
                abbr: 'Biblio',
                role: 'Préservation numérique, collections, recherche',
                icon: '📖',
              },
              {
                name: 'Communication & Digital',
                abbr: 'Com',
                role: 'Web, réseaux sociaux, relations publiques',
                icon: '📱',
              },
            ].map((dir) => (
              <div key={dir.abbr} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-700">
                <div className="text-3xl mb-3">{dir.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{dir.name}</h3>
                <p className="text-sm text-gray-600 font-semibold mb-3">({dir.abbr})</p>
                <p className="text-sm text-gray-700">{dir.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-green-50 rounded-lg border-l-4 border-green-700">
            <p className="text-gray-700">
              <strong>Coordination Institutionnelle:</strong> Les directions travaillent sous la gouvernance du CODEX (système de coordination des agents IA CCCZ), 
              respectant une hiérarchie décisionnelle claire et une traçabilité complète de toute action institutionnelle.
            </p>
          </div>
        </div>
      </section>

      {/* Partenariats */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              RÉSEAU
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partenaires & Collaborations
            </h2>
            <p className="text-lg text-gray-600">
              Le CCCZ s'inscrit dans un écosystème de collaborations nationales et internationales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-green-700 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Partenaires Institutionnels</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Ministère de la Culture (RDC)</li>
                <li>• Institutions culturelles congolaises</li>
                <li>• Universités & écoles d'arts</li>
                <li>• Organisations internationales (UNESCO, etc.)</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-700 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Partenaires Privés</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Sponsors & mécènes culturels</li>
                <li>• Entreprises technologiques</li>
                <li>• Médias & plateformes numériques</li>
                <li>• Collectifs d'artistes & créateurs</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="/partenaires" className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition">
              Découvrir tous nos partenaires
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez notre communauté culturelle
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Que vous soyez artiste, partenaire, visiteur ou chercheur, le CCCZ vous accueille pour 
            explorer, créer et transmettre la richesse culturelle congolaise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/evenements" className="px-6 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-gray-100 transition">
              Voir nos événements
            </a>
            <a href="/contact" className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-700 transition">
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
