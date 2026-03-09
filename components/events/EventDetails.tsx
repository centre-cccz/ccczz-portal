import React from 'react';

type EventDetailsProps = {
  description: string;
  program: string[];
  artists: string[];
  practicalInfo: {
    venue: string;
    conditions: string;
    contact: string;
  };
};

export default function EventDetails({
  description,
  program,
  artists,
  practicalInfo,
}: EventDetailsProps) {
  return (
    <section className="section event-details">
      <div className="container event-details-grid">
        <div className="event-details-main">
          <h2>À propos de l’événement</h2>
          <p>{description}</p>
          <div className="event-details-block">
            <h3>Programme</h3>
            <ul>
              {program.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="event-details-block">
            <h3>Artistes / intervenants</h3>
            <ul>
              {artists.map((artist) => (
                <li key={artist}>{artist}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="event-practical">
          <h3>Infos pratiques</h3>
          <div className="event-practical-item">
            <span className="event-practical-label">Lieu</span>
            <p>{practicalInfo.venue}</p>
          </div>
          <div className="event-practical-item">
            <span className="event-practical-label">Conditions</span>
            <p>{practicalInfo.conditions}</p>
          </div>
          <div className="event-practical-item">
            <span className="event-practical-label">Contact</span>
            <p>{practicalInfo.contact}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
