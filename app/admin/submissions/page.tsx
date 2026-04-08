'use client';

import Link from 'next/link';

export default function AdminSubmissionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des soumissions</h1>
          <p className="text-gray-600 mb-6">
            Cette page centralise les propositions d'artistes, d'événements et de contenus envoyées par les utilisateurs.
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-lg mb-2">Fonctions à venir</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Revoir les soumissions d'artistes</li>
              <li>Accepter ou refuser</li>
              <li>Attribuer un statut de publication</li>
            </ul>
          </div>

          <div className="mt-6">
            <Link href="/admin/dashboard" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
