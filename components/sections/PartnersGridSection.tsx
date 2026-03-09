import React from 'react';
import Image from 'next/image';

export default function PartnersGridSection({ partners }: any) {
    const partnersGrouped = partners.reduce(
        (acc: any, partner: any) => {
            const category = partner.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(partner);
            return acc;
        },
        {}
    );

    const categoryTitles = {
        institutional: {
            title: '🏛️ Partenaires Institutionnels',
            description: 'Soutien officiel et reconnaissance institutionnelle',
        },
        cultural: {
            title: '🎨 Partenaires Culturels',
            description: 'Collaboration pour la promotion des arts',
        },
        commercial: {
            title: '💼 Sponsors et Partenaires Commerciaux',
            description: 'Soutien financier et ressources',
        },
        educational: {
            title: '📚 Partenaires Académiques',
            description: 'Formation et développement des talents',
        },
    };

    const categoryEmojis: any = {
        institutional: '🏛️',
        cultural: '🎨',
        commercial: '💼',
        educational: '📚',
    };

    const categoryColors: any = {
        institutional: 'border-green-700',
        cultural: 'border-amber-500',
        commercial: 'border-blue-600',
        educational: 'border-purple-600',
    };

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                {Object.entries(partnersGrouped).map(([category, categoryPartners]: any) => (
                    <div key={category} className="mb-16">
                        {/* Category Header */}
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {categoryTitles[category as keyof typeof categoryTitles]?.title ||
                                    `${categoryEmojis[category]} Partenaires`}
                            </h2>
                            <p className="text-gray-600">
                                {categoryTitles[category as keyof typeof categoryTitles]?.description}
                            </p>
                            <div className="h-1 w-16 bg-green-700 mt-4 rounded"></div>
                        </div>

                        {/* Partners Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryPartners.map((partner: any) => (
                                <div
                                    key={partner.id}
                                    className={`bg-white border-l-4 ${categoryColors[partner.category] || 'border-green-700'} rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 p-6`}
                                >
                                    {/* Badge */}
                                    <div className="mb-3 flex items-center justify-between gap-4">
                                        <span className="inline-block px-3 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full">
                                            {partner.role}
                                        </span>
                                        {partner.logo && (
                                            <div className="ml-auto">
                                                <Image src={partner.logo} alt={partner.name} width={96} height={36} className="object-contain" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{partner.description}</p>

                                    {/* Focus Areas */}
                                    {partner.focused_areas && partner.focused_areas.length > 0 && (
                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                            <p className="text-xs font-semibold text-gray-500 mb-2">DOMAINES</p>
                                            <div className="flex flex-wrap gap-1">
                                                {partner.focused_areas.slice(0, 3).map((area: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                                    >
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="flex gap-2">
                                        {partner.website && (
                                            <a
                                                href={partner.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-center px-3 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded font-medium transition"
                                            >
                                                Visiter
                                            </a>
                                        )}
                                        {partner.contact && (
                                            <a
                                                href={`mailto:${partner.contact}`}
                                                className="flex-1 text-center px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium transition"
                                            >
                                                Contacter
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
