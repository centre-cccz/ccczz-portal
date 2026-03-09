import React from 'react';
import Link from 'next/link';
import PartnerCard from '../cards/PartnerCard';
import partners from '@/lib/mock-data/partners';

export default function PartnersPromotionSection() {
    // Get 6 featured partners
    const featuredPartners = partners.slice(0, 6);

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-3">
                            🤝 Partenaires
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Nos partenaires stratégiques
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Découvrez les institutions et organisations qui collaborent avec le CCCZ.
                        </p>
                    </div>
                    <Link
                        href="/partenaires"
                        className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-900 transition"
                    >
                        Voir tous les partenaires →
                    </Link>
                </div>

                {/* Partners Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {featuredPartners.map((partner) => (
                        <PartnerCard key={partner.id} name={partner.name} role={partner.role} />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-md text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Devenez partenaire</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Vous représentez une institution, une entreprise ou une organisation culturelle ?
                        Collaborez avec nous pour promouvoir la culture congolaise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/partenaires#partenaires"
                            className="px-6 py-3 border-2 border-green-700 text-green-700 font-bold rounded-lg hover:bg-green-50 transition"
                        >
                            Explorer les partenariats
                        </Link>
                        <Link
                            href="/contact?userType=partner"
                            className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg hover:bg-green-900 transition"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
