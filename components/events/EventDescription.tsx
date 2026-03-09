import React from 'react';

type EventDescriptionProps = {
  description: string;
  program: string[];
};

export default function EventDescription({ description, program }: EventDescriptionProps) {
  return (
    <section className="event-description">
      <div className="section-head">
        <span className="section-kicker">Présentation</span>
        <h2>À propos de l’événement</h2>
      </div>
      <p className="event-description-text">{description}</p>
      <div className="event-description-program">
        <h3>Programme</h3>
        <ul>
          {program.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
