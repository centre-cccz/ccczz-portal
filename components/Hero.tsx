import React from 'react';

export default function Hero(){
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Centre Culturel Congolais — CCC Le Zoo</h1>
          <p>Résidences, ateliers et formation pour la jeunesse créative.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/programmes">Voir les programmes</a>
            <a className="btn btn-outline" href="/contact">Nous contacter</a>
          </div>
        </div>
      </div>
    </section>
  );
}
