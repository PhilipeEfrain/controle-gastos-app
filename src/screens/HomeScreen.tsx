import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, useWindowDimensions, StatusBar, Pressable } from 'react-native';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { BalanceBadge } from '../components/ui/BalanceBadge';
import { DeficitAlertBanner } from '../components/ui/DeficitAlertBanner';
import { FortnightCard } from '../components/finance/FortnightCard';
import { formatBRL } from '../utils/formatters';
import { calculateGlobalBalance } from '../utils/calculations';
import { Expense } from '../types/finance';
import { useAuth } from '../hooks/useAuth';

export const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWebWide = width >= 768; // Breakpoint para layout em colunas na Web
  const { user, logout } = useAuth();

  // Dados reais da planilha contidos no Entendimento.md
  const [rendaQ1] = useState<number>(2588.51); // Dia 31
  const [rendaQ2] = useState<number>(2389.28); // Dia 15
  const [expenses] = useState<Expense[]>([
    { id: '1', descricao: 'Casa - Débito Alt', valor: 1200.00, quinzena: 1, status_pagamento: true, codigo_comprovante: '137', categoria: 'Moradia' },
    { id: '2', descricao: 'Energia Solar', valor: 859.19, quinzena: 1, status_pagamento: true, categoria: 'Serviços' },
    { id: '3', descricao: 'Cartão de Crédito', valor: 2500.00, quinzena: 2, status_pagamento: false, categoria: 'Cartão' },
    { id: '4', descricao: 'Fies', valor: 683.21, quinzena: 2, status_pagamento: false, categoria: 'Educação' },
  ]);

  const summary = calculateGlobalBalance(rendaQ1, rendaQ2, expenses);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Container centralizado para Web */}
        <View className="max-w-4xl w-full self-center">
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
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 active:bg-slate-700"
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

          {/* Banner de Déficit se houver */}
          <DeficitAlertBanner saldoFinal={summary.saldoFinal} q1CobreQ2={summary.q1CobreQ2} />

          {/* Card Resumo Geral do Mês */}
          <AppCard className="mb-6 bg-slate-900 border-slate-700">
            <Text className="text-slate-300 font-semibold text-base mb-3">Resumo Geral do Mês</Text>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
              <Text className="text-slate-400">Renda Total:</Text>
              <Text className="text-emerald-400 font-bold text-base">{formatBRL(summary.totalRenda)}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
              <Text className="text-slate-400">Total de Despesas:</Text>
              <Text className="text-red-400 font-bold text-base">{formatBRL(summary.totalGastos)}</Text>
            </View>
            <View className="flex-row justify-between items-center pt-3">
              <Text className="text-slate-200 font-bold">Saldo Consolidado:</Text>
              <Text className={`font-bold text-lg ${summary.saldoFinal < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatBRL(summary.saldoFinal)}
              </Text>
            </View>
          </AppCard>

          {/* Visão Dividida por Quinzena (Lado a lado na Web, Vertical no Mobile) */}
          <Text className="text-white font-bold text-lg mb-3">Visão por Quinzena</Text>
          <View className={isWebWide ? 'flex-row space-x-4' : 'flex-col'}>
            <FortnightCard summary={summary.q1} />
            <FortnightCard summary={summary.q2} />
          </View>

          {/* Ações Rápidas */}
          <View className="flex-row space-x-3 mt-4">
            <AppButton
              label="+ Nova Despesa"
              variant="primary"
              className="flex-1 mr-2"
              onPress={() => console.log('Adicionar despesa')}
            />
            <AppButton
              label="Tributos Anuais"
              variant="secondary"
              className="flex-1"
              onPress={() => console.log('Abrir tributos')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
