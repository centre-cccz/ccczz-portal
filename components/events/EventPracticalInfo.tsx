import React from 'react';

type EventPracticalInfoProps = {
  practicalInfo: {
    venue: string;
    conditions: string;
    contact: string;
  };
};

export default function EventPracticalInfo({ practicalInfo }: EventPracticalInfoProps) {
  return (
    <section className="event-practical-card">
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
    </section>
  );
}
