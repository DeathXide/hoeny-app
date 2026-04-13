import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  Searchbar,
  List,
  Avatar,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDistributorStore } from '@/store/distributorStore';
import { useCartStore } from '@/store/cartStore';
import { useShallow } from 'zustand/react/shallow';
import { Distributor, DistributorStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function SelectDistributorScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { distributors, isLoading, fetchDistributors } = useDistributorStore(
    useShallow((s) => ({
      distributors: s.distributors,
      isLoading: s.isLoading,
      fetchDistributors: s.fetchDistributors,
    })),
  );

  const setDistributor = useCartStore((s) => s.setDistributor);

  useEffect(() => {
    fetchDistributors();
  }, []);

  const activeDistributors = distributors.filter(
    (d) => d.status === DistributorStatus.ACTIVE,
  );

  const filtered = activeDistributors.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.businessName.toLowerCase().includes(q) ||
      d.ownerName.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q)
    );
  });

  const handleSelect = (distributor: Distributor) => {
    setDistributor(distributor.id, distributor.businessName);
    useDistributorStore.getState().selectDistributor(distributor.id);
    router.push('/(executive)/home/products');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const renderItem = ({ item }: { item: Distributor }) => (
    <List.Item
      title={item.businessName}
      description={`${item.ownerName} | ${item.city}, ${item.state}`}
      left={() => (
        <Avatar.Text
          size={44}
          label={getInitials(item.businessName)}
          style={{ backgroundColor: '#D4A574', marginLeft: 8 }}
          labelStyle={{ fontSize: 16 }}
        />
      )}
      onPress={() => handleSelect(item)}
      style={{ paddingVertical: 8 }}
    />
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Select Distributor" />
      </Appbar.Header>

      <View className="px-4 py-3" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Searchbar
          placeholder="Search distributors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ backgroundColor: '#FFFBF5', elevation: 1 }}
        />
      </View>

      {isLoading ? (
        <LoadingSpinner message="Loading distributors..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="store-off"
          title="No Distributors Found"
          description={
            searchQuery
              ? 'Try adjusting your search terms'
              : 'No active distributors available'
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
}
