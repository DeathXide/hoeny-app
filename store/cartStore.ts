import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { generateId } from '@/utils/generateId';

interface CartState {
  distributorId: string | null;
  distributorName: string | null;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  setDistributor: (id: string, name: string) => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  incrementQuantity: (cartItemId: string) => void;
  decrementQuantity: (cartItemId: string) => void;
  clearCart: () => void;
}

const GST_RATE = 12;

/** Recalculates derived totals from the current items array. */
const recalculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const gstAmount = Math.round((subtotal * GST_RATE) / 100 * 100) / 100;
  const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;

  return { totalItems, subtotal, gstAmount, totalAmount };
};

const initialState = {
  distributorId: null as string | null,
  distributorName: null as string | null,
  items: [] as CartItem[],
  totalItems: 0,
  subtotal: 0,
  gstRate: GST_RATE,
  gstAmount: 0,
  totalAmount: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  ...initialState,

  setDistributor: (id: string, name: string) => {
    set({ distributorId: id, distributorName: name });
  },

  addItem: (product: Product, quantity: number) => {
    const { items } = get();
    const existingIndex = items.findIndex((item) => item.productId === product.id);

    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      // Product already in cart — increment quantity
      updatedItems = items.map((item, index) => {
        if (index === existingIndex) {
          const newQty = item.quantity + quantity;
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice,
          };
        }
        return item;
      });
    } else {
      // New item
      const newItem: CartItem = {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        color: product.color,
        quantity,
        unitPrice: product.wholesalePrice,
        totalPrice: product.wholesalePrice * quantity,
        maxQuantity: product.totalStock,
        imageUrl: product.imageUrl,
      };
      updatedItems = [...items, newItem];
    }

    set({ items: updatedItems, ...recalculateTotals(updatedItems) });
  },

  removeItem: (cartItemId: string) => {
    const updatedItems = get().items.filter((item) => item.id !== cartItemId);
    set({ items: updatedItems, ...recalculateTotals(updatedItems) });
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }

    const updatedItems = get().items.map((item) => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    });

    set({ items: updatedItems, ...recalculateTotals(updatedItems) });
  },

  incrementQuantity: (cartItemId: string) => {
    const item = get().items.find((i) => i.id === cartItemId);
    if (item) {
      get().updateQuantity(cartItemId, item.quantity + 1);
    }
  },

  decrementQuantity: (cartItemId: string) => {
    const item = get().items.find((i) => i.id === cartItemId);
    if (item) {
      get().updateQuantity(cartItemId, item.quantity - 1);
    }
  },

  clearCart: () => {
    set({ ...initialState });
  },
}));
