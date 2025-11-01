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
  createdAt: string;
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
    createdAt: '2025-01-15',
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
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 999.99,
    originalPrice: 1199.99,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'iPhone 14 Pro avec écran Super Retina XDR, puce A16 Bionic et système de caméra professionnel. État impeccable.',
    condition: 'Comme neuf',
    location: 'Kinshasa',
    views: 289,
    createdAt: '2025-01-10',
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
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'MacBook Air avec puce M2, écran Liquid Retina 13.6 pouces, 8 Go de mémoire unifiée. Parfait pour le travail et les études.',
    condition: 'Très bon état',
    location: 'Lubumbashi',
    views: 203,
    createdAt: '2024-12-20', 
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
    createdAt: '2025-01-05', 
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
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Casque audio sans fil Sony avec annulation de bruit avancée, son haute résolution et commandes tactiles intuitives.',
    condition: 'Excellent état',
    location: 'Kipushi',
    views: 178,
    createdAt: '2024-11-15',
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
    createdAt: '2025-01-12',
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
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 1899.99,
    originalPrice: 2199.99,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Appareil photo hybride Canon EOS R6 professionnel avec capteur plein format et stabilisation avancée.',
    condition: 'Comme neuf',
    location: 'Kinshasa',
    views: 87,
    createdAt: '2024-10-25',
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
      'https://images.unsplash.com/photo-1521334884684-d80222895322?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '8',
    name: 'Bureau Gaming RGB',
    category: 'Maison & Déco',
    subCategory: 'Décoration',
    price: 349.99,
    originalPrice: 429.99,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Bureau gaming avec éclairage RGB, plateau spacieux et design ergonomique pour les sessions de jeu prolongées.',
    condition: 'Neuf',
    location: 'Lubumbashi',
    views: 112,
    createdAt: '2025-01-08',
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
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '9',
    name: 'PlayStation 5 Edition Digital',
    category: 'Autres',
    subCategory: 'Jouets & Jeux',
    price: 449.99,
    originalPrice: 499.99,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Console PlayStation 5 Edition Digital avec SSD ultra-rapide, manuelle DualSense et compatibilité 4K. Livrée avec 2 jeux.',
    condition: 'Très bon état',
    location: 'Kinshasa',
    views: 267,
    createdAt: '2025-01-18',
    seller: {
      id: 'SEL_0095',
      name: 'Game Center',
      rating: 4.7,
      verified: true,
      responseRate: '96%',
      responseTime: '1h',
      itemsSold: 95
    },
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '10',
    name: 'Canapé d\'Angle en Cuir',
    category: 'Maison & Déco',
    subCategory: 'Décoration',
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Magnifique canapé d\'angle en cuir véritable, couleur marron, état impeccable. Parfait pour salon spacieux.',
    condition: 'Excellent état',
    location: 'Lubumbashi',
    views: 189,
    createdAt: '2024-12-05',
    seller: {
      id: 'SEL_0067',
      name: 'Maison & Design',
      rating: 4.6,
      verified: true,
      responseRate: '93%',
      responseTime: '2h',
      itemsSold: 67
    },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '11',
    name: 'Vélo de Route Professionnel',
    category: 'Autres',
    subCategory: 'Sports & Loisirs',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Vélo de route carbone professionnel, groupe Shimano 105, poids 8.5kg. Parfait pour compétition ou entraînement.',
    condition: 'Bon état',
    location: 'Kolwezi',
    views: 145,
    createdAt: '2025-01-14',
    seller: {
      id: 'SEL_0048',
      name: 'Cycling Pro',
      rating: 4.8,
      verified: true,
      responseRate: '95%',
      responseTime: '1h',
      itemsSold: 48
    },
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '12',
    name: 'Machine à Café Automatique',
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Machine à café automatique avec broyeur intégré, préparation de cappuccino, latte et expresso. Fonctionne parfaitement.',
    condition: 'Comme neuf',
    location: 'Likasi',
    views: 98,
    createdAt: '2025-01-20',
    seller: {
      id: 'SEL_0052',
      name: 'Electro Home',
      rating: 4.5,
      verified: true,
      responseRate: '91%',
      responseTime: '3h',
      itemsSold: 52
    },
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570194065650-2f016fdc1fd6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '13',
    name: 'Tapis Oriental Authentique',
    category: 'Maison & Déco',
    subCategory: 'Décoration',
    price: 459.99,
    originalPrice: 599.99,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Tapis oriental authentique en laine pure, dimensions 200x300cm, motifs traditionnels, excellent état de conservation.',
    condition: 'Bon état',
    location: 'Kinshasa',
    views: 76,
    createdAt: '2024-11-30',
    seller: {
      id: 'SEL_0039',
      name: 'Déco Tradition',
      rating: 4.4,
      verified: true,
      responseRate: '89%',
      responseTime: '4h',
      itemsSold: 39
    },
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '14',
    name: 'Drone DJI Mavic Air 2',
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 699.99,
    originalPrice: 899.99,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Drone DJI Mavic Air 2 avec caméra 4K, autonomie 34min, transmission OcuSync 2.0. Complet avec accessoires.',
    condition: 'Très bon état',
    location: 'Lubumbashi',
    views: 223,
    createdAt: '2025-01-16',
    seller: {
      id: 'SEL_0081',
      name: 'Drone Expert',
      rating: 4.9,
      verified: true,
      responseRate: '97%',
      responseTime: '45min',
      itemsSold: 81
    },
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524143986875-3b098d78b363?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '15',
    name: 'Guitare Acoustique Yamaha',
    category: 'Autres',
    subCategory: 'Sports & Loisirs',
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1558098329-a11cff621064?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Guitare acoustique Yamaha FG800, table d\'harmonie en épicéa, manche en nato. Son riche et équilibre parfait.',
    condition: 'Excellent état',
    location: 'Kinshasa',
    views: 134,
    createdAt: '2025-01-19',
    seller: {
      id: 'SEL_0059',
      name: 'Music Store',
      rating: 4.7,
      verified: true,
      responseRate: '94%',
      responseTime: '2h',
      itemsSold: 59
    },
    images: [
      'https://images.unsplash.com/photo-1558098329-a11cff621064?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '16',
    name: 'Télévision Samsung 55" 4K',
    category: 'Autres',
    subCategory: 'High-Tech',
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'TV Samsung 55 pouces QLED 4K, Smart TV, HDR, système de son intégré. Image cristalline et couleurs vibrantes.',
    condition: 'Neuf',
    location: 'Lubumbashi',
    views: 178,
    createdAt: '2025-01-17',
    seller: {
      id: 'SEL_0074',
      name: 'Electro Vision',
      rating: 4.6,
      verified: true,
      responseRate: '93%',
      responseTime: '3h',
      itemsSold: 74
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571415060716-baff5f4c3045?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '17',
    name: 'Trottinette Électrique Xiaomi',
    category: 'Autres',
    subCategory: 'Sports & Loisirs',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop',
    isFavorite: true,
    description: 'Trottinette électrique Xiaomi Pro 2, autonomie 45km, vitesse max 25km/h, pliable. Parfaite pour trajets urbains.',
    condition: 'Très bon état',
    location: 'Kolwezi',
    views: 156,
    createdAt: '2025-01-21',
    seller: {
      id: 'SEL_0045',
      name: 'Urban Mobility',
      rating: 4.5,
      verified: true,
      responseRate: '92%',
      responseTime: '2h',
      itemsSold: 45
    },
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ]
  },
  {
    id: '18',
    name: 'Montre Rolex Submariner',
    category: 'Accessoires',
    subCategory: 'Montres',
    price: 8999.99,
    originalPrice: 11999.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    isFavorite: false,
    description: 'Montre Rolex Submariner Date, acier inoxydable, cadran noir, bracelet Oyster. Pièce authentique avec papiers.',
    condition: 'Excellent état',
    location: 'Kinshasa',
    views: 89,
    createdAt: '2024-10-15',
    seller: {
      id: 'SEL_0012',
      name: 'Luxury Watches',
      rating: 4.9,
      verified: true,
      responseRate: '98%',
      responseTime: '30min',
      itemsSold: 12
    },
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfd9eb9001?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop'
    ]
  }
];