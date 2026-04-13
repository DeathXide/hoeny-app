import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function SplashScreen() {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isReady) {
    if (isAuthenticated && user) {
      if (user.role === UserRole.ADMIN) {
        return <Redirect href="/(admin)/dashboard" />;
      }
      return <Redirect href="/(executive)/home" />;
    }
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: '#D4A574' }}
    >
      <View className="items-center">
        <Text
          variant="displayMedium"
          style={{ color: '#FFFFFF', fontWeight: 'bold' }}
        >
          Honey App
        </Text>
        <Text
          variant="titleMedium"
          style={{ color: '#FFF8F0', marginTop: 8 }}
        >
          Clothing Distribution
        </Text>
      </View>
      <ActivityIndicator
        animating
        color="#FFFFFF"
        size="large"
        style={{ position: 'absolute', bottom: 80 }}
      />
    </View>
  );
}
