import React from 'react';
import { Chip } from 'react-native-paper';
import { ORDER_STATUS_COLORS, ORDER_STATUS_BG_COLORS } from '@/constants/theme';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const textColor = ORDER_STATUS_COLORS[status] || '#78909C';
  const bgColor = ORDER_STATUS_BG_COLORS[status] || '#ECEFF1';
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Chip
      compact
      mode="flat"
      textStyle={{ color: textColor, fontSize: 11, fontWeight: '600' }}
      style={{ backgroundColor: bgColor }}
    >
      {label}
    </Chip>
  );
}
