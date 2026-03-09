import React from 'react';
import mockProjects from '../../lib/mock-data/projects';

export default function ProjetsPage() {
  return (
    <section className="container">
      <h1>Projets</h1>
      <p>Projets institutionnels en cours et à venir.</p>
      <ul>
        {mockProjects.map((p, i) => (<li key={i}><strong>{p.title}</strong> — {p.summary}</li>))}
      </ul>
    </section>
  );
}
