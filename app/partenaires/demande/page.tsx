'use client';

import React from 'react';
import Link from 'next/link';
import PartnershipRequestForm from '@/components/forms/PartnershipRequestForm';

export default function BecomPartnerPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-gradient-to-r from-green-700 to-green-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl">
                        <Link href="/partenaires" className="inline-block text-green-100 hover:text-white mb-4">
                            ← Retour aux partenaires
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Demande de Partenariat</h1>
                        <p className="text-lg text-green-100">
                            Vous représentez une organisation et souhaitez collaborer avec le Centre Culturel Congolais Le Zoo ?
                            Remplissez ce formulaire pour nous soumettre votre demande de partenariat.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-6">
                    <PartnershipRequestForm />
                </div>
            </section>

            {/* Additional Information */}
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Types of Partnerships */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types de Partenariats</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg border-l-4 border-green-700">
                                    <h3 className="font-bold text-gray-900 mb-2">🎯 Partenariat Stratégique</h3>
                                    <p className="text-gray-600 text-sm">
                                        Collaboration long terme avec reconnaissance mutuelle et visibilité premium auprès de notre audience.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg border-l-4 border-green-700">
                                    <h3 className="font-bold text-gray-900 mb-2">💼 Sponsorships</h3>
                                    <p className="text-gray-600 text-sm">
                                        Support financier d'événements, d'expositions et de projets culturels du CCCZ.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg border-l-4 border-green-700">
                                    <h3 className="font-bold text-gray-900 mb-2">📢 Partenariat Média</h3>
                                    <p className="text-gray-600 text-sm">
                                        Collaboration pour la promotion, la couverture médiatique et le rayonnement des initiatives.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg border-l-4 border-green-700">
                                    <h3 className="font-bold text-gray-900 mb-2">🤝 Collaboration Projet</h3>
                                    <p className="text-gray-600 text-sm">
                                        Projets spécifiques et initiatives conjointes alignées avec vos objectifs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Process & FAQ */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avant de soumettre votre demande</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-2">📋 Préparez vos informations</h3>
                                    <p className="text-gray-600 text-sm">
                                        Ayez à portée de main la description de votre organisation et vos objectifs de partenariat.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-2">🎯 Identifiez vos domaines d'intérêt</h3>
                                    <p className="text-gray-600 text-sm">
                                        Choisissez les domaines de collaboration qui correspondent à vos activités (événements, formations, etc.).
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-2">⏱️ Délai de réponse</h3>
                                    <p className="text-gray-600 text-sm">
                                        Notre équipe examinera votre demande dans les 5 jours ouvrables et vous contactera.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-2">💬 Pour discuter directement</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Vous préférez nous parler directement ? Contactez notre équipe de partenariats :
                                    </p>
                                    <p className="text-green-700 font-bold">
                                        📧 partnerships@cccz.cd<br />
                                        📞 +243 XXX XXX XXX
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 md:py-16 bg-green-700 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Des questions avant de soumettre votre demande ?</h2>
                    <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                        N'hésitez pas à nous contacter directement pour discuter de vos besoins spécifiques.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition"
                        >
                            Nous contacter
                        </Link>
                        <Link
                            href="/partenaires"
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-700 transition"
                        >
                            Voir nos partenaires
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
