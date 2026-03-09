import React from 'react';

type EventQuickInfoBarProps = {
  date: string;
  time: string;
  location: string;
  status: 'Disponible' | 'Complet' | 'Bientôt';
  statusKey: 'disponible' | 'complet' | 'bientot';
  priceLabel: string;
};

export default function EventQuickInfoBar({
  date,
  time,
  location,
  status,
  statusKey,
  priceLabel,
}: EventQuickInfoBarProps) {
  return (
    <section className="event-quick-info">
      <div className="container event-quick-grid">
        <div className="event-quick-item">
          <span className="event-quick-label">Date</span>
          <p>{date}</p>
        </div>
        <div className="event-quick-item">
          <span className="event-quick-label">Heure</span>
          <p>{time}</p>
        </div>
        <div className="event-quick-item">
          <span className="event-quick-label">Lieu</span>
          <p>{location}</p>
        </div>
        <div className="event-quick-item">
          <span className="event-quick-label">Tarif</span>
          <p>{priceLabel}</p>
        </div>
        <div className="event-quick-actions">
          <span className={`event-status event-status-${statusKey}`}>{status}</span>
          <a className="btn btn-primary" href="#ticketing">
            Souscrire un billet
          </a>
        </div>
      </div>
    </section>
  );
}
