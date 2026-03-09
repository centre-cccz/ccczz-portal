import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <a href="/">CCC Le Zoo</a>
        <nav>
          <a href="/">Accueil</a> | <a href="/actualites">Actualités</a> | <a href="/evenements">Événements</a> | <a href="/projets">Projets</a>
        </nav>
      </div>
    </header>
  );
}
