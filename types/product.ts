export enum Gender {
  BOYS = 'boys',
  GIRLS = 'girls',
  UNISEX = 'unisex',
}

export enum ProductCategory {
  SHIRTS = 'shirts',
  PANTS = 'pants',
  SHORTS = 'shorts',
  T_SHIRTS = 't-shirts',
  JACKETS = 'jackets',
  JEANS = 'jeans',
  KURTAS = 'kurtas',
  DRESSES = 'dresses',
  TOPS = 'tops',
  SKIRTS = 'skirts',
  LEGGINGS = 'leggings',
  FROCKS = 'frocks',
  SALWAR_SETS = 'salwar-sets',
  TRACK_PANTS = 'track-pants',
  SWEATERS = 'sweaters',
  INNERWEAR = 'innerwear',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: ProductCategory;
  gender: Gender;
  price: number;
  wholesalePrice: number;
  totalStock: number;
  imageUrl: string;
  color: string;
  material: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | null;
  gender: Gender | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
}
