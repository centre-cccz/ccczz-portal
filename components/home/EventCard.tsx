import React from 'react';

type EventCardProps = {
  title: string;
  category: string;
  date: string;
  location: string;
  price: string;
  status: 'Disponible' | 'Complet' | 'Bientôt';
  statusKey: 'disponible' | 'complet' | 'bientot';
  slug: string;
  image: string;
  imageAlt: string;
};

export default function EventCard({
  title,
  category,
  date,
  location,
  price,
  status,
  statusKey,
  slug,
  image,
  imageAlt,
}: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-media">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="event-body">
        <div className="event-tags">
          <span className="event-badge">{category}</span>
          <span className={`event-status event-status-${statusKey}`}>{status}</span>
        </div>
        <h3>{title}</h3>
        <div className="event-meta">
          <span>{date}</span>
          <span>{location}</span>
        </div>
        <div className="event-price">{price}</div>
        <div className="event-actions">
          <a className="btn btn-primary" href={`/events/${slug}`}>Acheter le billet</a>
          <a className="btn btn-ghost" href={`/events/${slug}`}>Voir détails</a>
        </div>
      </div>
    </article>
  );
}
