import React from 'react';
import { Stack } from 'expo-router';

export default function AdminDistributorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
