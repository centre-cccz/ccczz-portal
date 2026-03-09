import React from 'react';
import Image from 'next/image';

export default function VisitorsSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image src="/images/galerie/exposition01.jpg" alt="Exposition CCCZ" width={900} height={600} className="w-full h-auto object-cover" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold mb-4">VISITEURS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visitez le Centre Culturel Congolais Le Zoo</h2>
            <p className="text-gray-700 mb-6">
              <strong>« Le CZoo » redeviendra le cœur battant de la culture congolaise</strong> — un lieu de mémoire, d'apprentissage
              et de création artistique au service de la jeunesse et du rayonnement du Congo. Notre mission : réhabiliter les infrastructures,
              moderniser l'accueil du public et des artistes, et offrir une programmation artistique diversifiée dans un environnement
              accueillant et durable.
            </p>
            <p className="text-gray-700 mb-6"><strong>Horaires d'accueil :</strong> Mar–Dim 10:00–18:00. Fermé le lundi. Entrée libre pour les expositions permanentes; tarifs modulés pour expositions spéciales et ateliers.</p>

            <ul className="space-y-3 text-gray-600 mb-6">
              <li>🎟️ Billetterie sur place et réservation en ligne pour groupes</li>
              <li>🗺️ Visites guidées: demandes via <a href="/contact" className="text-green-700 font-semibold">contact</a></li>
              <li>♿ Accessibilité: accès PMR et services adaptés</li>
            </ul>

            <div className="flex gap-4">
              <a href="/espaces" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition">Réserver une visite</a>
              <a href="/evenements" className="px-6 py-3 border border-gray-200 rounded-lg text-gray-800 font-semibold hover:bg-gray-50 transition">Voir les événements</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
