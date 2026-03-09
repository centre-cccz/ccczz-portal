export type PageSection = {
  title?: string;
  body: string;
};

export type PageData = {
  title: string;
  intro?: string;
  sections?: PageSection[];
};

export const pages: Record<string, PageData> = {
  // PAGES:START
  about: {
    title: "À propos du CCCZ",
    intro: "Centre Culturel Congolais Le Zoo - Promoteur de la création culturelle congolaise",
    sections: [
      {
        title: "Notre Mission",
        body: "Promouvoir la création, la formation et la préservation du patrimoine culturel congolais, en favorisant l'accès des jeunes aux arts et aux technologies. Le CCCZ est un lieu de convergence entre traditions et innovations, dédié à l'éducation artistique et à la création contemporaine."
      },
      {
        title: "Nos Valeurs",
        body: "Inclusion - Nous croyons en l'accès équitable à la culture pour tous.\n\nTransmission - Nous transmettons le savoir-faire et le patrimoine aux générations futures.\n\nInnovation culturelle - Nous intégrons les technologies modernes pour créer de nouvelles formes d'expression artistique."
      },
      {
        title: "Notre Positionnement",
        body: "Le CCCZ est un centre culturel national axé sur l'éducation, la création et le lien entre traditions et technologies. Nous sommes un acteur majeur de la scène culturelle congolaise, travaillant en partenariat avec les artistes, les institutions et les jeunes talents."
      }
    ]
  },
  directions: {
    title: "Les Directions du CCCZ",
    intro: "Découvrez l'organisation et les domaines d'activité du Centre Culturel Congolais Le Zoo",
    sections: [
      {
        title: "Direction Générale",
        body: "Pilote stratégique et gouvernance du CCCZ. Responsable de la vision institutionnelle, de la gestion administrative et des partenariats stratégiques."
      },
      {
        title: "Direction de l'Animation Culturelle et de la Programmation (DACPA)",
        body: "Crée et programme les événements culturels du CCCZ. Responsable des expositions, concerts, spectacles et festivals annuels. Gère la relation avec les artistes et créateurs."
      },
      {
        title: "Direction des Finances",
        body: "Gère les ressources financières et la comptabilité du CCCZ. Assure la durabilité financière par le budget, la facturation et les rapports de conformité."
      },
      {
        title: "Bibliothèque et Archives",
        body: "Préserve et rend accessible le patrimoine documentaire. Gère les collections livres, archives, données historiques et contenu culturel numérique."
      },
      {
        title: "Intendance",
        body: "Assure la maintenance, la sécurité et la gestion des installations du CCCZ. Coordonne les services de logistique et les opérations quotidiennes."
      }
    ]
  },
  evenements: {
    title: "Événements et Programmation",
    intro: "Explorez le calendrier culturel riche du CCCZ",
    sections: [
      {
        title: "Expositions",
        body: "Le CCCZ accueille des expositions temporaires mettant en avant les artistes congolais et africains contemporains. Nos espaces permettent des installations innovantes et des formats expérimentaux."
      },
      {
        title: "Concerts et Spectacles",
        body: "Découvrez la musique congolaise traditionnelle et contemporaine. Du rumba classique aux nouveaux sons urbains, nous présentons les meilleurs artistes de la scène musicale congolaise."
      },
      {
        title: "Ateliers et Formation",
        body: "Participez à nos ateliers de danse, musique, arts plastiques et technologie. Des formations accessibles pour tous les niveaux, du débutant au professionnel."
      },
      {
        title: "Festivals Annuels",
        body: "Rejoignez-nous pour les grandes manifestations du calendrier culturel: Festival de la Danse, Festival de la Musique Urbaine, Biennale d'Art Contemporain."
      }
    ]
  },
  espaces: {
    title: "Nos Espaces",
    intro: "Découvrez les lieux emblématiques du CCCZ",
    sections: [
      {
        title: "Salle Principale",
        body: "Capacité 500 places. Équipée pour concerts, spectacles et conférences. Acoustique professionnelle et technologie son/lumière de pointe."
      },
      {
        title: "Galerie d'Art",
        body: "Espace flexible pour expositions temporaires. Cimaises mobiles, éclairage professionnel, adapté à tous types d'installations artistiques."
      },
      {
        title: "Espace Jeunesse",
        body: "Studio de répétition, salle de workshop, espace création numérique. Dédié aux jeunes artistes et créateurs, avec accès à équipements professionnels."
      },
      {
        title: "Bibliothèque et Archives",
        body: "Collection de 10 000+ documents. Espace de recherche, consultation numérique, fonds spécialisé sur patrimoine congolais et musiques africaines."
      }
    ]
  },
  contact: {
    title: "Nous Contacter",
    intro: "Rejoignez la communauté culturelle du CCCZ",
    sections: [
      {
        title: "Adresse",
        body: "Centre Culturel Congolais Le Zoo\nKinshasa, République Démocratique du Congo"
      },
      {
        title: "Horaires",
        body: "Lundi - Vendredi: 09:00 - 18:00\nSamedi: 10:00 - 20:00\nDimanche: 10:00 - 18:00"
      },
      {
        title: "Pour nous Contacter",
        body: "Utilisez le formulaire de contact disponible ou écrivez-nous. Nous répondons à toutes les demandes dans les 48 heures."
      }
    ]
  },
  // PAGES:END
};

export function getPage(slug: string): PageData | undefined {
  return pages[slug];
}
