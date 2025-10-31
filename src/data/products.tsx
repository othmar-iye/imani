// data/products.ts
export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  isFavorite: boolean;
  description: string;
  condition: string;
  location: string;
  views: number;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    responseRate: string;
    responseTime: string;
    itemsSold: number;
  };
  images: string[];
}

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    category: 'Chaussures',
    subCategory: 'Baskets & Sneakers',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Chaussures de sport Nike Air Max 270 avec technologie Air Max révolutionnaire pour un confort optimal et un style moderne.',
    condition: 'Neuf',
    location: 'Lubumbashi',
    views: 156,
    seller: {
      id: 'SEL_0042',
      name: 'Sports Pro',
      rating: 4.8,
      verified: true,
      responseRate: '95%',
      responseTime: '1h',
      itemsSold: 42
    },
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    category: 'Électronique',
    subCategory: 'Téléphones & Smartphones',
    price: 999.99,
    originalPrice: 1199.99,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'iPhone 14 Pro avec écran Super Retina XDR, puce A16 Bionic et système de caméra professionnel. État impeccable.',
    condition: 'Comme neuf',
    location: 'Kinshasa',
    views: 289,
    seller: {
      id: 'SEL_0127',
      name: 'Tech Store',
      rating: 4.9,
      verified: true,
      responseRate: '98%',
      responseTime: '30min',
      itemsSold: 127
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    category: 'Électronique',
    subCategory: 'Ordinateurs & Tablettes',
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'MacBook Air avec puce M2, écran Liquid Retina 13.6 pouces, 8 Go de mémoire unifiée. Parfait pour le travail et les études.',
    condition: 'Très bon état',
    location: 'Lubumbashi',
    views: 203,
    seller: {
      id: 'SEL_0089',
      name: 'Apple Certified',
      rating: 4.7,
      verified: true,
      responseRate: '96%',
      responseTime: '2h',
      itemsSold: 89
    },
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '4',
    name: 'Montre Connectée Samsung',
    category: 'Accessoires',
    subCategory: 'Montres',
    price: 299.99,
    originalPrice: 349.99,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Montre connectée Samsung Galaxy Watch avec suivi de santé avancé, autonomie longue durée et design élégant.',
    condition: 'Neuf',
    location: 'Likasi',
    views: 134,
    seller: {
      id: 'SEL_0056',
      name: 'Gadget Pro',
      rating: 4.6,
      verified: true,
      responseRate: '92%',
      responseTime: '3h',
      itemsSold: 56
    },
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434493652601-8dabae5c8e2a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '5',
    name: 'Casque Audio Sony WH-1000XM4',
    category: 'Électronique',
    subCategory: 'Audio & Casques',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Casque audio sans fil Sony avec annulation de bruit avancée, son haute résolution et commandes tactiles intuitives.',
    condition: 'Excellent état',
    location: 'Kipushi',
    views: 178,
    seller: {
      id: 'SEL_0073',
      name: 'Audio Expert',
      rating: 4.8,
      verified: true,
      responseRate: '94%',
      responseTime: '1h',
      itemsSold: 73
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '6',
    name: 'Sac à Dos Urbain The North Face',
    category: 'Accessoires',
    subCategory: 'Sacs',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Sac à dos robuste et stylé de The North Face, parfait pour le quotidien, les voyages et les activités en plein air.',
    condition: 'Très bon état',
    location: 'Lubumbashi',
    views: 95,
    seller: {
      id: 'SEL_0034',
      name: 'Outdoor Gear',
      rating: 4.5,
      verified: true,
      responseRate: '90%',
      responseTime: '4h',
      itemsSold: 34
    },
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1577733966974-fb41e8eed7fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585916420730-06d2de370a95?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '7',
    name: 'Appareil Photo Canon EOS R6',
    category: 'Électronique',
    subCategory: 'Photo & Vidéo',
    price: 1899.99,
    originalPrice: 2199.99,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Appareil photo hybride Canon EOS R6 professionnel avec capteur plein format et stabilisation avancée.',
    condition: 'Comme neuf',
    location: 'Kinshasa',
    views: 87,
    seller: {
      id: 'SEL_0023',
      name: 'Photo Pro',
      rating: 4.9,
      verified: true,
      responseRate: '97%',
      responseTime: '45min',
      itemsSold: 23
    },
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '8',
    name: 'Bureau Gaming RGB',
    category: 'Meubles',
    subCategory: 'Mobilier de Bureau',
    price: 349.99,
    originalPrice: 429.99,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Bureau gaming avec éclairage RGB, plateau spacieux et design ergonomique pour les sessions de jeu prolongées.',
    condition: 'Neuf',
    location: 'Lubumbashi',
    views: 112,
    seller: {
      id: 'SEL_0018',
      name: 'Gaming Setup',
      rating: 4.4,
      verified: true,
      responseRate: '88%',
      responseTime: '5h',
      itemsSold: 18
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    ]
  }
];