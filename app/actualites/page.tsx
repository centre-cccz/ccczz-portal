/*
META
status: MODÈLE — Pages produit générées dynamiquement depuis CMS
directions_validated: ["Communication", "DACPA", "Direction Générale"]
sources: ["docs/CODEX_INSTRUCTIONS.md", "docs/CHARTE_INSTITUTIONNELLE.md"]
next_steps: ["Intégrer CMS backend pour contenu dynamique", "Implémenter pagination", "Ajouter recherche/filtres"]
*/

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Actualités | Centre Culturel Congolais Le Zoo',
  description: 'Restez informé des dernières nouvelles, expositions, événements et actualités du Centre Culturel Congolais Le Zoo.',
  keywords: ['actualités', 'news', 'événements', 'exposition', 'CCCZ'],
  openGraph: {
    title: 'Actualités | CCCZ',
    description: 'Toutes les actualités et nouvelles du CCCZ',
    type: 'website',
    locale: 'fr_CD',
  },
};

interface NewsItem {
  id: string;
  date: string;
  category: 'exposition' | 'événement' | 'atelier' | 'partenariat' | 'patrimoine' | 'ressource';
  title: string;
  excerpt: string;
  image?: string;
  featured?: boolean;
  readTime?: string;
}

const sampleNews: NewsItem[] = [
  {
    id: '1',
    date: '8 Février 2026',
    category: 'événement',
    title: 'SEFICO 3 — Semaine du Film Congolais',
    excerpt: 'Célébration annuelle du cinéma congolais avec diffusion de films et rencontres avec réalisateurs.',
    image: '/images/evenements/projet_sefico_avril_2026.png',
    featured: true,
    readTime: '5 min de lecture',
  },
  {
    id: '2',
    date: '6 Février 2026',
    category: 'exposition',
    title: 'Nouvelle exposition: Photographies congolaises contempraines',
    excerpt: 'Découvrez une sélection d\'œuvres photographiques mettant en valeur la diversité culturelle du Congo.',
    featured: false,
    readTime: '3 min de lecture',
  },
  {
    id: '3',
    date: '4 Février 2026',
    category: 'atelier',
    title: 'Ateliers numériques: Programmation et design gratuit',
    excerpt: 'Rejoignez nos ateliers gratuits destinés aux jeunes (14-30 ans) pour découvrir les technologies créatives.',
    featured: false,
    readTime: '2 min de lecture',
  },
  {
    id: '4',
    date: '1 Février 2026',
    category: 'partenariat',
    title: 'Nouveau partenariat avec l\'UNESCO pour la préservation du patrimoine',
    excerpt: 'Le CCCZ renforce sa collaboration avec l\'UNESCO pour numériser et préserver le patrimoine culturel congolais.',
    featured: false,
    readTime: '4 min de lecture',
  },
  {
    id: '5',
    date: '28 Janvier 2026',
    category: 'ressource',
    title: 'Accès à la Bibliothèque Numérique: Phase pilote lancée',
    excerpt: 'Les premiers contenus disponibles en ligne — Archives photographiques, manuscrits et enregistrements sonores.',
    featured: false,
    readTime: '6 min de lecture',
  },
];

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  exposition: { bg: 'bg-purple-100', text: 'text-purple-800', label: '🎨 Exposition' },
  événement: { bg: 'bg-green-100', text: 'text-green-800', label: '🎪 Événement' },
  atelier: { bg: 'bg-blue-100', text: 'text-blue-800', label: '✏️ Atelier' },
  partenariat: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🤝 Partenariat' },
  patrimoine: { bg: 'bg-amber-100', text: 'text-amber-800', label: '📚 Patrimoine' },
  ressource: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: '💾 Ressource' },
};

export default function ActualitesPage() {
  const featuredNews = sampleNews.filter((n) => n.featured)[0];
  const otherNews = sampleNews.filter((n) => !n.featured);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              ACTUALITÉS & NOUVELLES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Suivez les actualités du CCCZ
            </h1>
            <p className="text-lg text-green-100">
              Expositions, événements, ateliers, partenariats et ressources — Toute l'actualité du Centre Culturel Congolais Le Zoo.
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section className="py-12 md:py-16 bg-gray-50 border-b-4 border-green-700">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {featuredNews.image && (
                <div className="relative h-64 md:h-96 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[featuredNews.category].bg} ${categoryColors[featuredNews.category].text}`}>
                    {categoryColors[featuredNews.category].label}
                  </span>
                  <span className="text-sm text-gray-600">📅 {featuredNews.date}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h2>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {featuredNews.excerpt}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition">
                    Lire l'article complet
                  </a>
                  <span className="text-sm text-gray-600 pt-3">
                    ⏱️ {featuredNews.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dernières actualités</h2>
            <div className="w-16 h-1 bg-green-700 rounded" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Category & Date */}
                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[news.category].bg} ${categoryColors[news.category].text}`}>
                      {categoryColors[news.category].label}
                    </span>
                    <span className="text-xs text-gray-600">📅 {news.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {news.excerpt}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {news.readTime || '2-3 min'}
                  </span>
                  <a href="#" className="text-green-700 font-semibold hover:text-green-600 transition">
                    Lire →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 md:py-24 bg-green-50 border-t-4 border-green-700">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Restez informé
            </h2>
            <p className="text-gray-700">
              Abonnez-vous à notre newsletter pour recevoir les dernières actualités, expositions et événements en avant-première.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-700"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              S'abonner
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-3">
            Nous respectons votre vie privée. Désinscription possible à tout moment.
          </p>
        </div>
      </section>

      {/* Archive & Tags */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Archive */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Archives</h3>
              <div className="space-y-3">
                {['Février 2026', 'Janvier 2026', 'Décembre 2025', 'Novembre 2025'].map((month) => (
                  <a
                    key={month}
                    href="#"
                    className="block p-3 rounded hover:bg-gray-100 transition group"
                  >
                    <span className="text-gray-700 group-hover:text-green-700 font-semibold">
                      {month}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Parcourir par catégorie</h3>
              <div className="space-y-3">
                {Object.entries(categoryColors).map(([key, color]) => (
                  <a
                    key={key}
                    href="#"
                    className={`block p-3 rounded ${color.bg} ${color.text} font-semibold hover:shadow-md transition`}
                  >
                    {color.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vous avez une actualité à partager ?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Si vous travaillez avec le CCCZ ou avez une annonce pertinente, nous serions ravis de la publier.
          </p>
          <a href="/contact" className="inline-block px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-700 transition">
            Nous contacter
          </a>
        </div>
      </section>
    </main>
  );
}
