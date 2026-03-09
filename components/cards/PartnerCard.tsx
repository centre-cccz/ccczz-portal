import React from 'react';

export default function PartnerCard({ name, role }: { name: string; role?: string }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>{role}</p>
    </article>
  );
}
