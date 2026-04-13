import '../global.css';
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const currentSegment = segments[0];

    // Don't redirect from splash screen (index)
    if (!currentSegment) return;

    const inAuthGroup = currentSegment === '(auth)';
    const inAdminGroup = currentSegment === '(admin)';
    const inExecutiveGroup = currentSegment === '(executive)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && user) {
      if (inAuthGroup) {
        if (user.role === UserRole.ADMIN) {
          router.replace('/(admin)/dashboard');
        } else {
          router.replace('/(executive)/home');
        }
      } else if (user.role === UserRole.ADMIN && inExecutiveGroup) {
        router.replace('/(admin)/dashboard');
      } else if (user.role === UserRole.SALES_EXECUTIVE && inAdminGroup) {
        router.replace('/(executive)/home');
      }
    }
  }, [isAuthenticated, user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(executive)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </AuthGate>
    </PaperProvider>
  );
}
