import React from 'react';
import { View, Text } from 'react-native';
import { AppCard } from '../ui/AppCard';
import { BalanceBadge } from '../ui/BalanceBadge';
import { ExpenseItemRow } from './ExpenseItemRow';
import { formatBRL } from '../../utils/formatters';
import { FortnightSummary, Expense } from '../../types/finance';

interface FortnightCardProps {
  summary: FortnightSummary;
  expenses?: Expense[];
  onTogglePayment?: (expense: Expense) => void;
  onEditReceipt?: (expense: Expense) => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (expense: Expense) => void;
}

export const FortnightCard: React.FC<FortnightCardProps> = ({
  summary,
  expenses = [],
  onTogglePayment,
  onEditReceipt,
  onEditExpense,
  onDeleteExpense,
}) => {
  const isDeficit = summary.saldo < 0;
  const fortnightExpenses = expenses.filter((e) => e.quinzena === summary.quinzena);

  return (
    <AppCard className={`flex-1 mb-4 ${isDeficit ? 'border-red-500/40 bg-slate-900/90' : 'border-slate-700'}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-white font-bold text-lg">{summary.label}</Text>
          <Text className="text-slate-400 text-xs mt-0.5">
            {fortnightExpenses.length} {fortnightExpenses.length === 1 ? 'lançamento' : 'lançamentos'}
          </Text>
        </View>
        <BalanceBadge amount={summary.saldo} size="sm" />
      </View>

      {/* Resumo Financeiro da Quinzena */}
      <View className="space-y-2 mt-1 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <View className="flex-row justify-between items-center py-1 border-b border-slate-800/80">
          <Text className="text-slate-400 text-sm">Entrada / Renda:</Text>
          <Text className="text-emerald-400 font-semibold text-sm">{formatBRL(summary.renda)}</Text>
        </View>

        <View className="flex-row justify-between items-center py-1 border-b border-slate-800/80">
          <Text className="text-slate-400 text-sm">Saídas / Despesas:</Text>
          <Text className="text-red-400 font-semibold text-sm">{formatBRL(summary.totalGastos)}</Text>
        </View>

        <View className="flex-row justify-between items-center pt-2">
          <Text className="text-slate-300 font-medium text-sm">Saldo da Quinzena:</Text>
          <Text className={`font-bold text-base ${isDeficit ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatBRL(summary.saldo)}
          </Text>
        </View>
      </View>

      {/* Lista de Despesas da Quinzena */}
      <View className="mt-2">
        <Text className="text-slate-400 text-xs font-semibold uppercase mb-2 ml-1">
          Lançamentos da Quinzena
        </Text>

        {fortnightExpenses.length === 0 ? (
          <View className="py-4 items-center justify-center border border-dashed border-slate-800 rounded-xl">
            <Text className="text-slate-500 text-xs">Nenhuma despesa lançada nesta quinzena.</Text>
          </View>
        ) : (
          fortnightExpenses.map((exp) => (
            <ExpenseItemRow
              key={exp.id || exp.descricao}
              expense={exp}
              onTogglePayment={onTogglePayment || (() => {})}
              onEditReceipt={onEditReceipt}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))
        )}
      </View>
    </AppCard>
  );
};
