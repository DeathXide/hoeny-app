import React, { useEffect, useState } from 'react';
import { View, ScrollView, Share } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  DataTable,
  Divider,
  Button,
  Surface,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types';
import StatusBadge from '@/components/order/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const getOrderById = useOrderStore((s) => s.getOrderById);
  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

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

  const handleShare = async () => {
    if (!order) return;
    try {
      await Share.share({
        message: `Order ${order.orderNumber}\nDistributor: ${order.distributorName}\nTotal: ${formatCurrency(order.totalAmount)}\nStatus: ${order.status}`,
      });
    } catch (_) {}
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

  const cgst = order.gstAmount / 2;
  const sgst = order.gstAmount / 2;

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Order Detail" />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
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
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                Order Date
              </Text>
              <Text variant="bodyMedium">{formatDate(order.orderDate)}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                Expected Delivery
              </Text>
              <Text variant="bodyMedium">{formatDate(order.expectedDeliveryDate)}</Text>
            </View>
            {order.deliveredDate && (
              <View className="flex-row justify-between mb-1">
                <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                  Delivered On
                </Text>
                <Text variant="bodyMedium">{formatDate(order.deliveredDate)}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Distributor" titleVariant="titleMedium" />
          <Card.Content>
            <Text variant="bodyLarge" className="font-bold">
              {order.distributorName}
            </Text>
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              ID: {order.distributorId}
            </Text>
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Order Items" titleVariant="titleMedium" />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Rate</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>
              {order.items.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>
                    <Text variant="bodySmall" numberOfLines={1}>
                      {item.productName}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.unitPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatCurrency(item.totalPrice)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Invoice Summary" titleVariant="titleMedium" />
          <Card.Content>
            <Surface className="rounded-lg p-4 mb-3" style={{ backgroundColor: '#FEF1EB', elevation: 0, borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <Text variant="titleSmall" className="font-bold mb-1" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                Honey Clothing Pvt. Ltd.
              </Text>
              <Text variant="bodySmall" style={{ color: '#85736A' }}>
                123, Industrial Area, Phase 2, New Delhi - 110020
              </Text>
              <Text variant="bodySmall" style={{ color: '#85736A' }}>
                GSTIN: 07AABCH1234F1Z5
              </Text>
            </Surface>

            <Text variant="labelLarge" className="font-bold mb-1" style={{ fontWeight: 'bold', marginBottom: 4 }}>
              Bill To:
            </Text>
            <Text variant="bodyMedium">{order.distributorName}</Text>
            <Divider className="my-3" style={{ marginVertical: 12 }} />

            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                Subtotal
              </Text>
              <Text variant="bodyMedium">{formatCurrency(order.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                CGST ({order.gstRate / 2}%)
              </Text>
              <Text variant="bodyMedium">{formatCurrency(cgst)}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                SGST ({order.gstRate / 2}%)
              </Text>
              <Text variant="bodyMedium">{formatCurrency(sgst)}</Text>
            </View>
            <Divider className="my-2" style={{ marginVertical: 8 }} />
            <View className="flex-row justify-between">
              <Text variant="titleMedium" className="font-bold">
                Total Amount
              </Text>
              <Text
                variant="titleMedium"
                className="font-bold"
                style={{ color: '#D4A574' }}
              >
                {formatCurrency(order.totalAmount)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {order.notes && (
          <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
            <Card.Title title="Notes" titleVariant="titleMedium" />
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: '#52443B' }}>
                {order.notes}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Surface
        className="px-4 py-3 flex-row justify-center"
        style={{ backgroundColor: '#FFFBF5', elevation: 4, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center' }}
      >
        <Button
          mode="outlined"
          icon="download"
          onPress={() => {}}
          className="mr-2 flex-1"
          style={{ marginRight: 8, flex: 1 }}
        >
          Download
        </Button>
        <Button
          mode="contained"
          icon="share-variant"
          onPress={handleShare}
          className="ml-2 flex-1"
          style={{ marginLeft: 8, flex: 1 }}
        >
          Share
        </Button>
      </Surface>
    </View>
  );
}
