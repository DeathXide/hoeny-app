/**
 * Formats a number as Indian Rupee currency string.
 * Example: 1234.5 → "₹1,234"
 * Uses the Indian numbering system (lakhs/crores grouping).
 */
export const formatCurrency = (amount: number): string => {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('en-IN');
  return `₹${formatted}`;
};
