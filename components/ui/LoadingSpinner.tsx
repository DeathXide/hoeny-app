import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({
  message,
  size = 'large',
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator animating size={size} />
      {message && (
        <Text variant="bodyMedium" className="mt-4" style={{ color: '#85736A' }}>
          {message}
        </Text>
      )}
    </View>
  );
}
