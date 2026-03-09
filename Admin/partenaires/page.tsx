'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import partners from '@/lib/mock-data/partners';

export default function AdminPartnersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    // Filter partners
    const filteredPartners = partners.filter((partner) => {
        const matchesSearch =
            partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? partner.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const categoryColors: any = {
        institutional: 'text-green-700 bg-green-50',
        cultural: 'text-amber-700 bg-amber-50',
        commercial: 'text-blue-700 bg-blue-50',
        educational: 'text-purple-700 bg-purple-50',
    };

    const categoryBorders: any = {
        institutional: 'border-l-4 border-green-700',
        cultural: 'border-l-4 border-amber-600',
        commercial: 'border-l-4 border-blue-600',
        educational: 'border-l-4 border-purple-600',
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <Link href="/admin" className="text-green-700 hover:text-green-900 mb-2 inline-block">
                            ← Back to Admin
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestion des Partenaires</h1>
                        <p className="text-gray-600 mt-2">Visualisez et gérez tous les partenaires du CCCZ</p>
                    </div>
                    <button className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-900 transition">
                        + Ajouter Partenaire
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{partners.length}</div>
                        <p className="text-gray-600 text-sm">Total partenaires</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-700">
                            {partners.filter((p) => p.category === 'institutional').length}
                        </div>
                        <p className="text-gray-600 text-sm">Institutionnels</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-amber-700">
                            {partners.filter((p) => p.category === 'cultural').length}
                        </div>
                        <p className="text-gray-600 text-sm">Culturels</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-700">
                            {partners.filter((p) => p.category === 'commercial').length}
                        </div>
                        <p className="text-gray-600 text-sm">Commerciaux</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                            <input
                                type="text"
                                placeholder="Nom, rôle..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <select
                                value={filterCategory || ''}
                                onChange={(e) => setFilterCategory(e.target.value || null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            >
                                <option value="">Tous les types</option>
                                <option value="institutional">Institutionnel</option>
                                <option value="cultural">Culturel</option>
                                <option value="commercial">Commercial</option>
                                <option value="educational">Académique</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Partners Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Catégorie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rôle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Domaines</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPartners.length > 0 ? (
                                    filteredPartners.map((partner) => (
                                        <tr key={partner.id} className={`${categoryBorders[partner.category]} hover:bg-gray-50`}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{partner.name}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[partner.category]}`}>
                                                    {partner.category === 'institutional' && '🏛️'}
                                                    {partner.category === 'cultural' && '🎨'}
                                                    {partner.category === 'commercial' && '💼'}
                                                    {partner.category === 'educational' && '📚'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{partner.role}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex flex-wrap gap-1">
                                                    {partner.focused_areas?.slice(0, 2).map((area, idx) => (
                                                        <span key={idx} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                                                            {area}
                                                        </span>
                                                    ))}
                                                    {partner.focused_areas && partner.focused_areas.length > 2 && (
                                                        <span className="inline-block px-2 py-1 text-xs text-gray-600">
                                                            +{partner.focused_areas.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button className="text-green-700 hover:text-green-900 font-medium mr-3">Edit</button>
                                                <button className="text-red-700 hover:text-red-900 font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                                            Aucun partenaire trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Info */}
                <div className="mt-4 text-sm text-gray-600">
                    Affichage de {filteredPartners.length} sur {partners.length} partenaire(s)
                </div>
            </div>
        </div>
    );
}
