'use client';

import Link from 'next/link';

export default function AdminContactsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des contacts</h1>
          <p className="text-gray-600 mb-6">
            Vous pouvez consulter et filtrer les demandes de contact envoyées par les visiteurs du site.
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-lg mb-2">Actions possibles</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Voir les messages récents</li>
              <li>Marquer comme traité</li>
              <li>Exporter les demandes</li>
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
