export interface Event {
  id: string;
  title: string;
  date: string;
  dateEnd?: string;
  time?: string;
  location: string;
  image: string;
  description: string;
  fullDescription: string;
  category: 'cinema' | 'independence' | 'womens-month' | 'cultural' | 'workshop';
  participants?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const events: Event[] = [
  {
    id: 'sefico-2026',
    title: 'Semaine du Film Congolais - SEFICO 3ème Édition',
    date: '2026-04-15',
    dateEnd: '2026-04-18',
    time: '10:00',
    location: 'Salle des Spectacles - CCCZ, Avenue Kasavubu n°01, Gombe',
    image: '/images/evenements/projet_sefico_avril_2026.png',
    description:
      'Découvrez le cinéma congolais à travers la 3ème édition de la Semaine du Film Congolais (SEFICO) — une célébration de nos artistes cinéastes et réalisateurs de talent.',
    fullDescription: `SEMAINE DU FILM CONGOLAIS « SEFICO »

CONTEXTE & MOTIVATION :
Le cinéma en général et le film en particulier est un art qui véhicule l'identité culturelle de tout un peuple. Considéré comme le vecteur incontournable de l'économie innovante et du développement économique du pays, la RDC compte plusieurs cinéastes réalisateurs dont les œuvres restent largement inconnues de la population congolaise.

Face à l'absence d'un programme national de diffusion et promotion du cinéma congolais, le Centre Culturel Congolais « le Zoo » organise la 3ème édition de SEFICO pour diffuser et promouvoir les œuvres des artistes cinéastes réalisateurs congolais auprès du public congolais, spécialement la jeunesse estudiantine.

OBJECTIFS :
• Faire connaitre le cinéma congolais auprès de la population et la jeunesse scolaire
• Amener les jeunes à aimer et consommer le film congolais
• Favoriser un échange interactif entre les jeunes et les artistes réalisateurs congolais
• Favoriser une collaboration entre les parties prenantes du secteur culturel et artistique

PROGRAMME :
Diffusion d'un ou plusieurs films chaque jour, suivi d'un temps d'échange interactif entre le public (élèves) et les réalisateurs. Cérémonie d'ouverture et cérémonie de clôture.

PARTICIPANTS :
Environ 1000 personnes par jour : élèves des écoles partenaires, artistes, opérateurs culturels, chercheurs, scientifiques, étudiants, agents du ministère de la culture.`,
    category: 'cinema',
    participants: '~1000/jour',
    status: 'upcoming',
  },

  {
    id: 'special-30-juin',
    title: 'Spécial 30 Juin — Journée de l\'Indépendance de la RDC',
    date: '2026-06-30',
    time: '10:00',
    location: 'Salle des Spectacles - CCCZ, Avenue Kasavubu n°01, Gombe',
    image: '/images/evenements/expositio_tableaupresident.jpg',
    description:
      'Commémoration du 65ème anniversaire de l\'indépendance — Exposition des Présidents de la République, Ministres de la Culture et Dirigeants du CCCZ depuis 1960.',
    fullDescription: `PROJET SPÉCIAL 30 JUIN : « JOURNÉE DE L'INDÉPENDANCE DE LA RDC »

THÈME :
« Regard sur les Présidents de la République, les Ministres de la Culture, Arts et Patrimoines (de 1960 à nos jours) & les Dirigeants du Centre Culturel Congolais « le Zoo » depuis sa création »

CONTEXTE ET JUSTIFICATION :
Notre pays, la République Démocratique du Congo, compte plusieurs personnalités qui ont marqué son histoire dans différents domaines (politique, économique, culturel, social, militaire, spirituel). Leurs œuvres et réalisations méritent d'être mieux connues de la population.

Soucieux de former, informer et faire découvrir l'histoire, les exploits et réalisations de nos dirigeants, le Centre Culturel Congolais « le Zoo » organise cette activité d'exposition des photographies des différents Présidents de la République, des Ministres de la Culture depuis 1960, ainsi que des différents Directeurs Généraux du CCCZ.

OBJECTIFS :
GLOBAL : Faire connaitre aux cadres, agents et au public les figures dirigeantes de la RDC et du ministère de la Culture, inculquant l'amour de la patrie et le vouloir bien servir la nation.

SPÉCIFIQUES :
• Apprendre au public l'histoire des dignitaires ayant marqué notre pays dans le domaine culturel
• Donner un aperçu des exploits réalisés par nos dirigeants depuis le 30 juin 1960

PROGRAMME :
• Mot de circonstance de la Directrice Générale du CCCZ
• Projection documentaire sur les différents Présidents de la RDC
• Visite des expositions photos
• Interlude musicale avec les cadres du CCCZ
• Percussion - Groupe TUTA NGOMA
• Interview média avec Mme la DG
• Cocktail

HORAIRE : de 10h00 à 15h00

INVITÉS :
• Cabinet du Ministre de la Culture, Arts et Patrimoines
• Secrétariat Général du Ministère
• Groupe Tuta Ngoma`,
    category: 'independence',
    status: 'upcoming',
  },

  {
    id: 'jif-2026-conference',
    title: 'Journée Internationale de la Femme — Conférence-Débat & Visite Musée',
    date: '2026-03-08',
    time: '11:00',
    location: 'Salle des Spectacles - CCCZ + Musée National de RDC',
    image: '/images/evenements/mois_de_la_femme.mp4',
    description:
      'Conférence-débat autour du thème national de la Journée Internationale de la Femme 2026, suivie d\'une visite guidée au Musée National.',
    fullDescription: `MOIS DE LA FEMME — ACTIVITÉ 1
CONFÉRENCE-DÉBAT & VISITE GUIDÉE AU MUSÉE NATIONAL DE LA RDC (8 mars 2026)

CONTEXTE ET JUSTIFICATION :
Le système des Nations-Unies consacre la date du 08 mars de chaque année à la célébration des droits de la femme avec des thèmes définis sur le plan national et international.

Revêtant un caractère culturel, le Centre Culturel Congolais « le Zoo » ne pouvait pas laisser passer cette journée inaperçue et organise une conférence-débat dont le sujet sera tiré du thème national de la JIF 2026.

PROGRAMME :
• Conférence-débat (11h00)
• Partage d'expérience et témoignages par des femmes du CCCZ
• Exposition d'œuvres d'arts par des femmes artistes
• Visite guidée au Musée National (13h00)
• Cocktail après la visite

BÉNÉFICIAIRES :
Tout le personnel du Ministère de la Culture, Arts et Patrimoines, particulièrement les femmes du CCCZ.

RESSOURCES HUMAINES :
• Conférencières expertes
• Animatrices
• Artistes femmes pour exposition
• Agents techniques et protocole

RESSOURCES MATÉRIELLES :
• Salle des spectacles
• Sonorisation
• Communication médiatique
• Transport (taxi bus pour visite musée)`,
    category: 'womens-month',
    status: 'upcoming',
  },

  {
    id: 'theatre-mondial-2026',
    title: 'Journée Mondiale du Théâtre — Femmes au Théâtre',
    date: '2026-03-27',
    time: '14:00',
    location: 'Salle des Spectacles - CCCZ, Avenue Kasavubu n°01, Gombe',
    image: '/images/evenements/théâtre.jpg',
    description:
      'Spectacle de théâtre par la Compagnie Théâtre National, défilé de mode, percussions et poésies — célébration de la Journée Mondiale du Théâtre et clôture du Mois de la Femme.',
    fullDescription: `MOIS DE LA FEMME — ACTIVITÉ 2
SPECTACLE DE THÉÂTRE (27 mars 2026) — Journée Mondiale du Théâtre

CONTEXTE ET JUSTIFICATION :
La date du 27 mars est consacrée à la célébration de la Journée Mondiale du Théâtre, journée qui s'inscrit pleinement dans la mission, le but et objectifs du CCCZ.

Un spectacle de théâtre sera organisé et joué par la Compagnie Théâtre National en partenariat avec la CTN. Cette date marque également la clôture du mois de mars, mois dédié à la femme.

PROGRAMME :
• Spectacle de théâtre par la Compagnie Théâtre National (14h00)
• Défilé de mode par les femmes du CCCZ (supervision : Josaphat MULUNGU)
• Percussion tam-tam - Groupe TUTA NGOMA
• Poème par une dame du CCCZ

BÉNÉFICIAIRES :
Personnel du Ministère de la Culture, Arts et Patrimoines, artistes, étudiants, invités.

RESSOURCES HUMAINES :
• Artistes et animateurs du CCCZ
• Techniciens et informaticiens
• Compagnie Théâtre National

RESSOURCES MATÉRIELLES :
• Location chaises
• Sonorisation
• Médias et communication`,
    category: 'womens-month',
    status: 'upcoming',
  },

  // Events legacy
  {
    id: 'festival-jeune-creation',
    title: 'Festival Jeune Création',
    date: '2026-05-12',
    location: 'Place des Arts',
    image: '/images/galerie/futures01.jpg',
    description: 'Festival célébrant les jeunes talents créatifs du Congo.',
    fullDescription: 'Festival Jeune Création',
    category: 'cultural',
    status: 'upcoming',
  },
  {
    id: 'atelier-numerique',
    title: 'Atelier Numérique',
    date: '2026-04-20',
    location: 'CCC Le Zoo',
    image: '/images/galerie/exposition01.jpg',
    description: 'Atelier de formation aux technologies numériques.',
    fullDescription: 'Atelier Numérique',
    category: 'workshop',
    status: 'upcoming',
  },
];

export default events;
