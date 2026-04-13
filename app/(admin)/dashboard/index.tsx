import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Text,
  Surface,
  Avatar,
  Card,
  List,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { useDistributorStore } from '@/store/distributorStore';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { OrderStatus } from '@/types';
import StatCard from '@/components/admin/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ScreenWrapper from '@/components/ui/ScreenWrapper';
import StatusBadge from '@/components/order/StatusBadge';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { orders, isLoading: ordersLoading, fetchOrders } = useOrderStore(
    useShallow((s) => ({
      orders: s.orders,
      isLoading: s.isLoading,
      fetchOrders: s.fetchOrders,
    })),
  );

  const { products, fetchProducts } = useProductStore(
    useShallow((s) => ({
      products: s.products,
      fetchProducts: s.fetchProducts,
    })),
  );

  const { distributors, fetchDistributors } = useDistributorStore(
    useShallow((s) => ({
      distributors: s.distributors,
      fetchDistributors: s.fetchDistributors,
    })),
  );

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchDistributors();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING).length;
  const activeProducts = products.filter((p) => p.isActive).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (ordersLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#D4A574' }}>
        <Appbar.Content
          title="Admin Dashboard"
          titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        />
        <Appbar.Action
          icon="logout"
          color="#FFFFFF"
          onPress={() => {
            useAuthStore.getState().logout();
            router.replace('/(auth)/login');
          }}
        />
      </Appbar.Header>

      <ScreenWrapper>
        <View className="mt-4 mb-2" style={{ marginTop: 16, marginBottom: 8 }}>
          <Text variant="titleLarge" className="font-bold" style={{ fontWeight: 'bold' }}>
            Welcome, {user?.name?.split(' ')[0] || 'Admin'}
          </Text>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            Here is your business overview
          </Text>
        </View>

        <View className="flex-row flex-wrap mb-4" style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="currency-inr"
              value={`${(totalRevenue / 1000).toFixed(0)}K`}
              label="Total Revenue"
              iconBgColor="#66BB6A"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="clipboard-list"
              value={orders.length}
              label="Total Orders"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="clock-alert"
              value={pendingOrders}
              label="Pending Orders"
              iconBgColor="#FFA726"
            />
          </View>
          <View className="w-1/2" style={{ width: '50%' }}>
            <StatCard
              icon="package-variant"
              value={activeProducts}
              label="Active Products"
              iconBgColor="#42A5F5"
            />
          </View>
        </View>

        <Text variant="titleMedium" className="font-bold mb-3" style={{ fontWeight: 'bold', marginBottom: 12 }}>
          Quick Manage
        </Text>
        <View className="flex-row mb-4" style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            className="flex-1 mr-2"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => router.push('/(admin)/products')}
            activeOpacity={0.7}
          >
            <Surface className="rounded-xl p-4 items-center" style={{ backgroundColor: '#D4A574', elevation: 2, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="package-variant" style={{ backgroundColor: '#FFFFFF33' }} color="#FFFFFF" />
              <Text variant="labelMedium" className="mt-2 font-bold" style={{ color: '#FFFFFF', marginTop: 8, fontWeight: 'bold' }}>
                Products
              </Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 mx-1"
            style={{ flex: 1, marginHorizontal: 4 }}
            onPress={() => router.push('/(admin)/orders')}
            activeOpacity={0.7}
          >
            <Surface className="rounded-xl p-4 items-center" style={{ backgroundColor: '#8D6E63', elevation: 2, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="clipboard-check" style={{ backgroundColor: '#FFFFFF33' }} color="#FFFFFF" />
              <Text variant="labelMedium" className="mt-2 font-bold" style={{ color: '#FFFFFF', marginTop: 8, fontWeight: 'bold' }}>
                Orders
              </Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => router.push('/(admin)/users')}
            activeOpacity={0.7}
          >
            <Surface className="rounded-xl p-4 items-center" style={{ backgroundColor: '#606134', elevation: 2, borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="account-group" style={{ backgroundColor: '#FFFFFF33' }} color="#FFFFFF" />
              <Text variant="labelMedium" className="mt-2 font-bold" style={{ color: '#FFFFFF', marginTop: 8, fontWeight: 'bold' }}>
                Users
              </Text>
            </Surface>
          </TouchableOpacity>
        </View>

        <Text variant="titleMedium" className="font-bold mb-3" style={{ fontWeight: 'bold', marginBottom: 12 }}>
          Recent Activity
        </Text>
        <Surface className="rounded-xl mb-4" style={{ backgroundColor: '#FFFBF5', elevation: 1, borderRadius: 12, marginBottom: 16 }}>
          {recentOrders.length === 0 ? (
            <View className="p-6 items-center">
              <Text variant="bodyMedium" style={{ color: '#85736A' }}>
                No recent activity
              </Text>
            </View>
          ) : (
            recentOrders.map((order, index) => (
              <React.Fragment key={order.id}>
                <List.Item
                  title={`${order.orderNumber}`}
                  description={`${order.distributorName} - Rs. ${order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  right={() => <StatusBadge status={order.status} />}
                  onPress={() => router.push(`/(admin)/orders/${order.id}`)}
                  style={{ paddingVertical: 4 }}
                />
                {index < recentOrders.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </Surface>
        <View className="h-4" />
      </ScreenWrapper>
    </View>
  );
}
