import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { TaxComparisonCard } from './TaxComparisonCard';
import { TaxFormModal } from './TaxFormModal';
import { useTaxes } from '../../hooks/useTaxes';
import { formatBRL } from '../../utils/formatters';
import { AnnualTax } from '../../types/finance';

interface TaxesListModalProps {
  visible: boolean;
  userId: string | undefined;
  onClose: () => void;
}

export const TaxesListModal: React.FC<TaxesListModalProps> = ({
  visible,
  userId,
  onClose,
}) => {
  const { taxes, loading, summary, addTax, toggleTaxPayment, removeTax } = useTaxes(userId);
  const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState<boolean>(false);

  const handleSaveTax = async (taxData: Omit<AnnualTax, 'id'>) => {
    await addTax(taxData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/75 justify-center items-center px-4 py-8">
        <View className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex-1 max-h-[92%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <View>
              <Text className="text-white font-bold text-xl">Tributos & Parcelamentos Anuais</Text>
              <Text className="text-slate-400 text-xs">Acompanhamento comparativo: Orçado vs Pago</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center border border-slate-700"
            >
              <Text className="text-slate-300 font-bold text-sm">✕</Text>
            </Pressable>
          </View>

          {/* Card Resumo Consolidado de Tributos */}
          <View className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
            <View className="flex-row justify-between items-center pb-2 border-b border-slate-800/80">
              <Text className="text-slate-400 text-xs">Total Orçado no Ano:</Text>
              <Text className="text-slate-200 font-bold text-sm">{formatBRL(summary.totalOrcado)}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-800/80">
              <Text className="text-slate-400 text-xs">Total Efetivamente Pago:</Text>
              <Text className="text-emerald-400 font-bold text-sm">{formatBRL(summary.totalPago)}</Text>
            </View>
            <View className="flex-row justify-between items-center pt-2">
              <Text className="text-slate-400 text-xs">Diferença / Variação:</Text>
              <Text
                className={`font-bold text-sm ${
                  summary.diferenca > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {summary.diferenca > 0 ? `+${formatBRL(summary.diferenca)}` : formatBRL(summary.diferenca)}
              </Text>
            </View>
          </View>

          {/* Lista de Tributos */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-slate-400 text-xs mt-3">Carregando tributos...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-4">
              {taxes.length === 0 ? (
                <View className="py-12 items-center justify-center border border-dashed border-slate-800 rounded-2xl">
                  <Text className="text-slate-400 text-sm font-medium">Nenhum tributo cadastrado ainda.</Text>
                  <Text className="text-slate-600 text-xs mt-1">Ex: IPTU, IPVA, Licenciamento, Taxa de Bombeiros</Text>
                </View>
              ) : (
                taxes.map((t) => (
                  <TaxComparisonCard
                    key={t.id || t.titulo}
                    tax={t}
                    onToggleStatus={toggleTaxPayment}
                    onDelete={(tax) => tax.id && removeTax(tax.id)}
                  />
                ))
              )}
            </ScrollView>
          )}

          {/* Ações */}
          <View className="flex-row space-x-3 pt-2">
            <AppButton
              label="+ Novo Tributo"
              variant="primary"
              className="flex-1 mr-2"
              onPress={() => setIsNewTaxModalOpen(true)}
            />
            <AppButton
              label="Fechar"
              variant="outline"
              className="flex-1"
              onPress={onClose}
            />
          </View>
        </View>
      </View>

      {/* Modal de Formulário de Novo Tributo */}
      <TaxFormModal
        visible={isNewTaxModalOpen}
        onClose={() => setIsNewTaxModalOpen(false)}
        onSave={handleSaveTax}
      />
    </Modal>
  );
};
