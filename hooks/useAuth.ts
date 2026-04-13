import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store/authStore';

/**
 * Convenience hook that wraps authStore with useShallow to prevent
 * unnecessary re-renders when selecting multiple fields.
 */
export const useAuth = () => {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login: state.login,
      logout: state.logout,
      clearError: state.clearError,
    }))
  );
};
