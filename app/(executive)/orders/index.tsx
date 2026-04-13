import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, Chip, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { Order, OrderStatus } from '@/types';
import OrderCard from '@/components/order/OrderCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_FILTERS: { label: string; value: OrderStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Pending', value: OrderStatus.PENDING },
  { label: 'Confirmed', value: OrderStatus.CONFIRMED },
  { label: 'Shipped', value: OrderStatus.SHIPPED },
  { label: 'Delivered', value: OrderStatus.DELIVERED },
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  const user = useAuthStore((s) => s.user);
  const { orders, isLoading, fetchOrders } = useOrderStore(
    useShallow((s) => ({
      orders: s.orders,
      isLoading: s.isLoading,
      fetchOrders: s.fetchOrders,
    })),
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const myOrders = orders.filter((o) => o.salesExecutiveId === user?.id);
  const filteredOrders = statusFilter
    ? myOrders.filter((o) => o.status === statusFilter)
    : myOrders;

  const handleOrderPress = (order: Order) => {
    router.push(`/(executive)/orders/${order.id}`);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Orders" />
      </Appbar.Header>

      <View className="px-4 py-3" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <FlatList
          horizontal
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={statusFilter === item.value}
              onPress={() => setStatusFilter(item.value)}
              className="mr-2"
              style={{ marginRight: 8 }}
              mode="outlined"
              showSelectedOverlay
            >
              {item.label}
            </Chip>
          )}
        />
      </View>

      {isLoading ? (
        <LoadingSpinner message="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="clipboard-text-off"
          title="No Orders Found"
          description={
            statusFilter
              ? `No ${statusFilter} orders found`
              : 'You have not placed any orders yet'
          }
          actionLabel="Create New Order"
          onAction={() => router.push('/(executive)/home/select-distributor')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-4" style={{ paddingHorizontal: 16 }}>
              <OrderCard order={item} onPress={handleOrderPress} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
