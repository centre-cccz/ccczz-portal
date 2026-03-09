export interface Partner {
    id: number;
    name: string;
    category: 'institutional' | 'cultural' | 'commercial' | 'educational';
    role: string;
    description: string;
    logo?: string;
    website?: string;
    contact?: string;
    focused_areas?: string[];
}

const partners: Partner[] = [
    {
        id: 1,
        name: 'Ministère de la Culture et des Arts',
        category: 'institutional',
        role: 'Partenaire institutionnel',
        description: 'Soutien officiel et reconnaissance institutionnelle du Centre Culturel Congolais Le Zoo.',
        website: 'https://example.com',
        logo: '/logos/ministere-culture.svg',
        contact: 'contact@minculture.cd',
        focused_areas: ['Politique culturelle', 'Financements', 'Reconnaissance'],
    },
    {
        id: 2,
        name: 'UNESCO',
        category: 'institutional',
        role: 'Partenaire patrimoine',
        description: 'Collaboration pour la préservation du patrimoine culturel congolais et la promotion des arts traditionnels.',
        website: 'https://example.com',
        logo: '/logos/rdc-armoiries.svg',
        contact: 'contact@unesco.org',
        focused_areas: ['Patrimoine', 'Formation', 'Documentation'],
    },
    {
        id: 3,
        name: 'Association des Artistes Congolais',
        category: 'cultural',
        role: 'Partenaire culturel',
        description: 'Réseau de promotion des artistes locaux et facilitation des expositions et performances.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.png',
        contact: 'contact@artistescongo.cd',
        focused_areas: ['Arts visuels', 'Musique', 'Danse'],
    },
    {
        id: 4,
        name: 'Institut Français de Kinshasa',
        category: 'cultural',
        role: 'Partenaire coopération',
        description: 'Échanges culturels et coprogrammation d\'événements et formations artistiques.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.svg',
        contact: 'contact@ifrancais.cd',
        focused_areas: ['Coopération', 'Formations', 'Échanges'],
    },
    {
        id: 5,
        name: 'Université de Kinshasa',
        category: 'educational',
        role: 'Partenaire académique',
        description: 'Formation des futurs artistes et développement de programmes éducatifs.',
        website: 'https://example.com',
        logo: '/logos/cccz-logo.svg',
        contact: 'contact@unkin.ac.cd',
        focused_areas: ['Éducation', 'Recherche', 'Jeunesse'],
    },
    {
        id: 6,
        name: 'Banque Congolaise',
        category: 'commercial',
        role: 'Sponsor principal',
        description: 'Soutien financier des projets culturels et événements majeurs du centre.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.svg',
        contact: 'contact@banquecongo.cd',
        focused_areas: ['Sponsoring', 'Événements', 'Développement'],
    },
    {
        id: 7,
        name: 'Fondation pour l\'Afrique',
        category: 'institutional',
        role: 'Partenaire développement',
        description: 'Soutien au développement des infrastructures culturelles et accès aux arts.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.png',
        contact: 'contact@fondationafrique.org',
        focused_areas: ['Infrastructure', 'Accessibilité', 'Développement'],
    },
    {
        id: 8,
        name: 'Galerie Urbaine Kinshasa',
        category: 'cultural',
        role: 'Partenaire galerie',
        description: 'Collaboration pour les expositions et la mise en valeur des artistes émergents.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.png',
        contact: 'contact@galerieurbaine.cd',
        focused_areas: ['Arts visuels', 'Expositions', 'Jeunes talents'],
    },
    {
        id: 9,
        name: 'Médias Congolais (RTNC)',
        category: 'commercial',
        role: 'Partenaire médias',
        description: 'Couverture médiatique et promotion des événements et initiatives du CCCZ.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.png',
        contact: 'contact@rtnc.cd',
        focused_areas: ['Communication', 'Médias', 'Promotion'],
    },
    {
        id: 10,
        name: 'Organisation des Jeunes Artistes',
        category: 'educational',
        role: 'Partenaire jeunesse',
        description: 'Programmes de formation, mentorat et incubation pour les jeunes talents.',
        website: 'https://example.com',
        logo: '/logos/logo_cccz.png',
        contact: 'contact@jeunesartistes.cd',
        focused_areas: ['Formation', 'Mentorat', 'Incubation'],
    },
];

const partnerCategories = {
    institutional: 'Partenaires institutionnels',
    cultural: 'Partenaires culturels',
    commercial: 'Sponsors et partenaires commerciaux',
    educational: 'Partenaires académiques et éducatifs',
};

export { partnerCategories };
export default partners;
