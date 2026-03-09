import React from 'react';
import { notFound } from 'next/navigation';
import EventHero from '../../../components/events/EventHero';
import EventQuickInfoBar from '../../../components/events/EventQuickInfoBar';
import EventDescription from '../../../components/events/EventDescription';
import EventPracticalInfo from '../../../components/events/EventPracticalInfo';
import TicketBox from '../../../components/events/TicketBox';
import EventShare from '../../../components/events/EventShare';
import RelatedEvents from '../../../components/events/RelatedEvents';
import ArtistCard from '../../../components/cards/ArtistCard';

const events = [
  {
    slug: 'semaine-patrimoine-musical',
    title: 'Semaine du Patrimoine Musical',
    category: 'Festival',
    summary: 'Sept jours pour célébrer les rythmes congolais et la transmission des savoir-faire.',
    date: '18 Mars 2026',
    time: '18h00',
    location: 'Salle CCCZ, Kinshasa',
    status: 'Disponible' as const,
    statusKey: 'disponible' as const,
    image: '/images/directions/danses.png',
    imageAlt: 'Musiciens et danseurs congolais en performance.',
    description:
      'Une semaine dédiée aux rythmes congolais, à la transmission des savoir-faire et à la valorisation des patrimoines immatériels. Concerts, échanges et démonstrations s’enchaînent pour célébrer les cultures vivantes.',
    program: [
      'Ouverture officielle et hommage aux maîtres du patrimoine.',
      'Rencontres professionnelles autour de la transmission culturelle.',
      'Grande soirée musicale et danse traditionnelle.',
    ],
    artists: [
      {
        name: 'Ensemble du CCCZ',
        discipline: 'Orchestre résident',
        bio: 'Interprète les répertoires traditionnels et contemporains du Congo.',
      },
      {
        name: 'Invités du Conservatoire National',
        discipline: 'Formation & transmission',
        bio: 'Intervenants spécialisés dans la sauvegarde des patrimoines musicaux.',
      },
      {
        name: 'Collectif Jeunesse Créative',
        discipline: 'Danse & percussion',
        bio: 'Nouvelles voix du patrimoine vivant congolais.',
      },
    ],
    practicalInfo: {
      venue: 'Centre Culturel Congolais Le Zoo, Salle principale.',
      conditions: 'Accès sur présentation du billet. Placement libre.',
      contact: 'billetterie@cccz.cd · +243 00 000 000',
    },
    tickets: [
      {
        name: 'Billet Standard',
        price: '5 $',
        description: 'Accès général aux performances.',
      },
      {
        name: 'Billet Soutien',
        price: '10 $',
        description: 'Soutien à la mission culturelle du CCCZ.',
      },
    ],
  },
  {
    slug: 'atelier-jeunesse-creation',
    title: 'Atelier Jeunesse et Création',
    category: 'Atelier',
    summary: 'Une journée d’apprentissage et d’expression artistique pour la jeunesse.',
    date: '02 Avril 2026',
    time: '09h30',
    location: 'Espace Créatif CCCZ',
    status: 'Bientôt' as const,
    statusKey: 'bientot' as const,
    image: '/images/directions/famillezoo02.jpg',
    imageAlt: 'Participants en atelier de création culturelle.',
    description:
      'Un atelier immersif dédié à la jeunesse, combinant création artistique, échanges et formation. Objectif : encourager l’expression contemporaine et renforcer les liens communautaires.',
    program: [
      'Accueil des participants et briefing pédagogique.',
      'Ateliers de création encadrés par des artistes.',
      'Présentation collective des productions.',
    ],
    artists: [
      {
        name: 'Facilitateurs CCCZ',
        discipline: 'Médiation culturelle',
        bio: 'Encadrement pédagogique et accompagnement des participants.',
      },
      {
        name: 'Artistes mentors invités',
        discipline: 'Création contemporaine',
        bio: 'Conseils artistiques et ateliers collaboratifs.',
      },
    ],
    practicalInfo: {
      venue: 'CCCZ - Espace Créatif, Kinshasa.',
      conditions: 'Atelier sur inscription, places limitées.',
      contact: 'jeunesse@cccz.cd · +243 00 000 000',
    },
    tickets: [
      {
        name: 'Pass Atelier',
        price: '3 $',
        description: 'Accès complet à la journée d’atelier.',
      },
    ],
  },
  {
    slug: 'rencontre-arts-urbains',
    title: 'Rencontre des Arts Urbains',
    category: 'Spectacle',
    summary: 'Une soirée entre performances urbaines, discussions et exposition.',
    date: '20 Avril 2026',
    time: '19h00',
    location: 'Galerie CCCZ',
    status: 'Complet' as const,
    statusKey: 'complet' as const,
    image: '/images/directions/galérie.png',
    imageAlt: 'Scène artistique contemporaine au CCCZ.',
    description:
      'Une soirée dédiée aux expressions urbaines contemporaines et aux nouveaux courants artistiques congolais. Performances live, rencontres et discussions.',
    program: [
      'Performance d’ouverture et slam.',
      'Table ronde avec les créateurs urbains.',
      'Clôture musicale et exposition.',
    ],
    artists: [
      {
        name: 'Collectif Urbain',
        discipline: 'Performance & slam',
        bio: 'Création scénique contemporaine et paroles engagées.',
      },
      {
        name: 'Invités CCCZ',
        discipline: 'Rencontres & dialogues',
        bio: 'Intervenants culturels et artistes partenaires.',
      },
    ],
    practicalInfo: {
      venue: 'Galerie CCCZ, Kinshasa.',
      conditions: 'Billets épuisés.',
      contact: 'culture@cccz.cd · +243 00 000 000',
    },
    tickets: [
      {
        name: 'Billet Unique',
        price: '8 $',
        description: 'Accès complet à la rencontre.',
      },
    ],
  },
];

