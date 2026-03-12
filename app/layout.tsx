import type { Metadata } from 'next';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Centre Culturel Congolais Le Zoo',
  description:
    'Portail officiel du Centre Culturel Congolais Le Zoo: événements, artistes, galerie et activités culturelles.',
  openGraph: {
    title: 'Centre Culturel Congolais Le Zoo',
    description:
      'Découvrez la mission, les événements et les activités du Centre Culturel Congolais Le Zoo.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
