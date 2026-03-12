import React from 'react';

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="flex justify-center mb-4">
                <div className="text-5xl">{icon}</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

export default function PartnershipBenefitsSection() {
    const benefits = [
        {
            icon: '🎯',
            title: 'Visibilité Maximale',
            description:
                'Exposez votre organisation à une audience diversifiée de passionnés de culture et d\'amateurs d\'arts.',
        },
        {
            icon: '🤝',
            title: 'Collaborations Riches',
            description:
                'Travaillez avec des artistes, des institutions et des créatifs impliqués dans l\'écosystème culturel congolais.',
        },
        {
            icon: '🌍',
            title: 'Impact Communautaire',
            description:
                'Contribuez à la préservation et à la promotion du patrimoine culturel congolais pour les générations futures.',
        },
        {
            icon: '📈',
            title: 'Croissance Mutuelle',
            description:
                'Participez à des initiatives de développement culturel qui renforcent votre crédibilité et votre présence.',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
                        💡 Avantages du Partenariat
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi devenir partenaire ?</h2>
                    <p className="text-gray-600 text-lg">
                        Le CCCZ offre des opportunités uniques de collaboration et d'impact. Rejoignez un réseau engagé
                        en faveur de la culture et de l'innovation artistique.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, idx) => (
                        <BenefitCard
                            key={idx}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
