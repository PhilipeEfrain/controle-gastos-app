import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AppCard } from '../ui/AppCard';
import { AnnualTax } from '../../types/finance';
import { formatBRL } from '../../utils/formatters';

interface TaxComparisonCardProps {
  tax: AnnualTax;
  onToggleStatus: (tax: AnnualTax) => void;
  onDelete?: (tax: AnnualTax) => void;
}

export const TaxComparisonCard: React.FC<TaxComparisonCardProps> = ({
  tax,
  onToggleStatus,
  onDelete,
}) => {
  const isPaid = tax.status === 'Pago';
  const diff = (tax.valor_pago || 0) - (tax.valor_orcado || 0);

  return (
    <AppCard
      className={`mb-3.5 ${
        isPaid ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-900 border-slate-700/80'
      }`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold text-base">{tax.titulo}</Text>
          {tax.data_vencimento ? (
            <Text className="text-slate-400 text-xs mt-0.5">
              📅 Vencimento: <Text className="text-slate-300 font-medium">{tax.data_vencimento}</Text>
            </Text>
          ) : null}
        </View>

        {/* Badge de Status */}
        <Pressable
          onPress={() => onToggleStatus(tax)}
          className={`px-2.5 py-1 rounded-lg border ${
            isPaid
              ? 'bg-emerald-950/80 border-emerald-500'
              : 'bg-amber-950/80 border-amber-500'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              isPaid ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isPaid ? '✓ Pago' : '⏳ Pendente'}
          </Text>
        </Pressable>
      </View>

      {/* Grid Comparativo Previsto x Pago */}
      <View className="flex-row bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 justify-between items-center mb-2">
        <View>
          <Text className="text-slate-400 text-xs font-medium">Valor Orçado</Text>
          <Text className="text-slate-200 font-bold text-sm mt-0.5">
            {formatBRL(tax.valor_orcado)}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-slate-400 text-xs font-medium">Valor Pago</Text>
          <Text
            className={`font-bold text-sm mt-0.5 ${
              isPaid ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {formatBRL(tax.valor_pago)}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-slate-400 text-xs font-medium">Variação</Text>
          <Text
            className={`font-bold text-sm mt-0.5 ${
              diff > 0
                ? 'text-red-400'
                : diff < 0
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {diff > 0 ? `+${formatBRL(diff)}` : formatBRL(diff)}
          </Text>
        </View>
      </View>

      {onDelete && (
        <View className="items-end mt-1">
          <Pressable onPress={() => onDelete(tax)} hitSlop={8} className="px-2 py-0.5">
            <Text className="text-slate-500 hover:text-red-400 text-xs">Excluir Tributo</Text>
          </Pressable>
        </View>
      )}
    </AppCard>
  );
};
