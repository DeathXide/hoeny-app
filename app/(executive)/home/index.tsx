import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Text,
  Surface,
  Avatar,
  Card,
  IconButton,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useShallow } from 'zustand/react/shallow';
import { Order } from '@/types';
import StatCard from '@/components/admin/StatCard';
import OrderCard from '@/components/order/OrderCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ScreenWrapper from '@/components/ui/ScreenWrapper';

export default function HomeScreen() {
  const router = useRouter();
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

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? 'Good morning'
      : now.getHours() < 17
        ? 'Good afternoon'
        : 'Good evening';
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const myOrders = orders.filter((o) => o.salesExecutiveId === user?.id);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const ordersThisMonth = myOrders.filter((o) => {
    const d = new Date(o.orderDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const revenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = myOrders.filter((o) => o.status === 'pending').length;
  const distributorCount = new Set(myOrders.map((o) => o.distributorId)).size;
  const recentOrders = myOrders.slice(0, 3);

  const handleOrderPress = (order: Order) => {
    router.push(`/(executive)/orders/${order.id}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#D4A574' }}>
        <Appbar.Content title="Honey App" titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }} />
        <Appbar.Action icon="bell-outline" color="#FFFFFF" onPress={() => {}} />
      </Appbar.Header>

      <ScreenWrapper>
        <View className="mt-4 mb-4" style={{ marginTop: 16, marginBottom: 16 }}>
          <Text variant="headlineSmall" className="font-bold" style={{ fontWeight: 'bold' }}>
            {greeting}, {user?.name?.split(' ')[0] || 'User'}
          </Text>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            {dateStr}
          </Text>
        </View>

        <View className="flex-row flex-wrap mb-4" style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="package-variant"
              value={ordersThisMonth.length}
              label="Orders This Month"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="currency-inr"
              value={`${(revenue / 1000).toFixed(0)}K`}
              label="Revenue"
              iconBgColor="#66BB6A"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="clock-outline"
              value={pendingOrders}
              label="Pending"
              iconBgColor="#FFA726"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="store"
              value={distributorCount}
              label="Distributors"
              iconBgColor="#42A5F5"
            />
          </View>
        </View>

        <Text variant="titleMedium" className="font-bold mb-3" style={{ fontWeight: 'bold', marginBottom: 12 }}>
          Quick Actions
        </Text>
        <View className="flex-row mb-4" style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            className="flex-1 mr-2"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => router.push('/(executive)/home/select-distributor')}
            activeOpacity={0.7}
          >
            <Surface className="rounded-xl p-4 items-center" style={{ backgroundColor: '#D4A574', elevation: 2, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Avatar.Icon size={44} icon="plus-circle" style={{ backgroundColor: '#FFFFFF33' }} color="#FFFFFF" />
              <Text variant="labelLarge" className="mt-2 font-bold" style={{ color: '#FFFFFF', marginTop: 8, fontWeight: 'bold' }}>
                New Order
              </Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => router.push('/(executive)/orders')}
            activeOpacity={0.7}
          >
            <Surface className="rounded-xl p-4 items-center" style={{ backgroundColor: '#8D6E63', elevation: 2, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Avatar.Icon size={44} icon="history" style={{ backgroundColor: '#FFFFFF33' }} color="#FFFFFF" />
              <Text variant="labelLarge" className="mt-2 font-bold" style={{ color: '#FFFFFF', marginTop: 8, fontWeight: 'bold' }}>
                Order History
              </Text>
            </Surface>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mb-3" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text variant="titleMedium" className="font-bold" style={{ fontWeight: 'bold' }}>
            Recent Orders
          </Text>
          <TouchableOpacity onPress={() => router.push('/(executive)/orders')}>
            <Text variant="labelMedium" style={{ color: '#D4A574' }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length === 0 ? (
          <Surface className="rounded-xl p-6 items-center" style={{ backgroundColor: '#FFFBF5', elevation: 1, borderRadius: 12, padding: 24, alignItems: 'center' }}>
            <Text variant="bodyMedium" style={{ color: '#85736A' }}>
              No orders yet. Start by creating a new order!
            </Text>
          </Surface>
        ) : (
          recentOrders.map((order) => (
            <OrderCard key={order.id} order={order} onPress={handleOrderPress} />
          ))
        )}
        <View className="h-4" />
      </ScreenWrapper>
    </View>
  );
}
