import React from 'react';

interface PartnerCardProps {
    name: string;
    category: 'institutional' | 'cultural' | 'commercial' | 'educational';
    role: string;
    description: string;
    focused_areas?: string[];
    website?: string;
    contact?: string;
}

export default function PartnerCard({
    name,
    category,
    role,
    description,
    focused_areas = [],
    website,
    contact,
}: PartnerCardProps) {
    const categoryColors = {
        institutional: 'border-l-4 border-green-700',
        cultural: 'border-l-4 border-amber-600',
        commercial: 'border-l-4 border-blue-600',
        educational: 'border-l-4 border-purple-600',
    };

    const categoryBadgeColors = {
        institutional: 'bg-green-100 text-green-800',
        cultural: 'bg-amber-100 text-amber-800',
        commercial: 'bg-blue-100 text-blue-800',
        educational: 'bg-purple-100 text-purple-800',
    };

    return (
        <article className={`${categoryColors[category]} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 bg-white`}>
            {/* Category Badge */}
            <div className="flex justify-between items-start mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryBadgeColors[category]}`}>
                    {role}
                </span>
            </div>

            {/* Partner Name */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{description}</p>

            {/* Focused Areas */}
            {focused_areas.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Domaines d'action :</p>
                    <div className="flex flex-wrap gap-2">
                        {focused_areas.map((area, idx) => (
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

            {/* Contact Links */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                {website && (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 hover:text-green-900 font-medium"
                    >
                        Site web →
                    </a>
                )}
                {contact && (
                    <a
                        href={`mailto:${contact}`}
                        className="text-sm text-green-700 hover:text-green-900 font-medium"
                    >
                        Contacter →
                    </a>
                )}
            </div>
        </article>
    );
}
