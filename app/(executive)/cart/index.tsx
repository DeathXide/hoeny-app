import React from 'react';
import { View, FlatList, Image } from 'react-native';
import {
  Appbar,
  Text,
  Surface,
  IconButton,
  Button,
  Divider,
  Card,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useShallow } from 'zustand/react/shallow';
import { CartItem } from '@/types';
import QuantitySelector from '@/components/cart/QuantitySelector';
import EmptyState from '@/components/ui/EmptyState';

export default function CartScreen() {
  const router = useRouter();

  const {
    items,
    distributorName,
    subtotal,
    gstRate,
    gstAmount,
    totalAmount,
    clearCart,
    removeItem,
    incrementQuantity,
    decrementQuantity,
  } = useCartStore(
    useShallow((s) => ({
      items: s.items,
      distributorName: s.distributorName,
      subtotal: s.subtotal,
      gstRate: s.gstRate,
      gstAmount: s.gstAmount,
      totalAmount: s.totalAmount,
      clearCart: s.clearCart,
      removeItem: s.removeItem,
      incrementQuantity: s.incrementQuantity,
      decrementQuantity: s.decrementQuantity,
    })),
  );

  const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card className="mb-3 mx-4" style={{ backgroundColor: '#FFFBF5', marginBottom: 12, marginHorizontal: 16 }}>
      <Card.Content>
        <View className="flex-row">
          <View
            className="w-20 h-20 rounded-lg overflow-hidden mr-3"
            style={{ backgroundColor: '#F4DED3', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', marginRight: 12 }}
          >
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-2" style={{ flex: 1, marginRight: 8 }}>
                <Text variant="titleSmall" className="font-bold" numberOfLines={1} style={{ fontWeight: 'bold' }}>
                  {item.productName}
                </Text>
                <Text variant="bodySmall" style={{ color: '#85736A' }}>
                  {item.sku} | {item.color}
                </Text>
              </View>
              <IconButton
                icon="delete-outline"
                size={18}
                iconColor="#EF5350"
                onPress={() => removeItem(item.id)}
              />
            </View>
            <View className="flex-row items-center justify-between mt-1">
              <QuantitySelector
                quantity={item.quantity}
                onIncrement={() => incrementQuantity(item.id)}
                onDecrement={() => decrementQuantity(item.id)}
                maxQuantity={item.maxQuantity}
              />
              <View className="items-end">
                <Text variant="titleSmall" className="font-bold" style={{ color: '#D4A574' }}>
                  {formatCurrency(item.totalPrice)}
                </Text>
                <Text variant="bodySmall" style={{ color: '#85736A' }}>
                  {formatCurrency(item.unitPrice)} x {item.quantity}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (items.length === 0) {
    return (
      <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
        <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
          <Appbar.Content title="Cart" />
        </Appbar.Header>
        <EmptyState
          icon="cart-off"
          title="Your Cart is Empty"
          description="Start adding products to your cart by browsing our catalog."
          actionLabel="Browse Products"
          onAction={() => router.push('/(executive)/home/select-distributor')}
        />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Cart" />
        <Appbar.Action icon="delete-sweep" onPress={clearCart} />
      </Appbar.Header>

      {distributorName && (
        <Surface className="mx-4 mt-3 mb-2 px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#FEF1EB', elevation: 0, marginHorizontal: 16, marginTop: 12, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            Ordering for
          </Text>
          <Text variant="labelLarge" className="font-bold" style={{ color: '#52443B', fontWeight: 'bold' }}>
            {distributorName}
          </Text>
        </Surface>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      />

      <Surface
        className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-6"
        style={{ backgroundColor: '#FFFBF5', elevation: 8, position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
      >
        <View className="flex-row justify-between mb-1" style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text variant="bodyMedium" style={{ color: '#85736A' }}>
            Subtotal
          </Text>
          <Text variant="bodyMedium">{formatCurrency(subtotal)}</Text>
        </View>
        <View className="flex-row justify-between mb-1" style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text variant="bodyMedium" style={{ color: '#85736A' }}>
            GST ({gstRate}%)
          </Text>
          <Text variant="bodyMedium">{formatCurrency(gstAmount)}</Text>
        </View>
        <Divider className="my-2" style={{ marginVertical: 8 }} />
        <View className="flex-row justify-between mb-3" style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text variant="titleMedium" className="font-bold" style={{ fontWeight: 'bold' }}>
            Total
          </Text>
          <Text variant="titleMedium" className="font-bold" style={{ color: '#D4A574', fontWeight: 'bold' }}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => router.push('/(executive)/home/order-confirmation')}
          contentStyle={{ paddingVertical: 6 }}
        >
          Place Order
        </Button>
      </Surface>
    </View>
  );
}
