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
    name: 'Vêtements',
    icon: 'shirt',
    subCategories: [
      'Femmes',
      'Hommes',
      'Enfants & Bébés',
      'Maternité',
      'Grandes Tailles'
    ]
  },
  {
    id: '2',
    name: 'Chaussures',
    icon: 'footsteps',
    subCategories: [
      'Femmes',
      'Hommes',
      'Enfants & Bébés',
      'Baskets & Sneakers',
      'Sandales & Tongs',
      'Bottes & Bottines',
      'Escarpins',
      'Chaussures plates'
    ]
  },
  {
    id: '3',
    name: 'Accessoires',
    icon: 'glasses',
    subCategories: [
      'Sacs',
      'Bijoux',
      'Montres',
      'Lunettes',
      'Écharpes & Foulards',
      'Chapeaux & Casquettes',
      'Ceintures'
    ]
  },
  {
    id: '4',
    name: 'Marques & Créateurs',
    icon: 'ribbon',
    subCategories: [
      'Marques Tendances',
      'Luxe & Créateurs',
      'Marques Vintage',
      'Petites Marques'
    ]
  },
  {
    id: '5',
    name: 'Beauté & Parfums',
    icon: 'sparkles',
    subCategories: [
      'Parfums',
      'Maquillage',
      'Soins de la peau',
      'Soins des cheveux',
      'Hygiène & Bien-être'
    ]
  },
  {
    id: '6',
    name: 'Maison & Déco',
    icon: 'home',
    subCategories: [
      'Décoration',
      'Linge de maison',
      'Art & Posters',
      'Luminaires'
    ]
  },
  {
    id: '7',
    name: 'Autres',
    icon: 'ellipsis-horizontal',
    subCategories: [
      'Sports & Loisirs',
      'High-Tech',
      'Livres & Médias',
      'Jouets & Jeux',
      'Matériel Créatif'
    ]
  }
];