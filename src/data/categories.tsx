// data/categories.ts
export interface Category {
  id: string;
  name: string; // Devient une clé de traduction
  icon: string;
  subCategories: string[]; // Deviennent des clés de traduction
}

// Utiliser des clés de traduction au lieu de texte brut
export const categories: Category[] = [
  {
    id: '1',
    name: 'categories.clothing',
    icon: 'shirt',
    subCategories: [
      'categories.sub.women',
      'categories.sub.men',
      'categories.sub.children',
      'categories.sub.maternity',
      'categories.sub.plusSize'
    ]
  },
  {
    id: '2',
    name: 'categories.shoes',
    icon: 'footsteps',
    subCategories: [
      'categories.sub.women',
      'categories.sub.men',
      'categories.sub.children',
      'categories.sub.sneakers',
      'categories.sub.sandals',
      'categories.sub.boots',
      'categories.sub.heels',
      'categories.sub.flats'
    ]
  },
  {
    id: '3',
    name: 'categories.accessories',
    icon: 'glasses',
    subCategories: [
      'categories.sub.bags',
      'categories.sub.jewelry',
      'categories.sub.watches',
      'categories.sub.glasses',
      'categories.sub.scarves',
      'categories.sub.hats',
      'categories.sub.belts'
    ]
  },
  {
    id: '4',
    name: 'categories.brands',
    icon: 'ribbon',
    subCategories: [
      'categories.sub.trendingBrands',
      'categories.sub.luxuryBrands',
      'categories.sub.vintageBrands',
      'categories.sub.smallBrands'
    ]
  },
  {
    id: '5',
    name: 'categories.beauty',
    icon: 'sparkles',
    subCategories: [
      'categories.sub.fragrances',
      'categories.sub.makeup',
      'categories.sub.skincare',
      'categories.sub.haircare',
      'categories.sub.hygiene'
    ]
  },
  {
    id: '6',
    name: 'categories.home',
    icon: 'home',
    subCategories: [
      'categories.sub.decoration',
      'categories.sub.homeLinens',
      'categories.sub.art',
      'categories.sub.lighting'
    ]
  },
  {
    id: '7',
    name: 'categories.others',
    icon: 'ellipsis-horizontal',
    subCategories: [
      'categories.sub.sports',
      'categories.sub.tech',
      'categories.sub.books',
      'categories.sub.toys',
      'categories.sub.creative'
    ]
  }
];