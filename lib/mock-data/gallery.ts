/**
 * Gallery Mock Data - CCCZ Portfolio
 * Données d'exemple pour la galerie artistique
 * Source images: /public/images/galerie/
 */

export interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: 'graphique' | 'plastique' | 'musique' | 'performance';
  image: string;
  imageAlt: string;
  description: string;
  year: number;
  medium?: string;
  dimensions?: string;
  price?: string;
  featured?: boolean;
}

export interface ArtistOfMonth {
  name: string;
  bio: string;
  image: string;
  specialty: string;
  quote: string;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  featured: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-001',
    title: 'Patrimoine Urbain Kinshasa',
    artist: 'Théâtre Kabako',
    category: 'graphique',
    image: '/images/galerie/galérie.png',
    imageAlt: 'Illustration graphique colorée du patrimoine urbain kinois',
    description: 'Exploration visuelle des architectures historiques et modernes de Kinshasa',
    year: 2025,
    medium: 'Illustration numérique',
    dimensions: '2000x1500px',
    featured: true,
  },
  {
    id: 'gal-002',
    title: 'Statut Luba - Héritage Ancestral',
    artist: 'Collectif Patrimoine Africain',
    category: 'plastique',
    image: '/images/galerie/statut_Luba.png',
    imageAlt: 'Sculpture traditionnelle Luba avec détails artistiques',
    description: 'Représentation moderne des statuts traditionnels Luba du Congo',
    year: 2024,
    medium: 'Sculpture numérique 3D',
    featured: true,
  },
  {
    id: 'gal-003',
    title: 'Portrait - Africanité Contemporaine',
    artist: 'Studio Artistique CCCZ',
    category: 'plastique',
    image: '/images/galerie/portrai_paysage_africain.png',
    imageAlt: 'Portrait expressif avec paysage africain stylisé',
    description: 'Fusion entre portrait élégant et paysage africain abstrait',
    year: 2025,
    medium: 'Peinture numériques',
    featured: false,
  },
  {
    id: 'gal-004',
    title: 'Exposition Philosophique',
    artist: 'Atelier de Création CCCZ',
    category: 'graphique',
    image: '/images/galerie/exposition01.jpg',
    imageAlt: 'Installation artistique montrant des concepts philosophiques',
    description: 'Réflexion visuelle sur l\'art, l\'identité et la modernité',
    year: 2025,
    medium: 'Installation multimédia',
    featured: false,
  },
  {
    id: 'gal-005',
    title: 'Futurs Horizons - Série Paysages',
    artist: 'Photographe Lumière',
    category: 'graphique',
    image: '/images/galerie/futures01.jpg',
    imageAlt: 'Paysage numérique futuriste avec teintes dorées',
    description: 'Exploration des horizons futurs à travers la photographie artistique',
    year: 2024,
    medium: 'Photographie numériquement retouchée',
    featured: false,
  },
  {
    id: 'gal-006',
    title: 'Danse des Traditions',
    artist: 'Groupe TUTA NGOMA',
    category: 'performance',
    image: '/images/evenements/danses.png',
    imageAlt: 'Danseurs traditionels en mouvement artistique',
    description: 'Captation vidéo de la danse traditionnelle congolaise en performance',
    year: 2025,
    medium: 'Performance vidéo',
    featured: true,
  },
  {
    id: 'gal-007',
    title: 'Symphonie Kinshasa - Projet Musical',
    artist: 'Ensemble Musical CCCZ',
    category: 'musique',
    image: '/images/directions/danses.png',
    imageAlt: 'Musiciens en harmonie sur scène',
    description: 'Enregistrement live de compositions originales inspirées de la culture congolaise',
    year: 2024,
    medium: 'Composition musicale',
    featured: false,
  },
  {
    id: 'gal-008',
    title: 'Défilé de Mode Culturelle',
    artist: 'Design Studio CCCZ',
    category: 'performance',
    image: '/images/evenements/defilé_de_mode.jpg',
    imageAlt: 'Collection mode alliant tradition et modernité',
    description: 'Présentation de vêtements traditionnels réinterprétés avec style contemporain',
    year: 2025,
    medium: 'Performance mode et textile',
    featured: false,
  },
  {
    id: 'gal-009',
    title: 'Cinéma Congolais - Retrospective',
    artist: 'Centre SEFICO',
    category: 'graphique',
    image: '/images/evenements/projet_sefico_avril_2026.png',
    imageAlt: 'Affiche d\'époque celebrant le cinéma congolais',
    description: 'Archivage visuel des grands moments du cinéma congolais',
    year: 2024,
    medium: 'Design graphique',
    featured: false,
  },
  {
    id: 'gal-010',
    title: 'Tableau du Président - Hommage',
    artist: 'Atelier Historique',
    category: 'plastique',
    image: '/images/evenements/expositio_tableaupresident.jpg',
    imageAlt: 'Portrait présidentiel dans style artistique classique',
    description: 'Portrait officiel réinterprété avec techniques artistiques contemporaines',
    year: 2025,
    medium: 'Peinture mixte',
    featured: false,
  },
];

