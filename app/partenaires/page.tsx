'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PartnersHeroSection from '@/components/sections/PartnersHeroSection';
import PartnershipBenefitsSection from '@/components/sections/PartnershipBenefitsSection';
import PartnersGridSection from '@/components/sections/PartnersGridSection';
import PartnersStatsSection from '@/components/sections/PartnersStatsSection';
import BecomePartnerSection from '@/components/sections/BecomePartnerSection';
import partners from '@/lib/mock-data/partners';

export default function PartenairesPage() {
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
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === null
                                    ? 'bg-green-700 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            Tous les partenaires
                        </button>
                        <button
                            onClick={() => setSelectedCategory('institutional')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'institutional'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            🏛️ Institutionnels
                        </button>
                        <button
                            onClick={() => setSelectedCategory('cultural')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'cultural'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            🎨 Culturels
                        </button>
                        <button
                            onClick={() => setSelectedCategory('commercial')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'commercial'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            💼 Commerciaux
                        </button>
                        <button
                            onClick={() => setSelectedCategory('educational')}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'educational'
                                    ? 'bg-green-700 text-white'
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

            {/* Call to Action Section */}
            <BecomePartnerSection />

            {/* Additional Information Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column - Process */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Comment ça marche ?</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        step: '1',
                                        title: 'Prenez contact',
                                        description: 'Envoyez-nous un message ou appelez-nous pour discuter de vos objectifs.',
                                    },
                                    {
                                        step: '2',
                                        title: 'Explorez les options',
                                        description: 'Découvrez les différentes formes de partenariat adaptées à votre profil.',
                                    },
                                    {
                                        step: '3',
                                        title: 'Signez un accord',
                                        description: 'Établissez un partenariat officiel avec les termes convenus.',
                                    },
                                    {
                                        step: '4',
                                        title: 'Collaborez',
                                        description: 'Travaillez ensemble pour promouvoir la culture et l\'innovation.',
                                    },
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                                                {item.step}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - FAQ */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        q: 'Quels types de partenariats proposez-vous ?',
                                        a: 'Nous offrons des partenariats stratégiques, des sponsorships, et des collaborations projet adaptés à vos besoins.',
                                    },
                                    {
                                        q: 'Quel est le coût d\'un partenariat ?',
                                        a: 'Les tarifs varient selon le type et la durée du partenariat. Contactez-nous pour un devis personnalisé.',
                                    },
                                    {
                                        q: 'Comment pouvez-vous m\'aider à atteindre mon audience ?',
                                        a: 'Nous offrons une visibilité sur notre site, nos événements et nos réseaux sociaux.',
                                    },
                                    {
                                        q: 'Puis-je être partenaire d\'un projet spécifique ?',
                                        a: 'Oui, nous proposons des partenariats par projet. Discutez directement avec notre équipe.',
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                                        <p className="text-gray-600 text-sm">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-green-800 to-green-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt(e) à collaborer ?</h2>
                    <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                        Rejoignez notre réseau de partenaires et contribuez à la promotion de la culture congolaise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact?userType=partner"
                            className="px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition shadow-lg"
                        >
                            Demander un Partenariat
                        </Link>
                        <a
                            href="mailto:partnerships@cccz.cd"
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-700 transition"
                        >
                            Nous Écrire
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
