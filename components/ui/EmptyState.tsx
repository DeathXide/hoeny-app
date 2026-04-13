import React from 'react';
import { View } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Icon source={icon} size={72} color="#8D6E63" />
      <Text variant="headlineSmall" className="mt-4 text-center font-bold">
        {title}
      </Text>
      <Text variant="bodyMedium" className="mt-2 text-center" style={{ color: '#85736A' }}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
