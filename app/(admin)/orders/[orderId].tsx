import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  DataTable,
  Divider,
  Button,
  Menu,
  Surface,
  Snackbar,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrderStore } from '@/store/orderStore';
import { useShallow } from 'zustand/react/shallow';
import { Order, OrderStatus } from '@/types';
import StatusBadge from '@/components/order/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

const NEXT_STATUS: Record<string, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.RETURNED]: [],
};

export default function AdminOrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const { orders, fetchOrders, updateOrderStatus } = useOrderStore(
    useShallow((s) => ({
      orders: s.orders,
      fetchOrders: s.fetchOrders,
      updateOrderStatus: s.updateOrderStatus,
    })),
  );

  useEffect(() => {
    const loadOrder = async () => {
      if (orders.length === 0) {
        await fetchOrders();
      }
      const found = useOrderStore.getState().getOrderById(orderId || '');
      setOrder(found);
      setLoading(false);
    };
    loadOrder();
  }, [orderId, orders.length]);

  useEffect(() => {
    const found = orders.find((o) => o.id === orderId);
    if (found) setOrder(found);
  }, [orders, orderId]);

  const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (order) {
      updateOrderStatus(order.id, newStatus);
      setMenuVisible(false);
      setSnackMessage(`Order status updated to ${newStatus}`);
      setSnackVisible(true);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (!order) {
    return (
      <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
        <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Order Detail" />
        </Appbar.Header>
        <EmptyState
          icon="file-document-remove"
          title="Order Not Found"
          description="The order you are looking for does not exist."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const nextStatuses = NEXT_STATUS[order.status] || [];

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Order Detail" />
      </Appbar.Header>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Content>
            <View className="flex-row items-center justify-between mb-3" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text variant="titleLarge" className="font-bold" style={{ fontWeight: 'bold' }}>
                {order.orderNumber}
              </Text>
              <StatusBadge status={order.status} />
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>Order Date</Text>
              <Text variant="bodyMedium">{formatDate(order.orderDate)}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>Sales Executive</Text>
              <Text variant="bodyMedium">{order.salesExecutiveName}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>Distributor</Text>
              <Text variant="bodyMedium">{order.distributorName}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>Payment</Text>
              <Text variant="bodyMedium">{order.paymentStatus}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Items" titleVariant="titleMedium" />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Rate</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>
              {order.items.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>
                    <Text variant="bodySmall" numberOfLines={1}>{item.productName}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.unitPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{formatCurrency(item.totalPrice)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            <Divider className="my-2" style={{ marginVertical: 8 }} />
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>Subtotal</Text>
              <Text variant="bodyMedium">{formatCurrency(order.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>GST ({order.gstRate}%)</Text>
              <Text variant="bodyMedium">{formatCurrency(order.gstAmount)}</Text>
            </View>
            <Divider className="my-1" style={{ marginVertical: 4 }} />
            <View className="flex-row justify-between">
              <Text variant="titleMedium" className="font-bold">Total</Text>
              <Text variant="titleMedium" className="font-bold" style={{ color: '#D4A574' }}>
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {order.notes && (
          <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
            <Card.Title title="Notes" titleVariant="titleMedium" />
            <Card.Content>
              <Text variant="bodyMedium">{order.notes}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {nextStatuses.length > 0 && (
        <Surface
          className="px-4 py-3 flex-row items-center justify-center"
          style={{ backgroundColor: '#FFFBF5', elevation: 4, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="contained"
                onPress={() => setMenuVisible(true)}
                icon="update"
              >
                Update Status
              </Button>
            }
          >
            {nextStatuses.map((status) => (
              <Menu.Item
                key={status}
                onPress={() => handleStatusChange(status)}
                title={status.charAt(0).toUpperCase() + status.slice(1)}
              />
            ))}
          </Menu>
        </Surface>
      )}

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
}
