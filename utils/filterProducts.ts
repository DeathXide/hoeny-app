import { Product, ProductFilters } from '@/types';

/**
 * Filters an array of products by the given filter criteria.
 * All filters are AND-combined — every active filter must match.
 */
export const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter((product) => {
    // Search filter — matches name, SKU, or description (case-insensitive)
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== null && product.category !== filters.category) {
      return false;
    }

    // Gender filter
    if (filters.gender !== null && product.gender !== filters.gender) {
      return false;
    }

    // Min price filter (uses wholesale price)
    if (filters.minPrice !== null && product.wholesalePrice < filters.minPrice) {
      return false;
    }

    // Max price filter (uses wholesale price)
    if (filters.maxPrice !== null && product.wholesalePrice > filters.maxPrice) {
      return false;
    }

    // In-stock filter
    if (filters.inStockOnly && product.totalStock <= 0) {
      return false;
    }

    return true;
  });
};
