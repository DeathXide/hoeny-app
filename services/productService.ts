import { Product } from '@/types';
import { mockProducts } from '@/data';
import { delay } from '@/utils/delay';

/**
 * Returns all products from the mock catalogue.
 */
export const getProducts = async (): Promise<Product[]> => {
  await delay(500);
  return mockProducts;
};

/**
 * Returns a single product by ID, or null if not found.
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  await delay(300);
  return mockProducts.find((p) => p.id === id) ?? null;
};

/**
 * Returns only active products.
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  await delay(500);
  return mockProducts.filter((p) => p.isActive);
};
