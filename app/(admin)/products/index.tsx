import React, { useEffect, useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import {
  Appbar,
  Searchbar,
  Card,
  Text,
  IconButton,
  FAB,
  Dialog,
  Portal,
  Button,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useProductStore } from '@/store/productStore';
import { useShallow } from 'zustand/react/shallow';
import { Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminProductListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { products, isLoading, fetchProducts, toggleProductActive } = useProductStore(
    useShallow((s) => ({
      products: s.products,
      isLoading: s.isLoading,
      fetchProducts: s.fetchProducts,
      toggleProductActive: s.toggleProductActive,
    })),
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleDelete = () => {
    if (deleteTarget) {
      toggleProductActive(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card className="mx-4 mb-3" style={{ backgroundColor: '#FFFBF5', marginHorizontal: 16, marginBottom: 12 }}>
      <Card.Content>
        <View className="flex-row" style={{ flexDirection: 'row' }}>
          <View
            className="w-16 h-16 rounded-lg overflow-hidden mr-3"
            style={{ backgroundColor: '#F4DED3', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', marginRight: 12 }}
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
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: '#85736A' }}>
                  {item.sku} | {item.gender} | {item.category}
                </Text>
              </View>
              <View className="flex-row">
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={() => router.push(`/(admin)/products/${item.id}`)}
                />
                <IconButton
                  icon="delete"
                  size={18}
                  iconColor="#EF5350"
                  onPress={() => setDeleteTarget(item)}
                />
              </View>
            </View>
            <View className="flex-row items-center mt-1" style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text variant="bodyMedium" className="font-bold" style={{ color: '#D4A574', fontWeight: 'bold' }}>
                Rs. {item.wholesalePrice}
              </Text>
              <Text variant="bodySmall" className="ml-2" style={{ color: '#85736A', marginLeft: 8 }}>
                MRP Rs. {item.price}
              </Text>
              <View className="flex-1" />
              <Chip
                compact
                mode="flat"
                textStyle={{ fontSize: 10 }}
                style={{
                  backgroundColor: item.isActive ? '#E8F5E9' : '#FFEBEE',
                }}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </Chip>
            </View>
            <Text variant="bodySmall" style={{ color: '#85736A', marginTop: 4 }} className="mt-1">
              Stock: {item.totalStock} units
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Manage Products" />
      </Appbar.Header>

      <View className="px-4 py-3" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Searchbar
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ backgroundColor: '#FFFBF5', elevation: 1 }}
        />
      </View>

      {isLoading ? (
        <LoadingSpinner message="Loading products..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="package-variant-closed"
          title="No Products"
          description={
            searchQuery
              ? 'No products match your search'
              : 'No products added yet'
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: '#D4A574',
        }}
        color="#FFFFFF"
        onPress={() => router.push('/(admin)/products/new')}
      />

      <Portal>
        <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)}>
          <Dialog.Icon icon="delete-alert" />
          <Dialog.Title style={{ textAlign: 'center' }}>Delete Product</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              Are you sure you want to {deleteTarget?.isActive ? 'deactivate' : 'activate'} "{deleteTarget?.name}"?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
            <Button onPress={handleDelete} textColor="#EF5350">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
