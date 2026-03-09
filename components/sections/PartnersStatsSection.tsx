import React from 'react';

export default function PartnersStatsSection() {
    const stats = [
        {
            number: '10+',
            label: 'Partenaires actifs',
            description: 'Institutions et organisations collaborant avec nous',
        },
        {
            number: '4',
            label: 'Catégories',
            description: 'Institutionnel • Culturel • Commercial • Éducatif',
        },
        {
            number: '50+',
            label: 'Projets réalisés',
            description: 'Événements, expositions et initiatives communes',
        },
        {
            number: '100k+',
            label: 'Bénéficiaires',
            description: 'Visiteurs, artistes et communautés impactés',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Un réseau qui grandit
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Découvrez l'impact de nos collaborations et rejoignez un mouvement de promotion culturelle.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-6">
                            <div className="text-5xl font-bold text-green-700 mb-2">{stat.number}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{stat.label}</h3>
                            <p className="text-gray-600 text-sm">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
