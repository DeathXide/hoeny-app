import React from 'react';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="select-distributor" />
      <Stack.Screen name="products" />
      <Stack.Screen name="order-confirmation" />
    </Stack>
  );
}
