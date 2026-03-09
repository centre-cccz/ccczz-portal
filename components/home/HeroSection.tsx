import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero">
      <div
        className="hero-media"
        style={{ backgroundImage: "url('/images/directions/portail_zoo.png')" }}
        aria-hidden="true"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-eyebrow">Bienvenue au CCCZ</div>
        <h1>Centre Culturel Congolais Le Zoo</h1>
        <p>
          Institution dédiée à la préservation et à la diffusion des cultures congolaises.
          Arts, musique, danse et échanges au service du public.
        </p>
        <div className="hero-actions">
          <a href="/evenements" className="btn btn-primary">Nos événements</a>
          <a href="/artistes" className="btn btn-outline">Découvrir nos artistes</a>
        </div>
      </div>
    </section>
  );
}
