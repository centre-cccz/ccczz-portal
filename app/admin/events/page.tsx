'use client';

import Link from 'next/link';

export default function AdminEventsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des événements</h1>
          <p className="text-gray-600 mb-6">
            Interface de gestion des événements culturels. Cette page vous permettrait de créer, modifier et publier des événements.
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-lg mb-2">Actions prévues</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Créer un événement</li>
              <li>Modifier les détails</li>
              <li>Gérer le statut de publication</li>
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
