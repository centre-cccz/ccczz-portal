/*
META
status: BROUILLON
directions_notified: ["DF", "Communication", "Direction Générale"]
sources: ["docs/DATABASE_ARCHITECTURE_CCCZ.md", "docs/CODEX_INSTRUCTIONS.md"]
next_steps: ["Soumettre au DF pour validation tarification", "Joindre règles tarifaires officielles"]
*/

import React from 'react';
import Link from 'next/link';

export default function BilletteriePage() {
    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-4">Billetterie (BROUILLON)</h1>
            <p className="text-gray-700 mb-4">Page de présentation du système de billetterie. Contenu préparé en brouillon — validation par la Direction des Finances requise avant publication.</p>

            <section className="mb-6">
                <h2 className="text-xl font-medium">Acheter un billet</h2>
                <p className="mt-2">Procédure proposée: sélectionner l'événement, choisir le tarif, fournir informations contact, procéder au paiement sécurisé via le système validé par DF.</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                    <li>Types de tarifs: tarif plein, réduit, étudiant (définitions à fournir par DF)</li>
                    <li>Politique remboursements: à définir</li>
                    <li>Méthodes de paiement: en attente d'intégration (virement / carte / mobile money)</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-medium">Prochaines étapes</h3>
                <ol className="list-decimal pl-5 text-sm text-gray-700 mt-2">
                    <li>Valider la grille tarifaire avec la Direction des Finances (DF)</li>
                    <li>Fournir visuels et mentions légales</li>
                    <li>Coordonner intégration paiement avec DevOps</li>
                </ol>
            </section>
        </main>
    );
}
