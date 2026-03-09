import React from 'react';
import SpaceCard from './SpaceCard';

const spaces = [
  {
    name: 'Salle de Spectacle',
    description: 'Une scène modulable pour concerts, théâtre et grandes rencontres culturelles.',
    badge: 'Spectacle vivant',
    image: '/images/espace/espace_construction-podium.png',
    imageAlt: 'Performance musicale et danse au CCCZ.',
  },
  {
    name: 'Galerie d’Exposition',
    description: 'Un espace lumineux pour accueillir les œuvres contemporaines et les patrimoines visuels.',
    badge: 'Arts visuels',
    image: '/images/directions/galérie.png',
    imageAlt: 'Espace galerie du CCCZ.',
  },
  {
    name: 'Espace Créatif',
    description: 'Ateliers, résidences et médiations pour soutenir la création locale.',
    badge: 'Ateliers & résidences',
    image: '/images/espace/espace_02.png',
    imageAlt: 'Atelier créatif au CCCZ.',
  },
  {
    name: 'Salle Polyvalente',
    description: 'Un lieu adaptable pour conférences, projections et dialogues culturels.',
    badge: 'Rencontres',
    image: '/images/directions/portail_zoo.png',
    imageAlt: 'Espace polyvalent du CCCZ.',
  },
  {
    name: 'Cour Culturelle',
    description: 'Un espace ouvert pour les programmations publiques et la convivialité.',
    badge: 'Vie publique',
    image: '/images/espace/espace_03.png',
    imageAlt: 'Façade et cour du CCCZ.',
  },
  {
    name: 'Espace Jeunesse',
    description: 'Un lieu d’apprentissage et d’expression pour les jeunes publics.',
    badge: 'Transmission',
    image: '/images/directions/exposition01.jpg',
    imageAlt: 'Activités jeunesse au CCCZ.',
  },
];

export default function SpacesSection() {
  return (
    <section className="section spaces-section">
      <div className="container">
        <div className="spaces-head">
          <span className="section-kicker">ESPACES & ACTIVITÉS</span>
          <h2>Un lieu vivant au service de la culture</h2>
          <p>
            Le Centre Culturel Congolais Le Zoo met à disposition des espaces dédiés
            à la création, à la diffusion et à la transmission culturelle.
          </p>
        </div>
        <div className="spaces-grid">
          {spaces.map((space) => (
            <SpaceCard key={space.name} {...space} />
          ))}
        </div>
        <div className="spaces-cta">
          <a className="btn btn-secondary" href="/spaces">Découvrir tous nos espaces</a>
        </div>
      </div>
    </section>
  );
}
