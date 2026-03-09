import React from 'react';

export default function DirectionCard({ name, role, description }: { name: string; role?: string; description?: string }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p><em>{role}</em></p>
      <p>{description}</p>
    </article>
  );
}
