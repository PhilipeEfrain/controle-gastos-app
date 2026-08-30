import React from 'react';
import { View, Text } from 'react-native';
import { AppCard } from '../ui/AppCard';
import { BalanceBadge } from '../ui/BalanceBadge';
import { formatBRL } from '../../utils/formatters';
import { FortnightSummary } from '../../types/finance';

interface FortnightCardProps {
  summary: FortnightSummary;
}

export const FortnightCard: React.FC<FortnightCardProps> = ({ summary }) => {
  const isDeficit = summary.saldo < 0;

  return (
    <AppCard className={`flex-1 mb-4 ${isDeficit ? 'border-red-500/40 bg-slate-900/90' : 'border-slate-700'}`}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white font-bold text-lg">{summary.label}</Text>
        <BalanceBadge amount={summary.saldo} size="sm" />
      </View>

      <View className="space-y-2 mt-2">
        <View className="flex-row justify-between items-center py-1 border-b border-slate-800">
          <Text className="text-slate-400 text-sm">Entrada / Renda:</Text>
          <Text className="text-emerald-400 font-semibold text-sm">{formatBRL(summary.renda)}</Text>
        </View>

        <View className="flex-row justify-between items-center py-1 border-b border-slate-800">
          <Text className="text-slate-400 text-sm">Saídas / Despesas:</Text>
          <Text className="text-red-400 font-semibold text-sm">{formatBRL(summary.totalGastos)}</Text>
        </View>

        <View className="flex-row justify-between items-center pt-2">
          <Text className="text-slate-300 font-medium text-sm">Saldo Restante:</Text>
          <Text className={`font-bold text-base ${isDeficit ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatBRL(summary.saldo)}
          </Text>
        </View>
      </View>
    </AppCard>
  );
};
