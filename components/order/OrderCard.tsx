import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Order } from '@/types';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity onPress={() => onPress(order)} activeOpacity={0.7}>
      <Card className="mb-3" style={{ backgroundColor: '#FFFBF5' }}>
        <Card.Content>
          <View className="flex-row items-center justify-between mb-2">
            <Text variant="titleSmall" className="font-bold">
              {order.orderNumber}
            </Text>
            <StatusBadge status={order.status} />
          </View>
          <Text variant="bodyMedium" style={{ color: '#52443B' }}>
            {order.distributorName}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              {formattedDate} | {order.totalItems} items
            </Text>
            <Text variant="titleSmall" className="font-bold" style={{ color: '#D4A574' }}>
              Rs. {order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
