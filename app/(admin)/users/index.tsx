import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Appbar,
  SegmentedButtons,
  Card,
  Text,
  Avatar,
  Chip,
  Menu,
  IconButton,
  Dialog,
  Portal,
  Button,
  Divider,
  Snackbar,
} from 'react-native-paper';
import { users } from '@/data/users';
import { User, UserRole, UserStatus } from '@/types';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminUsersScreen() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const filteredUsers =
    roleFilter === 'all'
      ? localUsers
      : localUsers.filter((u) => u.role === roleFilter);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  const handleDeactivate = () => {
    if (deactivateTarget) {
      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id === deactivateTarget.id
            ? {
                ...u,
                status:
                  u.status === UserStatus.ACTIVE
                    ? UserStatus.INACTIVE
                    : UserStatus.ACTIVE,
              }
            : u,
        ),
      );
      const action =
        deactivateTarget.status === UserStatus.ACTIVE ? 'deactivated' : 'activated';
      setSnackMessage(`${deactivateTarget.name} has been ${action}`);
      setSnackVisible(true);
      setDeactivateTarget(null);
    }
  };

  const renderUser = ({ item }: { item: User }) => {
    const roleName =
      item.role === UserRole.ADMIN ? 'Admin' : 'Sales Executive';
    const isActive = item.status === UserStatus.ACTIVE;

    return (
      <Card className="mx-4 mb-3" style={{ backgroundColor: '#FFFBF5', marginHorizontal: 16, marginBottom: 12 }}>
        <Card.Content>
          <View className="flex-row items-center" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar.Text
              size={48}
              label={getInitials(item.name)}
              style={{
                backgroundColor:
                  item.role === UserRole.ADMIN ? '#8D6E63' : '#D4A574',
              }}
              labelStyle={{ fontSize: 18 }}
            />
            <View className="flex-1 ml-3" style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleSmall" className="font-bold" style={{ fontWeight: 'bold' }}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={{ color: '#85736A' }}>
                {item.email}
              </Text>
              <View className="flex-row items-center mt-1">
                <Chip
                  compact
                  mode="flat"
                  textStyle={{ fontSize: 10 }}
                  style={{
                    backgroundColor:
                      item.role === UserRole.ADMIN ? '#F3E5F5' : '#FFF3E0',
                  }}
                >
                  {roleName}
                </Chip>
                <Chip
                  compact
                  mode="flat"
                  textStyle={{ fontSize: 10 }}
                  style={{
                    backgroundColor: isActive ? '#E8F5E9' : '#FFEBEE',
                    marginLeft: 8,
                  }}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Chip>
              </View>
            </View>
            <Menu
              visible={menuVisible === item.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={() => setMenuVisible(item.id)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  setSnackMessage('Edit user feature coming soon');
                  setSnackVisible(true);
                }}
                title="Edit User"
                leadingIcon="pencil"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  setDeactivateTarget(item);
                }}
                title={isActive ? 'Deactivate' : 'Activate'}
                leadingIcon={isActive ? 'account-off' : 'account-check'}
              />
            </Menu>
          </View>
          <View className="flex-row mt-2" style={{ flexDirection: 'row', marginTop: 8 }}>
            <Text variant="bodySmall" style={{ color: '#85736A' }}>
              Phone: {item.phone}
            </Text>
            <Text variant="bodySmall" className="ml-4" style={{ color: '#85736A', marginLeft: 16 }}>
              Distributors: {item.assignedDistributorIds.length}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Manage Users" />
      </Appbar.Header>

      <View className="px-4 py-3" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <SegmentedButtons
          value={roleFilter}
          onValueChange={setRoleFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: UserRole.ADMIN, label: 'Admin' },
            { value: UserRole.SALES_EXECUTIVE, label: 'Executive' },
          ]}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon="account-off"
          title="No Users Found"
          description="No users match the selected filter"
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Portal>
        <Dialog
          visible={!!deactivateTarget}
          onDismiss={() => setDeactivateTarget(null)}
        >
          <Dialog.Icon
            icon={
              deactivateTarget?.status === UserStatus.ACTIVE
                ? 'account-off'
                : 'account-check'
            }
          />
          <Dialog.Title style={{ textAlign: 'center' }}>
            {deactivateTarget?.status === UserStatus.ACTIVE
              ? 'Deactivate User'
              : 'Activate User'}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              Are you sure you want to{' '}
              {deactivateTarget?.status === UserStatus.ACTIVE
                ? 'deactivate'
                : 'activate'}{' '}
              {deactivateTarget?.name}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button onPress={handleDeactivate}>Confirm</Button>
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
