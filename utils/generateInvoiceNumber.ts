/**
 * Generates an invoice number in the format "HNY/2426/INV-XXXX".
 * The "2426" represents the financial year (2024-2026 style shorthand).
 * The suffix is a random 4-digit number.
 */
export const generateInvoiceNumber = (): string => {
  const now = new Date();
  // Financial year: Apr-Mar. If month >= April, FY starts this year.
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const fyCode = `${fyStart.toString().slice(2)}${fyEnd.toString().slice(2)}`;
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `HNY/${fyCode}/INV-${suffix}`;
};
