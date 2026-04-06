import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Centre Culturel Congolais Le Zoo',
  description: 'Questions fréquentes — Horaires, accès, réservations, ateliers, partenariats et bien plus au CCCZ.',
  keywords: ['FAQ', 'questions', 'réservations', 'ateliers', 'contact', 'CCCZ'],
  openGraph: {
    title: 'FAQ | CCCZ',
    description: 'Réponses aux questions sur le Centre Culturel Congolais Le Zoo',
    type: 'website',
    locale: 'fr_CD',
  },
};

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  // Accès & Horaires
  {
    id: 'q1',
    category: 'Accès & Horaires',
    question: 'Quels sont les horaires d\'ouverture du CCCZ ?',
    answer: 'Le Centre est ouvert du lundi au vendredi de 09h00 à 18h00, et les samedis-dimanches de 11h00 à 19h00. Les jours fériés, nous contactez pour vérifier notre disponibilité.',
  },
  {
    id: 'q2',
    category: 'Accès & Horaires',
    question: 'Le centre est-il accessible aux personnes en situation de handicap ?',
    answer: 'Oui, le CCCZ dispose d\'accès PMR, d\'ascenseurs, de toilettes adaptées et d\'espace de stationnement. Si vous avez des besoins spécifiques, nous recommandons de nous contacter avant votre visite.',
  },
  {
    id: 'q3',
    category: 'Accès & Horaires',
    question: 'Y a-t-il un parking ?',
    answer: 'Oui, un parking est disponible sur le site du CCCZ. Pour les événements majeurs, nous recommandons les transports en commun ou l\'covoiturage.',
  },

  // Expositions & Visites
  {
    id: 'q4',
    category: 'Expositions & Visites',
    question: 'L\'accès à la galerie est-il gratuit ?',
    answer: 'Oui, l\'accès à nos expositions temporaires et à la galerie permanente est gratuit pour les citoyens congolais. Une contribution volontaire est possible pour les visiteurs étrangers.',
  },
  {
    id: 'q5',
    category: 'Expositions & Visites',
    question: 'Pouvez-vous organiser une visite guidée pour mon groupe ?',
    answer: 'Absolument ! Nous proposons des visites guidées pour les groupes (minimum 10 personnes). Veuillez nous contacter au moins 1 semaine à l\'avance pour organiser votre visite.',
  },
  {
    id: 'q6',
    category: 'Expositions & Visites',
    question: 'Pouvons-nous prendre des photos pendant les visites ?',
    answer: 'Les photos personnelles sont généralement autorisées pour les expositions. Cependant, nous demandons de respecter les consignes affichées pour certaines œuvres sensibles ou protégées.',
  },

  // Ateliers & Formations
  {
    id: 'q7',
    category: 'Ateliers & Formations',
    question: 'Qui peut participer aux ateliers proposés par le CCCZ ?',
    answer: 'Nos ateliers sont ouverts à audiences variées : jeunes (14-35 ans), professionnels, familles, selon le programme. Certains ateliers cibleent des groupes spécifiques. Consultez notre calendrier pour les détails.',
  },
  {
    id: 'q8',
    category: 'Ateliers & Formations',
    question: 'Quel est le coût des ateliers ?',
    answer: 'Les tarifs varient selon le type d\'atelier : demi-journée (5-15 $), journée complète (20-35 $), formations longues (forfaits adaptés). Des réductions sont proposées pour les groupes.',
  },
  {
    id: 'q9',
    category: 'Ateliers & Formations',
    question: 'Je suis intéressé par une résidence d\'artiste. Comment postuler ?',
    answer: 'Les résidences d\'artistes sont annoncées sur notre site et réseaux sociaux. Vous devez soumettre un portfolio, un projet détaillé et une lettre de motivation. Les appels à candidature sont généralement lancés semestriellment.',
  },

  // Partenariats & Projets
  {
    id: 'q10',
    category: 'Partenariats & Projets',
    question: 'Comment proposer un projet ou une collaboration ?',
    answer: 'Utilisez la page "Soumissions" de notre site ou écrivez-nous à info@cccz.cd avec un descriptif de votre projet, vos contacts et fichiers pertinents. L\'équipe vous répondra sous 2 week.',
  },
  {
    id: 'q11',
    category: 'Partenariats & Projets',
    question: 'Quels types de partenariats le CCCZ propose-t-il ?',
    answer: 'Nous proposons des partenariats institutionnels, des sponsorships, du mécénat culturel, et des collaborations programmatiques. Consultez notre page "Partenaires" pour plus de détails sur les tunnels disponibles.',
  },
  {
    id: 'q12',
    category: 'Partenariats & Projets',
    question: 'Le centre prête-t-il du matériel ou des équipements ?',
    answer: 'Oui, sur demande et selon disponibilité. Les prêts pour projets en partenariat avec le CCCZ sont prioritaires. Contactez-nous avec un projet détaillé.',
  },

  // Billetterie & Réservations
  {
    id: 'q13',
    category: 'Billetterie & Réservations',
    question: 'Comment réserver une place pour un événement ?',
    answer: 'Les événements et spectacles sont normalement gratuits ou billettérisés via notre système en ligne. Consultez la page de l\'événement pour les modalités. Pour les groupes, réservation conseillée auprès de la direction DACPA.',
  },
  {
    id: 'q14',
    category: 'Billetterie & Réservations',
    question: 'Puis-je faire une donation ou un sponsoring ?',
    answer: 'Oui, les donations et sponsorings sont les bienvenus ! Contactez notre Direction Financière pour discuter des possibilités. Tous les apports sont documentés et reconnaissables (logos, crédits, etc.).',
  },
  {
    id: 'q15',
    category: 'Billetterie & Réservations',
    question: 'Comment louer un espace pour un événement privé ?',
    answer: 'Vous souhaitez louer une salle pour un événement ? Contactez-nous avec les détails (espace requis, date, nombre de personnes, type d\'événement). Nous établirons un devis et les modalités de reservation.',
  },

  // Ressources & Bibliothèque
  {
    id: 'q16',
    category: 'Ressources & Bibliothèque',
    question: 'Comment accéder à la bibliothèque numérique du CCCZ ?',
    answer: 'La bibliothèque numérique est en développement. Abonnez-vous à notre newsletter pour être informé du lancement. Pour l\'accès physique, les archives sont disponibles sur rendez-vous.',
  },
  {
    id: 'q17',
    category: 'Ressources & Bibliothèque',
    question: 'Pouvez-vous héberger mon projet de recherche sur le patrimoine congolais ?',
    answer: 'Absolument ! Nous favorisoins la recherche culturelle. Contactez notre Bibliothèque pour discuter de possibilités de collaboration, d\'accès aux archives, ou d\'hébergement de projets.',
  },

  // Communication & Média
  {
    id: 'q18',
    category: 'Communication & Média',
    question: 'Comment recevoir les actualités du CCCZ ?',
    answer: 'Abonnez-vous à notre newsletter via le formulaire sur la page "Actualités". Suivez-nous aussi sur les réseaux sociaux (Facebook, Instagram, LinkedIn) pour les dernières annonces.',
  },
  {
    id: 'q19',
    category: 'Communication & Média',
    question: 'Puis-je reproduire des images du CCCZ pour mon projet ?',
    answer: 'Les images d\'expositions et d\'événements du CCCZ peuvent généralement être utilisées avec attribution. Pour les usages commerciaux ou importants, demandez l\'autorisation auprès de notre Direction Communication.',
  },

  // Général
  {
    id: 'q20',
    category: 'Général',
    question: 'Je veux en savoir plus sur l\'histoire du CCCZ. Par où commencer ?',
    answer: 'Commencez par notre page "Notre Mission" qui explique la vision et les valeurs du CCCZ. Visitez ensuite notre bibliothèque ou nos archives pour explorer l\'historique institutionnel.',
  },
];

