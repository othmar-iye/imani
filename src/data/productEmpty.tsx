// data/productEmpty.ts
// Fichier SIMULATION - Base de données vide

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
    photo: string;
    rating: number;
    verified: boolean;
    responseRate: string;
    responseTime: string;
    itemsSold: number;
  };
  images: string[];
}

// ⚠️ TABLEAU VIDE - Simulation d'une base de données sans produits
export const featuredProducts: Product[] = [
  // Aucun produit - tableau vide
  // Ceci simule :
  // - Une app neuve sur les stores
  // - Une catégorie sans articles
  // - Des filtres qui ne retournent rien
];