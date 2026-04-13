import React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 1,
  maxQuantity = 999,
}: QuantitySelectorProps) {
  return (
    <View className="flex-row items-center">
      <IconButton
        icon="minus"
        mode="outlined"
        size={16}
        onPress={onDecrement}
        disabled={quantity <= minQuantity}
      />
      <Text variant="titleMedium" className="mx-2 min-w-[32px] text-center font-bold">
        {quantity}
      </Text>
      <IconButton
        icon="plus"
        mode="outlined"
        size={16}
        onPress={onIncrement}
        disabled={quantity >= maxQuantity}
      />
    </View>
  );
}
