export interface Director {
    id: string;
    name: string;
    title: string;
    email: string;
    phone?: string;
    description: string;
    image?: string | null;
}

export const directors: Director[] = [
    {
        id: 'ngoie-paul',
        name: 'NGOIE KABONGO Paul',
        title: 'Directeur Général',
        email: 'paulngoie-dg@ccclezoo.cd',
        phone: '',
        description:
            "Directeur général engagé pour la promotion culturelle et la professionnalisation des activités du Centre. Expérience de terrain et vision stratégique pour valoriser le patrimoine.",
        image: '/images/directions/Directeur Général.png',
    },
    {
        id: 'lufinku-tyty',
        name: 'LUFINKU BUEKI Tyty',
        title: 'Directrice Générale Adjointe',
        email: 'tytylufinku-dga@ccclezoo.cd',
        phone: '',
        description:
            "Coordonne les opérations quotidiennes et accompagne la stratégie institutionnelle. Forte d'une expérience en gestion culturelle et partenariats.",
        image: '/images/directions/Directeur Générale Adjointe.png',
    },
    {
        id: 'odia-mamie',
        name: 'ODIA MBUYI Mamie',
        title: "Directrice de l'Administration",
        email: 'odiambuyi-da@ccclezoo.cd',
        phone: '',
        description:
            "Pilote les fonctions administratives et veille à la conformité des processus internes. Réputée pour sa rigueur et son sens de l'organisation.",
        image: '/images/directions/Directeur Administratif.png',
    },
    {
        id: 'kumba-stephanie',
        name: 'KUMBA NDILU Stéphanie',
        title: 'Directrice des Finances',
        email: 'stephaniekumba-df@ccclezoo.cd',
        phone: '',
        description:
            "Responsable des finances et de la transparence budgétaire. Elle assure la bonne allocation des ressources au service des projets culturels.",
        image: '/images/directions/Directeur de Finance.png',
    },
    {
        id: 'nakebadio-clavers',
        name: 'NAKEBADIO KANDA Clavers',
        title: 'Directeur de l’Animation et de la Préservation Culturelle et Artistique',
        email: 'clavernakebadio-dacpa@ccclezoo.cd',
        phone: '',
        description:
            "Coordinateur artistique, il impulse la programmation, la préservation du patrimoine immatériel et les collaborations avec les acteurs locaux.",
        image: '/images/directions/Directeur de l\'Animation.png',
    },
    {
        id: 'kanyere-darlene',
        name: 'KANYERE FURAHA Darlène',
        title: 'Directrice de la Bibliothèque',
        email: 'darlenefuraha-db@ccclezoo.cd',
        phone: '',
        description:
            "Chargée du développement des collections et de l'accès aux ressources culturelles pour la communauté et les chercheurs.",
        image: null,
    },
    {
        id: 'elebe-freddy',
        name: 'ELEBE MA MONZANGA Freddy',
        title: "Directeur de l'Intendance",
        email: 'freddyelebe-di@ccclezoo.cd',
        phone: '',
        description:
            "Assure la logistique, la maintenance et la qualité des espaces pour offrir des conditions optimales aux visiteurs et aux équipes.",
        image: '/images/directions/Directeur de l\'Intendance.png',
    },
];

export default directors;
