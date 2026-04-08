'use client';

import Link from 'next/link';

export default function AdminPartnersPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des partenaires</h1>
          <p className="text-gray-600 mb-6">
            Cette page permet de gérer les partenaires institutionnels et culturels. Vous pouvez créer,
            modifier ou archiver des partenaires depuis cette interface.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <h2 className="font-semibold text-lg mb-2">Fonctionnalités prévues</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Voir la liste des partenaires</li>
                <li>Ajouter un nouveau partenaire</li>
                <li>Modifier les informations de contact</li>
                <li>Masquer ou publier un partenaire</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-lg mb-2">Accès rapide</h2>
              <Link href="/admin/dashboard" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg">
                Retour au dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
