import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
}

export default function ScreenWrapper({
  children,
  scrollable = true,
  padded = true,
}: ScreenWrapperProps) {
  const content = (
    <View className={padded ? 'flex-1 px-4' : 'flex-1'} style={padded ? { backgroundColor: '#FFF8F0', paddingHorizontal: 16 } : { backgroundColor: '#FFF8F0' }}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF8F0' }} edges={['bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF8F0' }} edges={['bottom']}>
      {content}
    </SafeAreaView>
  );
}
