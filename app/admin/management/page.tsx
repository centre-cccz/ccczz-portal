'use client';

import Link from 'next/link';

export default function AdminManagementPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion transverse</h1>
          <p className="text-gray-600 mb-6">
            Espace de supervision pour les rôles DG et Administration. Vous pouvez consulter les fonctions transversales du CCCZ.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <h2 className="font-semibold text-lg mb-2">Actions</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Voir l’état des directions</li>
                <li>Consulter les rapports globaux</li>
                <li>Accéder aux audits</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-lg mb-2">Navigation</h2>
              <Link href="/admin/users" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                Créer un compte gestionnaire
              </Link>
            </div>
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
