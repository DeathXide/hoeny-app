import { CartItem } from '@/types';

const GST_RATE = 12; // 12% GST for clothing

/**
 * Calculates the subtotal from an array of cart items.
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
};

/**
 * Calculates GST amount at the clothing rate (12%) for the given subtotal.
 */
export const calculateGst = (subtotal: number, gstRate: number = GST_RATE): number => {
  return Math.round((subtotal * gstRate) / 100 * 100) / 100;
};

/**
 * Calculates the total amount (subtotal + GST).
 */
export const calculateTotal = (subtotal: number, gstRate: number = GST_RATE): number => {
  const gst = calculateGst(subtotal, gstRate);
  return Math.round((subtotal + gst) * 100) / 100;
};
