import React from 'react';

type EventHeroProps = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: 'Disponible' | 'Complet' | 'Bientôt';
  statusKey: 'disponible' | 'complet' | 'bientot';
  image: string;
  imageAlt: string;
};

export default function EventHero({
  title,
  category,
  date,
  time,
  location,
  status,
  statusKey,
  image,
  imageAlt,
}: EventHeroProps) {
  return (
    <section className="event-hero">
      <div className="event-hero-media">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="event-hero-overlay" aria-hidden="true" />
      <div className="container event-hero-content">
        <div className="event-hero-tags">
          <span className="event-badge">{category}</span>
          <span className={`event-status event-status-${statusKey}`}>{status}</span>
        </div>
        <h1>{title}</h1>
        <div className="event-hero-meta">
          <span>{date}</span>
          <span>{time}</span>
          <span>{location}</span>
        </div>
      </div>
    </section>
  );
}
