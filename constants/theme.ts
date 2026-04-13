import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#D4A574',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFE0B2',
    onPrimaryContainer: '#321300',
    secondary: '#8D6E63',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFDCC2',
    onSecondaryContainer: '#2B1708',
    tertiary: '#606134',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#E6E6AD',
    onTertiaryContainer: '#1C1D00',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#FFF8F0',
    onBackground: '#201A17',
    surface: '#FFFBF5',
    onSurface: '#201A17',
    surfaceVariant: '#F4DED3',
    onSurfaceVariant: '#52443B',
    outline: '#85736A',
    outlineVariant: '#D7C3B8',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: '#FEF1EB',
      level2: '#F8EBE5',
      level3: '#F3E5DF',
      level4: '#F0E2DC',
      level5: '#EDDFD9',
    },
  },
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: '#FFA726',
  confirmed: '#42A5F5',
  processing: '#AB47BC',
  shipped: '#26C6DA',
  delivered: '#66BB6A',
  cancelled: '#EF5350',
  returned: '#78909C',
};

export const ORDER_STATUS_BG_COLORS: Record<string, string> = {
  pending: '#FFF3E0',
  confirmed: '#E3F2FD',
  processing: '#F3E5F5',
  shipped: '#E0F7FA',
  delivered: '#E8F5E9',
  cancelled: '#FFEBEE',
  returned: '#ECEFF1',
};
