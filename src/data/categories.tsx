// data/categories.ts
export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Électronique',
    icon: 'laptop',
    subCategories: [
      'Smartphones & Accessoires',
      'Ordinateurs & Tablettes',
      'Audio & Casques',
      'Photo & Vidéo',
      'Gaming & Consoles',
      'Télévisions & Home Cinema',
      'Électroménager Connecté',
      'Drones & Robotique',
      'Montres Connectées',
      'Accessoires Électronique'
    ]
  },
  {
    id: '2',
    name: 'Habillement',
    icon: 'shirt',
    subCategories: [
      'Vêtements Femmes',
      'Vêtements Hommes',
      'Vêtements Enfants',
      'Vêtements Bébé',
      'Chaussures Femmes',
      'Chaussures Hommes',
      'Chaussures Enfants',
      'Sacs & Maroquinerie',
      'Bijoux & Montres',
      'Accessoires Mode',
      'Lunettes & Optique',
      'Sous-vêtements',
      'Maillots de bain'
    ]
  },
  {
    id: '3',
    name: 'Maison & Déco',
    icon: 'home',
    subCategories: [
      'Décoration Intérieure',
      'Luminaires & Éclairage',
      'Linge de Maison',
      'Art & Tableaux',
      'Meubles & Rangement',
      'Cuisine & Arts de la table',
      'Jardin & Extérieur',
      'Bricolage & Outillage',
      'Électroménager'
    ]
  },
  {
    id: '4',
    name: 'Sports & Loisirs',
    icon: 'basketball',
    subCategories: [
      'Équipement Sportif',
      'Vêtements Sport',
      'Chaussures Sport',
      'Fitness & Musculation',
      'Vélos & Mobilité',
      'Camping & Plein Air',
      'Pêche & Chasse',
      'Instruments de Musique',
      'Jeux & Jouets'
    ]
  },
  {
    id: '5',
    name: 'Livres & Médias',
    icon: 'book',
    subCategories: [
      'Livres & Romans',
      'BD & Mangas',
      'Livres Scolaires',
      'DVD & Blu-ray',
      'CD & Vinyles',
      'Jeux Vidéo',
      'Matériel Créatif',
      'Journaux & Magazines'
    ]
  },
  {
    id: '6',
    name: 'Autres',
    icon: 'ellipsis-horizontal',
    subCategories: [
      'Services & Prestations',
      'Billeterie & Événements',
      'Collection & Vintage',
      'Matériel Professionnel',
      'Agriculture & Jardinage',
      'Produits de Beauté',
      'Santé & Bien-être',
      'Autres catégories'
    ]
  }
];