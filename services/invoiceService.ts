import { Invoice } from '@/types';
import { mockInvoices } from '@/data';
import { delay } from '@/utils/delay';

/**
 * Returns the invoice associated with a given order ID, or null if none exists.
 */
export const getInvoiceByOrderId = async (orderId: string): Promise<Invoice | null> => {
  await delay(500);
  return mockInvoices.find((inv) => inv.orderId === orderId) ?? null;
};

/**
 * Returns all invoices.
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  await delay(500);
  return mockInvoices;
};
