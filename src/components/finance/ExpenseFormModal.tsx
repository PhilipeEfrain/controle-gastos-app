import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { AppButton } from '../ui/AppButton';
import { Expense, FortnightNumber } from '../../types/finance';
import { parseBRL, formatBRL } from '../../utils/formatters';

interface ExpenseFormModalProps {
  visible: boolean;
  expenseToEdit?: Expense | null;
  defaultFortnight?: FortnightNumber;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id'>) => Promise<void>;
}

const CATEGORIES = [
  'Moradia',
  'Cartão',
  'Serviços',
  'Educação',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Outros',
];

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  visible,
  expenseToEdit,
  defaultFortnight = 1,
  onClose,
  onSave,
}) => {
  const [descricao, setDescricao] = useState<string>('');
  const [valorText, setValorText] = useState<string>('');
  const [quinzena, setQuinzena] = useState<FortnightNumber>(defaultFortnight);
  const [categoria, setCategoria] = useState<string>('Moradia');
  const [recorrente, setRecorrente] = useState<boolean>(false);
  const [dataVencimento, setDataVencimento] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (expenseToEdit) {
      setDescricao(expenseToEdit.descricao);
      setValorText(expenseToEdit.valor ? expenseToEdit.valor.toString() : '');
      setQuinzena(expenseToEdit.quinzena);
      setCategoria(expenseToEdit.categoria || 'Moradia');
      setRecorrente(expenseToEdit.recorrente || false);
      setDataVencimento(expenseToEdit.data_vencimento || '');
    } else {
      setDescricao('');
      setValorText('');
      setQuinzena(defaultFortnight);
      setCategoria('Moradia');
      setRecorrente(false);
      setDataVencimento('');
    }
    setErrorMessage(null);
  }, [expenseToEdit, visible, defaultFortnight]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!descricao.trim()) {
      setErrorMessage('Por favor, digite a descrição da despesa.');
      return;
    }

    const numericValue = parseFloat(valorText.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      setErrorMessage('Por favor, informe um valor válido maior que zero.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        descricao: descricao.trim(),
        valor: numericValue,
        quinzena,
        categoria,
        recorrente,
        status_pagamento: expenseToEdit?.status_pagamento || false,
        codigo_comprovante: expenseToEdit?.codigo_comprovante || '',
        data_vencimento: dataVencimento.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar despesa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-center items-center px-4 py-8">
        <View className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl max-h-[90%]">
          <Text className="text-white font-bold text-xl mb-1">
            {expenseToEdit ? 'Editar Despesa' : 'Nova Despesa'}
          </Text>
          <Text className="text-slate-400 text-xs mb-4">
            Cadastre os lançamentos quinzenais do seu orçamento
          </Text>

          {errorMessage && (
            <View className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 mb-4">
              <Text className="text-red-400 text-xs font-medium">⚠️ {errorMessage}</Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Descrição */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                Descrição da Conta
              </Text>
              <TextInput
                placeholder="Ex: Energia Solar, Cartão, Aluguel"
                placeholderTextColor="#64748B"
                value={descricao}
                onChangeText={setDescricao}
                className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base"
              />
            </View>

            {/* Valor */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                Valor (R$)
              </Text>
              <TextInput
                placeholder="Ex: 859.19"
                placeholderTextColor="#64748B"
                value={valorText}
                onChangeText={setValorText}
                keyboardType="numeric"
                className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base font-semibold"
              />
            </View>

            {/* Quinzena */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                Quinzena do Pagamento
              </Text>
              <View className="flex-row bg-slate-950 p-1 rounded-xl border border-slate-800">
                <Pressable
                  onPress={() => setQuinzena(1)}
                  className={`flex-1 py-2.5 rounded-lg items-center ${
                    quinzena === 1 ? 'bg-emerald-600 shadow' : ''
                  }`}
                >
                  <Text
                    className={`font-semibold text-xs ${
                      quinzena === 1 ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    1ª Quinzena (Dia 31)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuinzena(2)}
                  className={`flex-1 py-2.5 rounded-lg items-center ${
                    quinzena === 2 ? 'bg-emerald-600 shadow' : ''
                  }`}
                >
                  <Text
                    className={`font-semibold text-xs ${
                      quinzena === 2 ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    2ª Quinzena (Dia 15)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Categoria */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                Categoria
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = categoria === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategoria(cat)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Recorrente Switch */}
            <View className="flex-row items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-6">
              <View>
                <Text className="text-slate-200 text-sm font-semibold">Despesa Recorrente</Text>
                <Text className="text-slate-500 text-xs">Repetir automaticamente nos próximos meses</Text>
              </View>
              <Switch
                value={recorrente}
                onValueChange={setRecorrente}
                trackColor={{ false: '#334155', true: '#059669' }}
                thumbColor={recorrente ? '#10B981' : '#94A3B8'}
              />
            </View>
          </ScrollView>

          {/* Botões de Ação */}
          <View className="flex-row space-x-3 pt-2">
            <AppButton
              label="Cancelar"
              variant="outline"
              className="flex-1 mr-2"
              onPress={onClose}
              disabled={isLoading}
            />
            <AppButton
              label={isLoading ? '' : 'Salvar Despesa'}
              variant="primary"
              className="flex-1"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};