export const artistOfMonth: ArtistOfMonth = {
  name: 'Théâtre Kabako',
  bio: 'Collectif d\'artistes basé à Kinshasa, spécialisé dans l\'illustration numérique et la narration visuelle. Depuis 2018, ils explorent l\'intersection entre tradition congolaise et modernité digitale.',
  image: '/images/galerie/futures01.jpg',
  specialty: 'Illustration Numérique & Design Graphique',
  quote: 'L\'art est le miroir de notre âme. À travers chaque création, nous racontons l\'histoire de notre peuple.',
};

export const exhibitions: Exhibition[] = [
  {
    id: 'exp-001',
    title: 'SEFICO 3 — Semaine du Film Congolais',
    date: '15-18 Avril 2026',
    time: '10h00 - 18h00',
    location: 'Salle des Spectacles - CCCZ, Gombe',
    description: 'Célébration du cinéma congolais avec projection de films et rencontres avec réalisateurs.',
    image: '/images/evenements/projet_sefico_avril_2026.png',
    featured: true,
  },
  {
    id: 'exp-002',
    title: 'Mois de la Femme — Exposition Collective',
    date: '8 & 27 Mars 2026',
    time: '10h00 - 17h00',
    location: 'CCCZ - Espace Principal',
    description: 'Exposition des œuvres d\'artistes femmes du Congo et d\'Afrique.',
    image: '/images/evenements/mois_de_la_femme.mp4',
    featured: true,
  },
  {
    id: 'exp-003',
    title: 'Exposition Permanente — Arts et Cultures',
    date: 'Ouvert toute l\'année',
    time: '10h00 - 18h00 (Lun-Dim)',
    location: 'Galerie Principale - CCCZ',
    description: 'Collections permanentes showcasing artistic heritage and contemporary works.',
    image: '/images/galerie/galérie.png',
    featured: false,
  },
];

export const testimonials = [
  {
    author: 'Marie N\'Sele',
    role: 'Critiques d\'art, Kinshasa',
    text: 'Le CCCZ offre une plateforme exceptionnelle pour les artistes congolais. C\'est un phare de créativité en Afrique.',
    rating: 5,
  },
  {
    author: 'Jean Mukendi',
    role: 'Curateur international',
    text: 'La qualité des œuvres exposées rivalise avec les meilleures galeries du monde. Impressionnant.',
    rating: 5,
  },
  {
    author: 'Asha Kimani',
    role: 'Directrice culturelle, Lagos',
    text: 'Une visite incontournable pour découvrir la richesse artistique du Congo et de l\'Afrique.',
    rating: 5,
  },
  {
    author: 'Philippe Durand',
    role: 'Collectionneur, Bruxelles',
    text: 'Chaque visite découvre des talents cachés. Le CCCZ est une source d\'inspiration continue.',
    rating: 5,
  },
];

export const artisticQuotes = [
  {
    text: 'L\'art n\'est pas ce que vous voyez, mais ce que vous utilisez pour voir.',
    author: 'Proverbe Congolais',
  },
  {
    text: 'Chaque création est un echo de notre patrimoine et une promesse d\'avenir.',
    author: 'Philosophie CCCZ',
  },
  {
    text: 'La créativité africaine brille non pas de moins, mais d\'une autre lumière.',
    author: 'Aimé Césaire',
  },
  {
    text: 'Le Congo crée l\'art qui fait rêver le monde entier.',
    author: 'Tradition Congolaise',
  },
];

export const categoryInfo: Record<GalleryItem['category'], { label: string; icon: string; color: string; description: string }> = {
  graphique: {
    label: '🎨 Art Graphique',
    icon: '🎨',
    color: 'from-amber-600 to-amber-700',
    description: 'Illustrations, design graphique et art numérique explorant les formes et les couleurs',
  },
  plastique: {
    label: '🗿 Art Plastique',
    icon: '🗿',
    color: 'from-amber-700 to-amber-800',
    description: 'Sculpture, peinture et installations artistiques célébrant la forme et la matière',
  },
  musique: {
    label: '🎶 Art Musical',
    icon: '🎶',
    color: 'from-amber-500 to-amber-600',
    description: 'Compositions et performances musicales puisant dans la richesse mélodique africaine',
  },
  performance: {
    label: '🎭 Performance & Scène',
    icon: '🎭',
    color: 'from-amber-600 to-orange-700',
    description: 'Danse, théâtre et performances vivantes incarnant l\'énergie de la culture congolaise',
  },
};

const gallery = [
  { title: 'Façade du centre', file: 'facade.jpg' },
  { title: 'Atelier numérique', file: 'atelier.jpg' },
  { title: 'Exposition', file: 'expo.jpg' },
];

export default gallery;
