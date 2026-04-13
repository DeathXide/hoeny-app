import React from 'react';
import { View } from 'react-native';
import { Surface, Avatar, Text } from 'react-native-paper';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  iconColor = '#FFFFFF',
  iconBgColor = '#D4A574',
}: StatCardProps) {
  return (
    <Surface
      className="flex-1 rounded-xl p-4 m-1"
      style={{ backgroundColor: '#FFFBF5', elevation: 1 }}
    >
      <Avatar.Icon
        size={40}
        icon={icon}
        color={iconColor}
        style={{ backgroundColor: iconBgColor }}
      />
      <Text variant="headlineSmall" className="mt-2 font-bold">
        {value}
      </Text>
      <Text variant="bodySmall" style={{ color: '#85736A' }}>
        {label}
      </Text>
    </Surface>
  );
}
