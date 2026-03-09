import React from 'react';

export default function PartnersHeroSection() {
    return (
        <section className="relative w-full min-h-96 bg-gradient-to-b from-green-800 to-green-900 flex items-center overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="400" height="400" fill="url(#grid)" />
                </svg>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-20 md:py-24 relative z-10">
                <div className="max-w-2xl">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
                        ✨ Un Héritage depuis 1956
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Réhabilitation & Relance du Cœur Culturel Congolais
                    </h1>
                    <p className="text-lg text-green-100 mb-8 leading-relaxed">
                        Construit en 1956, le Centre Culturel Congolais Le Zoo est un haut lieu historique des arts du spectacle.
                        Devenu centre national de promotion de la culture, il a accueilli des artistes légendaires — James Brown,
                        Johnny Hallyday, Miriam Makeba — et d'innombrables troupes congolaises. Aujourd'hui, nous entreprendons
                        une vaste réhabilitation pour restaurer ce monument culturel, renforcer ses capacités et relancer ses activités
                        au service de la jeunesse et du rayonnement du Congo.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8 pt-4">
                        <div>
                            <div className="text-3xl font-bold text-white">10+</div>
                            <p className="text-green-100 text-sm">Partenaires actifs</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">4</div>
                            <p className="text-green-100 text-sm">Catégories de partenaires</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">2026</div>
                            <p className="text-green-100 text-sm">Année d'expansion</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
