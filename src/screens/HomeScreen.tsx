import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useMonthlyCycle } from '../hooks/useMonthlyCycle';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { BalanceBadge } from '../components/ui/BalanceBadge';
import { DeficitAlertBanner } from '../components/ui/DeficitAlertBanner';
import { FortnightCard } from '../components/finance/FortnightCard';
import { ReceiptModal } from '../components/finance/ReceiptModal';
import { ExpenseFormModal } from '../components/finance/ExpenseFormModal';
import { IncomeFormModal } from '../components/finance/IncomeFormModal';
import { TaxesListModal } from '../components/finance/TaxesListModal';
import { Expense } from '../types/finance';
import { formatBRL } from '../utils/formatters';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWebWide = width > 768;

  // Ciclo fixo/atual (Ex: 2025-03)
  const currentCycleId = '2025-03';

  const {
    cycle,
    expenses,
    summary,
    loading,
    saveIncomes,
    addNewExpense,
    modifyExpense,
    removeExpense,
    togglePayment,
  } = useMonthlyCycle(user?.uid, currentCycleId);

  // Estados de controle dos Modais
  const [selectedExpenseForReceipt, setSelectedExpenseForReceipt] = useState<Expense | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState<Expense | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState<boolean>(false);
  const [isTaxesModalOpen, setIsTaxesModalOpen] = useState<boolean>(false);

  const displayName = useMemo(() => {
    return user?.displayName || user?.email?.split('@')[0] || 'Usuário';
  }, [user]);

  const handleTogglePayment = async (expense: Expense) => {
    if (expense.id) {
      await togglePayment(expense.id, !expense.status_pagamento);
    }
  };

  const handleOpenReceiptModal = (expense: Expense) => {
    setSelectedExpenseForReceipt(expense);
    setIsReceiptModalOpen(true);
  };

  const handleOpenEditExpenseModal = (expense: Expense) => {
    setSelectedExpenseForEdit(expense);
    setIsExpenseModalOpen(true);
  };

  const handleOpenNewExpenseModal = () => {
    setSelectedExpenseForEdit(null);
    setIsExpenseModalOpen(true);
  };

  const handleSaveReceipt = async (expenseId: string, receiptCode: string) => {
    await togglePayment(expenseId, true, receiptCode);
  };

  const handleDeleteExpense = async (expense: Expense) => {
    if (expense.id) {
      await removeExpense(expense.id);
    }
  };

  const handleSaveExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (selectedExpenseForEdit && selectedExpenseForEdit.id) {
      await modifyExpense(selectedExpenseForEdit.id, expenseData);
    } else {
      await addNewExpense(expenseData);
    }
    setSelectedExpenseForEdit(null);
  };

  const handleSaveIncomes = async (q1: number, q2: number) => {
    await saveIncomes(q1, q2);
  };

  return (
    <SafeAreaView
      className="flex-1 w-full bg-slate-950"
      style={{ flex: 1, width: '100%', height: '100%', maxHeight: '100%', overflow: 'hidden' }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        className="flex-1 w-full"
        style={{ flex: 1, width: '100%', height: '100%' }}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 24,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        {/* Container centralizado para Web */}
        <View className="max-w-4xl w-full">
          {/* Header Superior com Perfil e Logout */}
          <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 items-center justify-center">
                <Text className="text-emerald-400 font-bold text-base">
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-white font-bold text-base">{displayName}</Text>
                <Text className="text-slate-400 text-xs">{user?.email || 'Autenticado'}</Text>
              </View>
            </View>

            <Pressable
              onPress={logout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 active:bg-slate-700 cursor-pointer"
            >
              <Text className="text-slate-300 text-xs font-semibold">Sair</Text>
            </Pressable>
          </View>

          {/* Título e Mês */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">Controle Quinzenal</Text>
              <Text className="text-slate-400 text-sm">Março de 2025</Text>
            </View>
            <BalanceBadge amount={summary.saldoFinal} size="lg" />
          </View>

          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-slate-400 text-sm mt-3">Sincronizando com Firestore...</Text>
            </View>
          ) : (
            <>
              {/* Banner de Déficit se houver */}
              <DeficitAlertBanner
                saldoFinal={summary.saldoFinal}
                q1CobreQ2={summary.q1CobreQ2}
              />

              {/* Card Resumo Geral do Mês */}
              <AppCard className="mb-6 bg-slate-900 border-slate-700">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-slate-300 font-semibold text-base">
                    Resumo Geral do Mês
                  </Text>
                  <Pressable
                    onPress={() => setIsIncomeModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 active:bg-slate-700 cursor-pointer"
                  >
                    <Text className="text-emerald-400 text-xs font-semibold">
                      ⚙️ Ajustar Rendas
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                  <Text className="text-slate-400">Renda Total:</Text>
                  <Text className="text-emerald-400 font-bold text-base">
                    {formatBRL(summary.totalRenda)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                  <Text className="text-slate-400">Total de Despesas:</Text>
                  <Text className="text-red-400 font-bold text-base">
                    {formatBRL(summary.totalGastos)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center pt-3">
                  <Text className="text-slate-200 font-bold">Saldo Consolidado:</Text>
                  <Text
                    className={`font-bold text-lg ${
                      summary.saldoFinal < 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatBRL(summary.saldoFinal)}
                  </Text>
                </View>
              </AppCard>

              {/* Visão Dividida por Quinzena com Despesas Interativas */}
              <Text className="text-white font-bold text-lg mb-3">Visão por Quinzena</Text>
              <View className={isWebWide ? 'flex-row space-x-4' : 'flex-col'}>
                <FortnightCard
                  summary={summary.q1}
                  expenses={expenses}
                  onTogglePayment={handleTogglePayment}
                  onEditReceipt={handleOpenReceiptModal}
                  onEditExpense={handleOpenEditExpenseModal}
                  onDeleteExpense={handleDeleteExpense}
                />
                <FortnightCard
                  summary={summary.q2}
                  expenses={expenses}
                  onTogglePayment={handleTogglePayment}
                  onEditReceipt={handleOpenReceiptModal}
                  onEditExpense={handleOpenEditExpenseModal}
                  onDeleteExpense={handleDeleteExpense}
                />
              </View>

              {/* Ações Rápidas */}
              <View className="flex-row space-x-3 mt-4">
                <AppButton
                  label="+ Nova Despesa"
                  variant="primary"
                  className="flex-1 mr-2"
                  onPress={handleOpenNewExpenseModal}
                />
                <AppButton
                  label="Tributos Anuais"
                  variant="secondary"
                  className="flex-1"
                  onPress={() => setIsTaxesModalOpen(true)}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modal de Comprovante */}
      <ReceiptModal
        visible={isReceiptModalOpen}
        expense={selectedExpenseForReceipt}
        onClose={() => setIsReceiptModalOpen(false)}
        onSave={handleSaveReceipt}
      />

      {/* Modal de Cadastro/Edição de Despesa */}
      <ExpenseFormModal
        visible={isExpenseModalOpen}
        expenseToEdit={selectedExpenseForEdit}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setSelectedExpenseForEdit(null);
        }}
        onSave={handleSaveExpense}
      />

      {/* Modal de Configuração de Rendas */}
      <IncomeFormModal
        visible={isIncomeModalOpen}
        rendaQ1={cycle?.renda_quinzena_1 || 0}
        rendaQ2={cycle?.renda_quinzena_2 || 0}
        onClose={() => setIsIncomeModalOpen(false)}
        onSave={handleSaveIncomes}
      />

      {/* Modal de Listagem e Gestão de Tributos Anuais */}
      <TaxesListModal
        visible={isTaxesModalOpen}
        userId={user?.uid}
        onClose={() => setIsTaxesModalOpen(false)}
      />
    </SafeAreaView>
  );
};
