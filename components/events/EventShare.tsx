import React from 'react';

type EventShareProps = {
  title: string;
  date: string;
  location: string;
};

export default function EventShare({ title, date, location }: EventShareProps) {
  return (
    <section className="event-share">
      <h3>Partager l’événement</h3>
      <p>
        {title} · {date} · {location}
      </p>
      <div className="event-share-actions">
        <a className="btn btn-secondary" href="#">
          Ajouter au calendrier
        </a>
        <a className="btn btn-ghost" href="#">
          Partager par message
        </a>
      </div>
      <p className="event-share-note">
        Pour les invitations institutionnelles, contactez l’équipe CCCZ.
      </p>
    </section>
  );
}
