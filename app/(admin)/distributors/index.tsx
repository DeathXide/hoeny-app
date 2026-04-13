import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  Searchbar,
  Card,
  Text,
  Avatar,
  Chip,
  FAB,
  Dialog,
  Portal,
  Button,
  TextInput,
  IconButton,
  Snackbar,
  Divider,
} from 'react-native-paper';
import { useDistributorStore } from '@/store/distributorStore';
import { useShallow } from 'zustand/react/shallow';
import { Distributor, DistributorStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminDistributorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Distributor | null>(null);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGst, setNewGst] = useState('');

  const {
    distributors,
    isLoading,
    fetchDistributors,
    addDistributor,
    updateDistributor,
  } = useDistributorStore(
    useShallow((s) => ({
      distributors: s.distributors,
      isLoading: s.isLoading,
      fetchDistributors: s.fetchDistributors,
      addDistributor: s.addDistributor,
      updateDistributor: s.updateDistributor,
    })),
  );

  useEffect(() => {
    fetchDistributors();
  }, []);

  const filtered = distributors.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.businessName.toLowerCase().includes(q) ||
      d.ownerName.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q)
    );
  });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  const handleAdd = () => {
    if (!newName || !newOwner || !newCity) {
      setSnackMessage('Please fill in required fields');
      setSnackVisible(true);
      return;
    }

    addDistributor({
      businessName: newName,
      ownerName: newOwner,
      email: `${newOwner.toLowerCase().replace(/\s/g, '.')}@example.com`,
      phone: newPhone || '+91 00000 00000',
      addressLine1: newCity,
      city: newCity,
      state: 'Unknown',
      pincode: '000000',
      gstNumber: newGst || 'PENDING',
      creditLimit: 500000,
      outstandingBalance: 0,
      status: DistributorStatus.ACTIVE,
    });
    setShowAddDialog(false);
    setNewName('');
    setNewOwner('');
    setNewCity('');
    setNewPhone('');
    setNewGst('');
    setSnackMessage('Distributor added successfully');
    setSnackVisible(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      const newStatus =
        deleteTarget.status === DistributorStatus.ACTIVE
          ? DistributorStatus.INACTIVE
          : DistributorStatus.ACTIVE;
      updateDistributor(deleteTarget.id, { status: newStatus });
      setDeleteTarget(null);
      setSnackMessage(
        newStatus === DistributorStatus.INACTIVE
          ? 'Distributor deactivated'
          : 'Distributor activated',
      );
      setSnackVisible(true);
    }
  };

  const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const renderDistributor = ({ item }: { item: Distributor }) => {
    const isActive = item.status === DistributorStatus.ACTIVE;

    return (
      <Card className="mx-4 mb-3" style={{ backgroundColor: '#FFFBF5', marginHorizontal: 16, marginBottom: 12 }}>
        <Card.Content>
          <View className="flex-row items-start" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Avatar.Text
              size={48}
              label={getInitials(item.businessName)}
              style={{ backgroundColor: isActive ? '#D4A574' : '#85736A' }}
              labelStyle={{ fontSize: 18 }}
            />
            <View className="flex-1 ml-3" style={{ flex: 1, marginLeft: 12 }}>
              <View className="flex-row items-start justify-between" style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View className="flex-1 mr-2" style={{ flex: 1, marginRight: 8 }}>
                  <Text variant="titleSmall" className="font-bold" style={{ fontWeight: 'bold' }}>
                    {item.businessName}
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#85736A' }}>
                    {item.ownerName}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Chip
                    compact
                    mode="flat"
                    textStyle={{ fontSize: 10 }}
                    style={{
                      backgroundColor: isActive ? '#E8F5E9' : '#FFEBEE',
                    }}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </Chip>
                  <IconButton
                    icon={isActive ? 'store-off' : 'store-check'}
                    size={18}
                    iconColor={isActive ? '#EF5350' : '#66BB6A'}
                    onPress={() => setDeleteTarget(item)}
                  />
                </View>
              </View>
              <Text variant="bodySmall" style={{ color: '#85736A' }}>
                {item.city}, {item.state} - {item.pincode}
              </Text>
              <Text variant="bodySmall" style={{ color: '#85736A' }}>
                GST: {item.gstNumber}
              </Text>
              <View className="flex-row mt-2" style={{ flexDirection: 'row', marginTop: 8 }}>
                <View className="flex-1" style={{ flex: 1 }}>
                  <Text variant="bodySmall" style={{ color: '#85736A' }}>
                    Credit Limit
                  </Text>
                  <Text variant="bodySmall" className="font-bold" style={{ fontWeight: 'bold' }}>
                    {formatCurrency(item.creditLimit)}
                  </Text>
                </View>
                <View className="flex-1" style={{ flex: 1 }}>
                  <Text variant="bodySmall" style={{ color: '#85736A' }}>
                    Outstanding
                  </Text>
                  <Text
                    variant="bodySmall"
                    className="font-bold"
                    style={{
                      color:
                        item.outstandingBalance > 0 ? '#FFA726' : '#66BB6A',
                    }}
                  >
                    {formatCurrency(item.outstandingBalance)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Manage Distributors" />
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
          title="No Distributors"
          description={
            searchQuery
              ? 'No distributors match your search'
              : 'No distributors added yet'
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderDistributor}
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
        onPress={() => setShowAddDialog(true)}
      />

      <Portal>
        <Dialog
          visible={showAddDialog}
          onDismiss={() => setShowAddDialog(false)}
          style={{ maxHeight: '80%' }}
        >
          <Dialog.Title>Add Distributor</Dialog.Title>
          <Dialog.ScrollArea>
            <View className="py-2" style={{ paddingVertical: 8 }}>
              <TextInput
                mode="outlined"
                label="Business Name *"
                value={newName}
                onChangeText={setNewName}
                className="mb-2"
                style={{ marginBottom: 8 }}
              />
              <TextInput
                mode="outlined"
                label="Owner Name *"
                value={newOwner}
                onChangeText={setNewOwner}
                className="mb-2"
                style={{ marginBottom: 8 }}
              />
              <TextInput
                mode="outlined"
                label="City *"
                value={newCity}
                onChangeText={setNewCity}
                className="mb-2"
                style={{ marginBottom: 8 }}
              />
              <TextInput
                mode="outlined"
                label="Phone"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                className="mb-2"
                style={{ marginBottom: 8 }}
              />
              <TextInput
                mode="outlined"
                label="GST Number"
                value={newGst}
                onChangeText={setNewGst}
              />
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleAdd}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={!!deleteTarget}
          onDismiss={() => setDeleteTarget(null)}
        >
          <Dialog.Icon icon={deleteTarget?.status === DistributorStatus.ACTIVE ? 'store-off' : 'store-check'} />
          <Dialog.Title style={{ textAlign: 'center' }}>
            {deleteTarget?.status === DistributorStatus.ACTIVE ? 'Deactivate' : 'Activate'} Distributor
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              Are you sure you want to {deleteTarget?.status === DistributorStatus.ACTIVE ? 'deactivate' : 'activate'} "{deleteTarget?.businessName}"?
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
