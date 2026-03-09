import React from 'react';
import Image from 'next/image';
import Button from './ui/Button';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="brand">
          <div className="brand-logo-container">
            <Image
              src="/logos/logo_cccz.svg"
              alt="Centre Culturel Congolais Le Zoo"
              width={48}
              height={48}
              priority
              className="brand-logo"
            />
          </div>
          <span className="brand-text">
            <span className="brand-title">Centre Culturel</span>
            <span className="brand-subtitle">Congolais le Zoo</span>
          </span>
        </a>
        <nav className="main-nav">
          <a href="/" className="nav-link nav-home">Accueil</a>
          <a href="/evenements" className="nav-link">Événements</a>
          <a href="/artistes" className="nav-link">Artistes</a>
          <a href="/galerie" className="nav-link">Galerie</a>
          <a href="/partnerships" className="nav-link">Partenaires</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
        <Button
          className="btn-primary nav-btn"
          startIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 2l2.5 4.5L19 8l-3 2.5L16.5 15 12 12.5 7.5 15 9 10.5 6 8l4.5-1.5L12 2z" fill="currentColor" />
            </svg>
          }
        >
          Devenir Partenaire
        </Button>
      </div>
    </header>
  );
}
