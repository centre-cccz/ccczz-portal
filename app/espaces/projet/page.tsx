import React from 'react';

export default function EspacesProjetPage() {
  return (
    <section className="container">
      <h1>Projets — Espaces</h1>
      <p>Présentation des projets et espaces (iframe).</p>
      <iframe src="/espaces/projet.html" title="Projets Espaces" style={{ width: '100%', height: 480, border: '1px solid #ccc' }} />
    </section>
  );
}
