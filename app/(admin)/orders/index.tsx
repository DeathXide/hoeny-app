import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Menu,
  IconButton,
  Chip,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useOrderStore } from '@/store/orderStore';
import { useShallow } from 'zustand/react/shallow';
import { Order, OrderStatus } from '@/types';
import StatusBadge from '@/components/order/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_FILTERS: { label: string; value: OrderStatus | null }[] = [
  { label: 'All', value: null },
  { label: 'Pending', value: OrderStatus.PENDING },
  { label: 'Confirmed', value: OrderStatus.CONFIRMED },
  { label: 'Processing', value: OrderStatus.PROCESSING },
  { label: 'Shipped', value: OrderStatus.SHIPPED },
  { label: 'Delivered', value: OrderStatus.DELIVERED },
  { label: 'Cancelled', value: OrderStatus.CANCELLED },
];

const NEXT_STATUS: Record<string, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.RETURNED]: [],
};

export default function AdminOrderListScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore(
    useShallow((s) => ({
      orders: s.orders,
      isLoading: s.isLoading,
      fetchOrders: s.fetchOrders,
      updateOrderStatus: s.updateOrderStatus,
    })),
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setMenuVisible(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const nextStatuses = NEXT_STATUS[item.status] || [];

    return (
      <Card className="mx-4 mb-3" style={{ backgroundColor: '#FFFBF5', marginHorizontal: 16, marginBottom: 12 }}>
        <Card.Content>
          <View className="flex-row items-center justify-between mb-2" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text variant="titleSmall" className="font-bold" style={{ fontWeight: 'bold' }}>
              {item.orderNumber}
            </Text>
            <View className="flex-row items-center">
              <StatusBadge status={item.status} />
              {nextStatuses.length > 0 && (
                <Menu
                  visible={menuVisible === item.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={18}
                      onPress={() => setMenuVisible(item.id)}
                    />
                  }
                >
                  {nextStatuses.map((status) => (
                    <Menu.Item
                      key={status}
                      onPress={() => handleStatusChange(item.id, status)}
                      title={`Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                    />
                  ))}
                </Menu>
              )}
            </View>
          </View>
          <Text variant="bodyMedium" style={{ color: '#52443B' }}>
            {item.distributorName}
          </Text>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            by {item.salesExecutiveName}
          </Text>
          <View className="flex-row items-center justify-between mt-2" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              {formatDate(item.orderDate)} | {item.totalItems} items
            </Text>
            <Text variant="titleSmall" className="font-bold" style={{ color: '#D4A574', fontWeight: 'bold' }}>
              Rs. {item.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="eye"
            size={18}
            onPress={() => router.push(`/(admin)/orders/${item.id}`)}
          />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Manage Orders" />
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
          title="No Orders"
          description={
            statusFilter
              ? `No ${statusFilter} orders found`
              : 'No orders in the system'
          }
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
