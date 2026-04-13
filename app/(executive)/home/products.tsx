import React, { useEffect, useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import {
  Appbar,
  Searchbar,
  Chip,
  Card,
  Text,
  IconButton,
  Snackbar,
  Banner,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useDistributorStore } from '@/store/distributorStore';
import { useShallow } from 'zustand/react/shallow';
import { Gender, Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ProductListingScreen() {
  const router = useRouter();
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const {
    isLoading,
    filters,
    fetchProducts,
    setFilters,
    resetFilters,
    getFilteredProducts,
  } = useProductStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      filters: s.filters,
      fetchProducts: s.fetchProducts,
      setFilters: s.setFilters,
      resetFilters: s.resetFilters,
      getFilteredProducts: s.getFilteredProducts,
    })),
  );

  const addItem = useCartStore((s) => s.addItem);
  const selectedDistributor = useDistributorStore((s) => s.selectedDistributor);

  useEffect(() => {
    fetchProducts();
    return () => {
      resetFilters();
    };
  }, []);

  const products = getFilteredProducts();

  const handleAddToCart = (product: Product) => {
    if (product.totalStock <= 0) return;
    addItem(product, 1);
    setSnackMessage(`${product.name} added to cart`);
    setSnackVisible(true);
  };

  const genderOptions: { label: string; value: Gender | null }[] = [
    { label: 'All', value: null },
    { label: 'Boys', value: Gender.BOYS },
    { label: 'Girls', value: Gender.GIRLS },
    { label: 'Unisex', value: Gender.UNISEX },
  ];

  const renderProduct = ({ item }: { item: Product }) => (
    <View className="w-1/2 p-1.5" style={{ width: '50%', padding: 6 }}>
      <Card style={{ backgroundColor: '#FFFBF5' }}>
        <View className="h-36 rounded-t-xl overflow-hidden" style={{ backgroundColor: '#F4DED3' }}>
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Card.Content style={{ paddingTop: 8, paddingBottom: 4 }}>
          <Text variant="labelLarge" numberOfLines={1} className="font-bold" style={{ fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            {item.sku} | {item.color}
          </Text>
          <View className="flex-row items-center justify-between mt-1" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <View>
              <Text variant="titleSmall" className="font-bold" style={{ color: '#D4A574', fontWeight: 'bold' }}>
                Rs. {item.wholesalePrice}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: '#85736A', textDecorationLine: 'line-through' }}
              >
                Rs. {item.price}
              </Text>
            </View>
            <IconButton
              icon="cart-plus"
              mode="contained"
              size={20}
              iconColor="#FFFFFF"
              containerColor={item.totalStock > 0 ? '#D4A574' : '#85736A'}
              onPress={() => handleAddToCart(item)}
              disabled={item.totalStock <= 0}
            />
          </View>
          {item.totalStock <= 0 && (
            <Text variant="bodySmall" style={{ color: '#EF5350' }}>
              Out of stock
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Products" />
        <Appbar.Action
          icon="cart"
          onPress={() => router.push('/(executive)/cart')}
        />
      </Appbar.Header>

      {selectedDistributor && (
        <Banner
          visible
          actions={[]}
          icon="store"
          style={{ backgroundColor: '#FEF1EB' }}
        >
          Ordering for: {selectedDistributor.businessName}
        </Banner>
      )}

      <View className="px-4 pt-3" style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Searchbar
          placeholder="Search products..."
          value={filters.search}
          onChangeText={(text) => setFilters({ search: text })}
          style={{ backgroundColor: '#FFFBF5', elevation: 1 }}
        />
      </View>

      <View className="px-4 py-3" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <FlatList
          horizontal
          data={genderOptions}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={filters.gender === item.value}
              onPress={() => setFilters({ gender: item.value })}
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
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon="package-variant-closed"
          title="No Products Found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
        action={{
          label: 'View Cart',
          onPress: () => router.push('/(executive)/cart'),
        }}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
}
