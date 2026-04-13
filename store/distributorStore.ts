import { create } from 'zustand';
import { Distributor, DistributorStatus } from '@/types';
import { mockDistributors } from '@/data';
import { generateId } from '@/utils/generateId';
import { delay } from '@/utils/delay';

interface DistributorState {
  distributors: Distributor[];
  selectedDistributor: Distributor | null;
  isLoading: boolean;
  fetchDistributors: () => Promise<void>;
  selectDistributor: (id: string) => void;
  clearSelection: () => void;
  getActiveDistributors: () => Distributor[];
  addDistributor: (d: Omit<Distributor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDistributor: (id: string, updates: Partial<Distributor>) => void;
  deleteDistributor: (id: string) => void;
}

export const useDistributorStore = create<DistributorState>((set, get) => ({
  distributors: [],
  selectedDistributor: null,
  isLoading: false,

  fetchDistributors: async () => {
    set({ isLoading: true });
    await delay(500);
    set({ distributors: mockDistributors, isLoading: false });
  },

  selectDistributor: (id: string) => {
    const distributor = get().distributors.find((d) => d.id === id) ?? null;
    set({ selectedDistributor: distributor });
  },

  clearSelection: () => {
    set({ selectedDistributor: null });
  },

  getActiveDistributors: () => {
    return get().distributors.filter((d) => d.status === DistributorStatus.ACTIVE);
  },

  addDistributor: (d: Omit<Distributor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDistributor: Distributor = {
      ...d,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ distributors: [...state.distributors, newDistributor] }));
  },

  updateDistributor: (id: string, updates: Partial<Distributor>) => {
    set((state) => ({
      distributors: state.distributors.map((d) =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  },

  deleteDistributor: (id: string) => {
    set((state) => ({
      distributors: state.distributors.filter((d) => d.id !== id),
    }));
  },
}));