const categories = ['Accès & Horaires', 'Expositions & Visites', 'Ateliers & Formations', 'Partenariats & Projets', 'Billetterie & Réservations', 'Ressources & Bibliothèque', 'Communication & Média', 'Général'];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filteredItems = selectedCategory
    ? faqItems.filter((item) => item.category === selectedCategory)
    : faqItems;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-4">
              QUESTIONS FRÉQUENTES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Besoin d\'aide ? Consultez la FAQ
            </h1>
            <p className="text-lg text-green-100">
              Trouvez les réponses aux questions les plus posées sur le CCCZ — accès, ateliers, expositions, partenariats et bien plus.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Categories Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Parcourir par catégorie</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === null
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Toutes les questions
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <details
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                  open={expandedId === item.id}
                  onToggle={(e) => setExpandedId(e.currentTarget.open ? item.id : null)}
                >
                  <summary className="cursor-pointer p-6 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition">
                    <span>{item.question}</span>
                    <span className="text-green-700 text-xl font-bold">
                      {expandedId === item.id ? '−' : '+'}
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                    {item.answer}
                  </div>
                </details>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucune question ne correspond à cette catégorie.</p>
              </div>
            )}
          </div>

          {/* Still can't find */}
          <div className="mt-16 bg-green-50 p-8 rounded-lg border-l-4 border-green-700 max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Vous n\'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-gray-700 mb-6">
              Notre équipe est disponible pour répondre à vos questions. N\'hésitez pas à nous contacter directement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/contact" className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition">
                Nous contacter
              </a>
              <a href="mailto:info@cccz.cd" className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">
                info@cccz.cd
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Ressources utiles</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <a href="/espaces" className="group p-6 border-2 border-gray-300 rounded-lg hover:border-green-700 hover:shadow-lg transition">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 mb-2">Nos espaces</h3>
              <p className="text-sm text-gray-600">Découvrez tous les espaces, horaires et tarifs du CCCZ.</p>
            </a>

            <a href="/evenements" className="group p-6 border-2 border-gray-300 rounded-lg hover:border-green-700 hover:shadow-lg transition">
              <div className="text-3xl mb-3">🎪</div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 mb-2">Agenda</h3>
              <p className="text-sm text-gray-600">Consultez la programmation complète des événements 2026.</p>
            </a>

            <a href="/partenaires" className="group p-6 border-2 border-gray-300 rounded-lg hover:border-green-700 hover:shadow-lg transition">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 mb-2">Partenariats</h3>
              <p className="text-sm text-gray-600">En savoir plus sur les opportunités de partenariat.</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