const getStartingPrice = (tickets: { price: string }[]) => {
  const numericPrices = tickets
    .map((ticket) => Number(ticket.price.replace(/[^0-9.]/g, '')))
    .filter((price) => !Number.isNaN(price) && price > 0);

  if (numericPrices.length === 0) {
    return 'Gratuit';
  }

  const minPrice = Math.min(...numericPrices);
  return `À partir de ${minPrice} $`;
};

export default function EventPage({ params }: { params: { slug: string } }) {
  const event = events.find((item) => item.slug === params.slug);

  if (!event) {
    return notFound();
  }

  const relatedEvents = events.filter((item) => item.slug !== event.slug).slice(0, 3);

  return (
    <div>
      <EventHero
        title={event.title}
        category={event.category}
        date={event.date}
        time={event.time}
        location={event.location}
        status={event.status}
        statusKey={event.statusKey}
        image={event.image}
        imageAlt={event.imageAlt}
      />
      <EventQuickInfoBar
        date={event.date}
        time={event.time}
        location={event.location}
        status={event.status}
        statusKey={event.statusKey}
        priceLabel={getStartingPrice(event.tickets)}
      />
      <main className="section event-main">
        <div className="container event-main-grid">
          <div className="event-main-content">
            <EventDescription description={event.description} program={event.program} />
            <section className="event-artists">
              <div className="section-head">
                <span className="section-kicker">Artistes & intervenants</span>
                <h2>Présences artistiques</h2>
              </div>
              <div className="event-artists-grid">
                {event.artists.map((artist) => (
                  <ArtistCard
                    key={artist.name}
                    name={artist.name}
                    discipline={artist.discipline}
                    bio={artist.bio}
                    className="artist-card"
                  />
                ))}
              </div>
            </section>
          </div>
          <aside className="event-main-aside">
            <TicketBox tickets={event.tickets} status={event.status} variant="aside" anchorId="ticketing" />
            <EventPracticalInfo practicalInfo={event.practicalInfo} />
            <EventShare title={event.title} date={event.date} location={event.location} />
          </aside>
        </div>
      </main>
      <RelatedEvents events={relatedEvents} />
    </div>
  );
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}
