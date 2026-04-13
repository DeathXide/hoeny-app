import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import {
  Avatar,
  Text,
  TextInput,
  Button,
  HelperText,
  Surface,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useShallow } from 'zustand/react/shallow';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { isLoading, error, login, clearError } = useAuthStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      error: s.error,
      login: s.login,
      clearError: s.clearError,
    })),
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleLogin = async () => {
    clearError();
    if (!validateEmail(email)) return;
    if (!password) return;

    const success = await login({ email, password });
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === UserRole.ADMIN) {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(executive)/home');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: '#FFF8F0' }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8" style={{ alignItems: 'center', marginBottom: 32 }}>
          <Avatar.Icon
            size={80}
            icon="hexagon-multiple"
            style={{ backgroundColor: '#D4A574' }}
            color="#FFFFFF"
          />
          <Text variant="headlineMedium" className="mt-4 font-bold" style={{ color: '#201A17', marginTop: 16, fontWeight: 'bold' }}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" className="mt-1" style={{ color: '#85736A', marginTop: 4 }}>
            Sign in to Honey App
          </Text>
        </View>

        <Surface className="rounded-2xl p-6" style={{ backgroundColor: '#FFFBF5', elevation: 1, borderRadius: 16, padding: 24 }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            left={<TextInput.Icon icon="email-outline" />}
            error={!!emailError}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            className="mt-1"
            style={{ marginTop: 4 }}
          />

          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password}
            className="mt-4"
            style={{ marginTop: 16 }}
            contentStyle={{ paddingVertical: 6 }}
          >
            Sign In
          </Button>
        </Surface>

        <Surface className="rounded-xl p-4 mt-6" style={{ backgroundColor: '#FEF1EB', elevation: 0, borderRadius: 12, padding: 16, marginTop: 24 }}>
          <Text variant="labelLarge" className="font-bold mb-2" style={{ color: '#52443B', fontWeight: 'bold', marginBottom: 8 }}>
            Demo Credentials
          </Text>
          <Text variant="bodySmall" style={{ color: '#85736A' }}>
            Executive: rajesh.kumar@honeyapp.in / Rajesh@123
          </Text>
          <Text variant="bodySmall" className="mt-1" style={{ color: '#85736A', marginTop: 4 }}>
            Admin: amit.verma@honeyapp.in / Admin@123
          </Text>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
