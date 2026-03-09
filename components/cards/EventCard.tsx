import React from 'react';

export default function EventCard({ title, date, location }: { title: string; date?: string; location?: string }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{date} — {location}</p>
    </article>
  );
}
