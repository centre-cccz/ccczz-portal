/*
META
status: BROUILLON
directions_notified: ["Communication", "DACPA", "Direction Générale"]
sources: ["docs/CODEX_INSTRUCTIONS.md", "docs/CHARTE_INSTITUTIONNELLE.md"]
next_steps: ["Soumettre en validation via notification template", "Attendre 48h"]
*/

import React from 'react';
import Link from 'next/link';

export default function ActualitesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Actualités — Centre Culturel Congolais Le Zoo (BROUILLON)</h1>

      <p className="text-gray-700 mb-6">Ce contenu est un brouillon préparé par l'Agent Éditeur. Il respecte la charte institutionnelle et attend validation des directions listées dans les métadonnées.</p>

      <section>
        <article className="mb-6 border-b pb-4">
          <h2 className="text-xl font-medium">Nouvelle exposition de photographies congolaises (exemple)</h2>
          <p className="text-sm text-gray-600">Brouillon — Date proposée: 15 mars 2026 — Mots-clés: exposition, photographie, culture</p>
          <p className="mt-2">Chapeau: Le Centre Culturel Congolais Le Zoo présente une sélection d'œuvres photographiques contemporaines mettant en valeur la diversité culturelle du Congo. Cette entrée est un brouillon — validation requise.</p>
          <p className="mt-2 text-sm text-gray-500">Sources: Ministère de la Culture (site officiel), communiqués partenaires (liens à ajouter lors de la validation)</p>
          <Link href="/actualites/exposition-photographie"><a className="text-cccz-accent mt-2 inline-block">Lire le brouillon complet →</a></Link>
        </article>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Prochaines étapes</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Soumettre ce brouillon à Communication & DACPA</li>
            <li>Joindre sources officielles et visuels</li>
            <li>Attendre validation (48h recommandées)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
