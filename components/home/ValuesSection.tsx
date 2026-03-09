import React from 'react';

export default function ValuesSection() {
  return (
    <section className="section section-values">
      <div className="container">
        <div className="section-head center">
          <span className="section-kicker">Notre mission</span>
          <h2>Promouvoir la Culture Congolaise</h2>
          <p>
            Des actions concretes pour proteger, transmettre et faire rayonner notre patrimoine.
          </p>
        </div>
        <div className="values-grid">
          <article className="value-card">
            <h3>Preservation</h3>
            <p>Valoriser les savoirs, memoires et expressions artistiques du Congo.</p>
          </article>
          <article className="value-card">
            <h3>Communaute</h3>
            <p>Creer des liens entre artistes, familles et institutions culturelles.</p>
          </article>
          <article className="value-card">
            <h3>Rayonnement</h3>
            <p>Porter la culture congolaise a l’echelle nationale et internationale.</p>
          </article>
          <article className="value-card">
            <h3>Creation</h3>
            <p>Encourager les nouvelles voix et la creation contemporaine.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
