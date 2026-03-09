import React from 'react';

type TicketType = {
  name: string;
  price: string;
  description: string;
};

type TicketBoxProps = {
  tickets: TicketType[];
  status: 'Disponible' | 'Complet' | 'Bientôt';
  variant?: 'section' | 'aside';
  anchorId?: string;
};

export default function TicketBox({ tickets, status, variant = 'section', anchorId }: TicketBoxProps) {
  const isAvailable = status === 'Disponible';

  const content = (
    <div className="ticket-card" id={anchorId}>
      <div className="ticket-header">
        <h2>Billetterie CCCZ</h2>
        <p>Souscription et réservation des places. Paiement en ligne disponible prochainement.</p>
      </div>
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div key={ticket.name} className="ticket-row">
            <div>
              <h3>{ticket.name}</h3>
              <p>{ticket.description}</p>
            </div>
            <div className="ticket-price">{ticket.price}</div>
            <div className="ticket-qty">
              <label htmlFor={`qty-${ticket.name}`}>Quantité</label>
              <select id={`qty-${ticket.name}`} defaultValue="1" disabled={!isAvailable}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="ticket-actions">
        <a
          className="btn btn-primary"
          href="#"
          aria-disabled={!isAvailable}
          tabIndex={isAvailable ? 0 : -1}
        >
          Souscrire un billet
        </a>
        <a
          className="btn btn-ghost"
          href="#"
          aria-disabled={!isAvailable}
          tabIndex={isAvailable ? 0 : -1}
        >
          Réserver sans payer
        </a>
      </div>
      <div className="ticket-note">
        Paiement Mobile Money et cartes en préparation. Confirmation sur la page sécurisée CCCZ.
      </div>
    </div>
  );

  if (variant === 'aside') {
    return <div className="ticket-aside">{content}</div>;
  }

  return (
    <section className="section ticket-section">
      <div className="container">{content}</div>
    </section>
  );
}
