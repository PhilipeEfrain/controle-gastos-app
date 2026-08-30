import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Expense } from '../../types/finance';
import { formatBRL } from '../../utils/formatters';

interface ExpenseItemRowProps {
  expense: Expense;
  onTogglePayment: (expense: Expense) => void;
  onEditReceipt?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Moradia: { bg: 'bg-indigo-950/80 border-indigo-700/60', text: 'text-indigo-300' },
  Serviços: { bg: 'bg-cyan-950/80 border-cyan-700/60', text: 'text-cyan-300' },
  Cartão: { bg: 'bg-purple-950/80 border-purple-700/60', text: 'text-purple-300' },
  Educação: { bg: 'bg-amber-950/80 border-amber-700/60', text: 'text-amber-300' },
  Alimentação: { bg: 'bg-emerald-950/80 border-emerald-700/60', text: 'text-emerald-300' },
  Transporte: { bg: 'bg-blue-950/80 border-blue-700/60', text: 'text-blue-300' },
  Saúde: { bg: 'bg-rose-950/80 border-rose-700/60', text: 'text-rose-300' },
  Outros: { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300' },
};

export const ExpenseItemRow: React.FC<ExpenseItemRowProps> = ({
  expense,
  onTogglePayment,
  onEditReceipt,
  onDelete,
}) => {
  const isPaid = expense.status_pagamento;
  const categoryStyle = CATEGORY_COLORS[expense.categoria] || CATEGORY_COLORS['Outros'];

  return (
    <View
      className={`p-3.5 rounded-xl mb-2.5 border transition-all flex-row items-center justify-between ${
        isPaid
          ? 'bg-slate-900/50 border-slate-800/80 opacity-75'
          : 'bg-slate-900 border-slate-700/80 shadow-sm'
      }`}
    >
      {/* Checkbox e Detalhes da Despesa */}
      <View className="flex-row items-center flex-1 mr-3">
        {/* Checkbox Interativo */}
        <Pressable
          onPress={() => onTogglePayment(expense)}
          hitSlop={8}
          className={`w-6 h-6 rounded-lg items-center justify-center border mr-3 ${
            isPaid
              ? 'bg-emerald-600 border-emerald-500'
              : 'bg-slate-950 border-slate-600 active:border-emerald-500'
          }`}
        >
          {isPaid && <Text className="text-white text-xs font-bold">✓</Text>}
        </Pressable>

        {/* Informações da Despesa */}
        <View className="flex-1">
          <View className="flex-row items-center flex-wrap gap-1.5 mb-1">
            <Text
              className={`font-semibold text-base ${
                isPaid ? 'text-slate-400 line-through' : 'text-slate-100'
              }`}
            >
              {expense.descricao}
            </Text>

            {/* Badge de Categoria */}
            <View className={`px-2 py-0.5 rounded-md border ${categoryStyle.bg}`}>
              <Text className={`text-[10px] font-bold ${categoryStyle.text}`}>
                {expense.categoria}
              </Text>
            </View>

            {/* Badge de Recorrente */}
            {expense.recorrente && (
              <View className="px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                <Text className="text-[10px] text-slate-400 font-medium">🔁 Recorrente</Text>
              </View>
            )}
          </View>

          {/* Código de Comprovante */}
          {expense.codigo_comprovante ? (
            <Pressable
              onPress={() => onEditReceipt && onEditReceipt(expense)}
              className="flex-row items-center self-start bg-slate-950 px-2 py-0.5 rounded border border-slate-800 mt-0.5"
            >
              <Text className="text-[11px] text-slate-400">
                Comprovante: <Text className="text-emerald-400 font-mono font-bold">{expense.codigo_comprovante}</Text>
              </Text>
            </Pressable>
          ) : isPaid ? (
            <Pressable
              onPress={() => onEditReceipt && onEditReceipt(expense)}
              className="self-start mt-0.5"
            >
              <Text className="text-[11px] text-slate-500 italic underline">+ Add comprovante</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Valor e Ações */}
      <View className="items-end">
        <Text
          className={`font-bold text-base ${
            isPaid ? 'text-slate-400' : 'text-red-400'
          }`}
        >
          {formatBRL(expense.valor)}
        </Text>

        {onDelete && (
          <Pressable
            onPress={() => onDelete(expense)}
            hitSlop={8}
            className="mt-1 px-1.5 py-0.5"
          >
            <Text className="text-slate-500 hover:text-red-400 text-xs">Excluir</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
