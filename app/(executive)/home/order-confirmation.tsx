import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  TextInput,
  Button,
  DataTable,
  Dialog,
  Portal,
  Divider,
  Surface,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useDistributorStore } from '@/store/distributorStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const user = useAuthStore((s) => s.user);
  const selectedDistributor = useDistributorStore((s) => s.selectedDistributor);
  const createOrder = useOrderStore((s) => s.createOrder);

  const { items, subtotal, gstRate, gstAmount, totalAmount, clearCart } = useCartStore(
    useShallow((s) => ({
      items: s.items,
      subtotal: s.subtotal,
      gstRate: s.gstRate,
      gstAmount: s.gstAmount,
      totalAmount: s.totalAmount,
      clearCart: s.clearCart,
    })),
  );

  const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = createOrder(
      selectedDistributor?.id || '',
      selectedDistributor?.businessName || '',
      items,
      user?.id || '',
      user?.name || '',
      notes || undefined,
    );

    setPlacedOrderId(order.id);
    setIsPlacing(false);
    setShowSuccess(true);
  };

  const handleViewInvoice = () => {
    setShowSuccess(false);
    router.replace(`/(executive)/orders/${placedOrderId}`);
  };

  const handleBackHome = () => {
    setShowSuccess(false);
    router.replace('/(executive)/home');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Confirm Order" />
      </Appbar.Header>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title
            title="Distributor Info"
            titleVariant="titleMedium"
            left={(props) => (
              <View
                {...props}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: '#D4A574' }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                  {selectedDistributor?.businessName?.charAt(0) || 'D'}
                </Text>
              </View>
            )}
          />
          <Card.Content>
            <Text variant="bodyLarge" className="font-bold">
              {selectedDistributor?.businessName}
            </Text>
            <Text variant="bodyMedium" style={{ color: '#85736A' }}>
              {selectedDistributor?.ownerName}
            </Text>
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              {selectedDistributor?.city}, {selectedDistributor?.state} - {selectedDistributor?.pincode}
            </Text>
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              GST: {selectedDistributor?.gstNumber}
            </Text>
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Order Items" titleVariant="titleMedium" />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Price</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>
              {items.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>
                    <Text variant="bodySmall" numberOfLines={1}>
                      {item.productName}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.unitPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{formatCurrency(item.totalPrice)}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            <Divider className="my-2" style={{ marginVertical: 8 }} />
            <View className="flex-row justify-between py-1">
              <Text variant="bodyMedium">Subtotal</Text>
              <Text variant="bodyMedium">{formatCurrency(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text variant="bodyMedium">GST ({gstRate}%)</Text>
              <Text variant="bodyMedium">{formatCurrency(gstAmount)}</Text>
            </View>
            <Divider className="my-1" style={{ marginVertical: 4 }} />
            <View className="flex-row justify-between py-1">
              <Text variant="titleMedium" className="font-bold">
                Grand Total
              </Text>
              <Text
                variant="titleMedium"
                className="font-bold"
                style={{ color: '#D4A574' }}
              >
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card className="mb-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 16 }}>
          <Card.Title title="Order Notes" titleVariant="titleMedium" />
          <Card.Content>
            <TextInput
              mode="outlined"
              placeholder="Add any special instructions..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <Surface
        className="px-4 py-3 flex-row items-center justify-between"
        style={{ backgroundColor: '#FFFBF5', elevation: 4, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            Grand Total
          </Text>
          <Text variant="titleLarge" className="font-bold" style={{ color: '#D4A574', fontWeight: 'bold' }}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={isPlacing}
          disabled={isPlacing || items.length === 0}
          contentStyle={{ paddingVertical: 4, paddingHorizontal: 16 }}
        >
          Place Order
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={showSuccess} dismissable={false}>
          <Dialog.Icon icon="check-circle" size={48} color="#66BB6A" />
          <Dialog.Title style={{ textAlign: 'center' }}>Order Placed!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#85736A' }}>
              Your order has been placed successfully and is being processed.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: 'center' }}>
            <Button onPress={handleViewInvoice}>View Invoice</Button>
            <Button mode="contained" onPress={handleBackHome}>
              Back to Home
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
