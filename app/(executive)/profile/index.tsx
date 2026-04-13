import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Appbar,
  Avatar,
  Text,
  Chip,
  List,
  Button,
  Dialog,
  Portal,
  Divider,
  Surface,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import ScreenWrapper from '@/components/ui/ScreenWrapper';

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const { user, logout } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      logout: s.logout,
    })),
  );

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    router.replace('/(auth)/login');
  };

  const roleName =
    user?.role === 'admin' ? 'Administrator' : 'Sales Executive';

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <ScreenWrapper>
        <View className="items-center mt-6 mb-6" style={{ alignItems: 'center', marginTop: 24, marginBottom: 24 }}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.name)}
            style={{ backgroundColor: '#D4A574' }}
            labelStyle={{ fontSize: 28 }}
          />
          <Text variant="headlineSmall" className="mt-3 font-bold" style={{ marginTop: 12, fontWeight: 'bold' }}>
            {user?.name || 'Unknown User'}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#85736A' }}>
            {user?.email}
          </Text>
          <Chip className="mt-2" style={{ marginTop: 8 }} mode="outlined" icon="shield-account">
            {roleName}
          </Chip>
        </View>

        <Surface className="rounded-xl mx-0 mb-4" style={{ backgroundColor: '#FFFBF5', elevation: 1, borderRadius: 12, marginHorizontal: 0, marginBottom: 16 }}>
          <List.Section>
            <List.Subheader>Contact Information</List.Subheader>
            <List.Item
              title="Phone"
              description={user?.phone || 'Not set'}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
            <Divider />
            <List.Item
              title="Email"
              description={user?.email || 'Not set'}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
          </List.Section>
        </Surface>

        <Surface className="rounded-xl mx-0 mb-4" style={{ backgroundColor: '#FFFBF5', elevation: 1, borderRadius: 12, marginHorizontal: 0, marginBottom: 16 }}>
          <List.Section>
            <List.Subheader>Account Details</List.Subheader>
            <List.Item
              title="Role"
              description={roleName}
              left={(props) => <List.Icon {...props} icon="badge-account" />}
            />
            <Divider />
            <List.Item
              title="Status"
              description={user?.status || 'Active'}
              left={(props) => <List.Icon {...props} icon="check-circle" />}
            />
            <Divider />
            <List.Item
              title="Assigned Distributors"
              description={`${user?.assignedDistributorIds?.length || 0} distributors`}
              left={(props) => <List.Icon {...props} icon="store" />}
            />
            <Divider />
            <List.Item
              title="Member Since"
              description={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Unknown'
              }
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
          </List.Section>
        </Surface>

        <Button
          mode="outlined"
          onPress={() => setShowLogout(true)}
          icon="logout"
          textColor="#EF5350"
          className="mb-8"
          style={{ borderColor: '#EF5350', marginBottom: 32 }}
        >
          Sign Out
        </Button>
      </ScreenWrapper>

      <Portal>
        <Dialog visible={showLogout} onDismiss={() => setShowLogout(false)}>
          <Dialog.Icon icon="logout" />
          <Dialog.Title style={{ textAlign: 'center' }}>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              Are you sure you want to sign out of your account?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogout(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor="#EF5350">
              Sign Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
