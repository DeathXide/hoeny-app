import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

/**
 * Typed wrapper around react-native-paper's useTheme hook.
 * Returns the current MD3Theme so callers get full autocomplete.
 */
export const useAppTheme = (): MD3Theme => {
  return useTheme<MD3Theme>();
};
