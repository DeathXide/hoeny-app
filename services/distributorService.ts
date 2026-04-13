import { Distributor } from '@/types';
import { mockDistributors } from '@/data';
import { delay } from '@/utils/delay';

/**
 * Returns all distributors.
 */
export const getDistributors = async (): Promise<Distributor[]> => {
  await delay(500);
  return mockDistributors;
};

/**
 * Returns a single distributor by ID, or null if not found.
 */
export const getDistributorById = async (id: string): Promise<Distributor | null> => {
  await delay(300);
  return mockDistributors.find((d) => d.id === id) ?? null;
};
