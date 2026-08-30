import React from 'react';
import { View, Text } from 'react-native';
import { formatBRL } from '../../utils/formatters';

interface BalanceBadgeProps {
  amount: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BalanceBadge: React.FC<BalanceBadgeProps> = ({ amount, label, size = 'md' }) => {
  const isPositive = amount >= 0;
  const bgColor = isPositive ? 'bg-emerald-950/80 border-emerald-600/50' : 'bg-red-950/80 border-red-600/50';
  const textColor = isPositive ? 'text-emerald-400' : 'text-red-400';

  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl font-bold' : 'text-base font-semibold';

  return (
    <View className={`px-3 py-1.5 rounded-xl border flex-row items-center space-x-2 ${bgColor}`}>
      {label && <Text className="text-slate-400 text-xs mr-1 font-medium">{label}:</Text>}
      <Text className={`${textSize} ${textColor}`}>{formatBRL(amount)}</Text>
    </View>
  );
};
