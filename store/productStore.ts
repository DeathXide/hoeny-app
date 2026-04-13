import { create } from 'zustand';
import { Product, ProductFilters } from '@/types';
import { mockProducts } from '@/data';
import { generateId } from '@/utils/generateId';
import { filterProducts } from '@/utils/filterProducts';
import { delay } from '@/utils/delay';

interface ProductState {
  products: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  category: null,
  gender: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filters: { ...defaultFilters },
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    await delay(500);
    set({ products: mockProducts, isLoading: false });
  },

  setFilters: (filters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
  },

  getFilteredProducts: () => {
    const { products, filters } = get();
    return filterProducts(products, filters);
  },

  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id);
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  deleteProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  toggleProductActive: (id: string) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  },
}));
