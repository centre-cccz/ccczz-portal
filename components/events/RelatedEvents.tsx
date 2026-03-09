import React from 'react';
import Link from 'next/link';

type RelatedEvent = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  time: string;
  location: string;
  status: 'Disponible' | 'Complet' | 'Bientôt';
  statusKey: 'disponible' | 'complet' | 'bientot';
  image: string;
  imageAlt: string;
};

export default function RelatedEvents({ events }: { events: RelatedEvent[] }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="section related-events">
      <div className="container">
        <div className="section-head">
          <span className="section-kicker">À suivre</span>
          <h2>Événements connexes</h2>
        </div>
        <div className="events-grid">
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="event-card">
              <div className="event-media">
                <img src={event.image} alt={event.imageAlt} />
              </div>
              <div className="event-body">
                <div className="event-tags">
                  <span className="event-badge">{event.category}</span>
                  <span className={`event-status event-status-${event.statusKey}`}>{event.status}</span>
                </div>
                <h3>{event.title}</h3>
                <p className="event-summary">{event.summary}</p>
                <div className="event-meta">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
