import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { mockUsers, mockPasswords } from '@/data';
import { delay } from '@/utils/delay';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials): Promise<boolean> => {
    set({ isLoading: true, error: null });

    await delay(1000);

    const expectedPassword = mockPasswords[credentials.email];
    if (!expectedPassword || expectedPassword !== credentials.password) {
      set({
        isLoading: false,
        error: 'Invalid email or password',
        isAuthenticated: false,
        user: null,
      });
      return false;
    }

    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user) {
      set({
        isLoading: false,
        error: 'User account not found',
        isAuthenticated: false,
        user: null,
      });
      return false;
    }

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    return true;
  },

  logout: () => {
    // Clear cart on logout — using require to avoid circular import at module load
    const { useCartStore } = require('@/store/cartStore');
    useCartStore.getState().clearCart();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
