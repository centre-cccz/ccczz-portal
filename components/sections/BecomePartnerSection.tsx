import React from 'react';

export default function BecomePartnerSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-green-700 to-green-900 text-white">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block px-4 py-2 bg-green-600 rounded-full text-sm font-semibold mb-4">
                        🚀 Nouveau Partenariat
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Devenez partenaire du CCCZ</h2>
                    <p className="text-xl text-green-100 mb-8 leading-relaxed">
                        Nous finançons une réhabilitation majeure : acquisition d'équipements techniques (son, lumière, climatisation),
                        amélioration des assises et de la signalétique, aménagement paysager durable, et renforcement de la formation artistique.
                        Rejoignez-nous en tant qu'acteur clé du rayonnement culturel congolais !
                    </p>

                    {/* Partnership Types */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-green-600 bg-opacity-30 backdrop-blur-sm p-6 rounded-lg border border-green-400">
                            <div className="text-4xl mb-3">💰</div>
                            <h3 className="font-bold text-lg mb-2">Appui Financier</h3>
                            <p className="text-green-100 text-sm">Financement des travaux et équipements techniques du centre réhabilité</p>
                        </div>
                        <div className="bg-green-600 bg-opacity-30 backdrop-blur-sm p-6 rounded-lg border border-green-400">
                            <div className="text-4xl mb-3">📢</div>
                            <h3 className="font-bold text-lg mb-2">Soutien aux Événements</h3>
                            <p className="text-green-100 text-sm">Naming, co-branding, mécénat artistique et programmation diversifiée</p>
                        </div>
                        <div className="bg-green-600 bg-opacity-30 backdrop-blur-sm p-6 rounded-lg border border-green-400">
                            <div className="text-4xl mb-3">🤝</div>
                            <h3 className="font-bold text-lg mb-2">Partenariats Techniques</h3>
                            <p className="text-green-100 text-sm">Collaborations institutionnelles avec ambassades, ONG et organisations culturelles</p>
                        </div>
                    </div>

                    {/* Partner Benefits */}
                    <div className="bg-green-600 bg-opacity-20 backdrop-blur-sm p-8 rounded-lg border border-green-400 mb-8">
                        <h3 className="text-2xl font-bold mb-6">✨ Bénéfices pour nos Sponsors</h3>
                        <ul className="text-left space-y-3 text-green-50">
                            <li>🎬 <strong>Visibilité Institutionnelle</strong> — Logo, présence aux événements et couverture médias</li>
                            <li>🎟️ <strong>Accès Privilégié</strong> — Réserve de places et événements exclusifs du centre</li>
                            <li>🌟 <strong>Image Valorisée</strong> — Reconnaissance en tant qu'acteur du rayonnement culturel congolais</li>
                        </ul>
                    </div>

                    {/* Contact CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact?userType=partner"
                            className="px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition shadow-lg"
                        >
                            Nous Contacter
                        </a>
                        <a
                            href="#partenaires"
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-700 transition"
                        >
                            Voir nos Partenaires
                        </a>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 pt-12 border-t border-green-500">
                        <p className="text-green-100 text-sm mb-4">Des questions sur les partenariats ?</p>
                        <p className="text-lg font-semibold">
                            📧 <a href="mailto:partnerships@cccz.cd" className="hover:text-white transition">
                                partnerships@cccz.cd
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
