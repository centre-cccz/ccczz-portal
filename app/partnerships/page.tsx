'use client';

import React, { useState } from 'react';
import PartnersHeroSection from '@/components/sections/PartnersHeroSection';
import PartnershipBenefitsSection from '@/components/sections/PartnershipBenefitsSection';
import PartnersGridSection from '@/components/sections/PartnersGridSection';
import PartnersStatsSection from '@/components/sections/PartnersStatsSection';
import BecomePartnerSection from '@/components/sections/BecomePartnerSection';
import partners from '@/lib/mock-data/partners';

export default function PartnershipsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter partners by category if selected
    const filteredPartners = selectedCategory
        ? partners.filter((p) => p.category === selectedCategory)
        : partners;

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <PartnersHeroSection />

            {/* Stats Section */}
            <PartnersStatsSection />

            {/* Benefits Section */}
            <PartnershipBenefitsSection />

            {/* Partners Grid Section */}
            <section id="partenaires" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Découvrez nos partenaires
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Un réseau diversifié d'organisations engagées pour la promotion de la culture congolaise.
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === null
                                ? 'bg-green-700 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            Tous les partenaires
                        </button>
                        <button
                            onClick={() => setSelectedCategory('institutional')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'institutional'
                                ? 'bg-green-700 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            🏛️ Institutionnels
                        </button>
                        <button
                            onClick={() => setSelectedCategory('cultural')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'cultural'
                                ? 'bg-green-700 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            🎨 Culturels
                        </button>
                        <button
                            onClick={() => setSelectedCategory('commercial')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'commercial'
                                ? 'bg-green-700 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            💼 Commerciaux
                        </button>
                        <button
                            onClick={() => setSelectedCategory('educational')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'educational'
                                ? 'bg-green-700 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            📚 Académiques
                        </button>
                    </div>

                    {/* Display filtered count */}
                    <div className="text-center mb-8 text-gray-600 text-sm">
                        {filteredPartners.length} partenaire(s) affichés
                    </div>

                    {/* Partners Display */}
                    <PartnersGridSection partners={filteredPartners} />
                </div>
            </section>

            {/* Become Partner Section */}
            <BecomePartnerSection />
        </main>
    );
}
