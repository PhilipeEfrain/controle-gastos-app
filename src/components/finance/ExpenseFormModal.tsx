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
import { formatBRL } from '../../utils/formatters';

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

  // Estados de Parcelamento
  const [isParcelado, setIsParcelado] = useState<boolean>(false);
  const [totalParcelas, setTotalParcelas] = useState<string>('2');
  const [isValorTotal, setIsValorTotal] = useState<boolean>(true); // Se true, divide o valor pelas parcelas

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
      setIsParcelado(!!(expenseToEdit.total_parcelas && expenseToEdit.total_parcelas > 1));
      setTotalParcelas(expenseToEdit.total_parcelas ? expenseToEdit.total_parcelas.toString() : '2');
      setIsValorTotal(false); // Na edição, o valor exibido já é o da parcela atual
    } else {
      setDescricao('');
      setValorText('');
      setQuinzena(defaultFortnight);
      setCategoria('Moradia');
      setRecorrente(false);
      setDataVencimento('');
      setIsParcelado(false);
      setTotalParcelas('2');
      setIsValorTotal(true);
    }
    setErrorMessage(null);
  }, [expenseToEdit, visible, defaultFortnight]);

  // Cálculos de resumo de parcelamento
  const parsedValor = parseFloat(valorText.replace(',', '.')) || 0;
  const parsedParcelas = parseInt(totalParcelas, 10) || 1;

  const valorPorParcela = isParcelado
    ? isValorTotal
      ? parsedValor / Math.max(1, parsedParcelas)
      : parsedValor
    : parsedValor;

  const valorTotalCompra = isParcelado
    ? isValorTotal
      ? parsedValor
      : parsedValor * parsedParcelas
    : parsedValor;

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!descricao.trim()) {
      setErrorMessage('Por favor, digite a descrição da despesa.');
      return;
    }

    if (parsedValor <= 0) {
      setErrorMessage('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (isParcelado && (parsedParcelas < 2 || isNaN(parsedParcelas))) {
      setErrorMessage('Para despesas parceladas, informe no mínimo 2 parcelas.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        descricao: descricao.trim(),
        valor: Number(valorPorParcela.toFixed(2)),
        quinzena,
        categoria,
        recorrente: isParcelado ? false : recorrente,
        status_pagamento: expenseToEdit?.status_pagamento || false,
        codigo_comprovante: expenseToEdit?.codigo_comprovante || '',
        data_vencimento: dataVencimento.trim() || undefined,
        parcela_atual: isParcelado ? (expenseToEdit?.parcela_atual || 1) : undefined,
        total_parcelas: isParcelado ? parsedParcelas : undefined,
        grupo_parcela_id: expenseToEdit?.grupo_parcela_id,
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
      <View className="flex-1 bg-slate-950/80 backdrop-blur-md justify-center items-center px-4 py-8">
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
                placeholder="Ex: Energia Solar, Cartão, Geladeira"
                placeholderTextColor="#64748B"
                value={descricao}
                onChangeText={setDescricao}
                className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base"
              />
            </View>

            {/* Valor */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                {isParcelado && isValorTotal ? 'Valor Total da Compra (R$)' : 'Valor da Parcela / Conta (R$)'}
              </Text>
              <TextInput
                placeholder="0,00"
                placeholderTextColor="#64748B"
                value={valorText}
                onChangeText={setValorText}
                keyboardType="decimal-pad"
                className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-lg font-bold text-emerald-400"
              />
            </View>

            {/* Seção de Parcelamento */}
            {!expenseToEdit && (
              <View className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-200 font-semibold text-sm">📦 Compra Parcelada?</Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      Gera e propaga as parcelas nos meses seguintes
                    </Text>
                  </View>
                  <Switch
                    value={isParcelado}
                    onValueChange={setIsParcelado}
                    trackColor={{ false: '#334155', true: '#10B981' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {isParcelado && (
                  <View className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-slate-300 text-xs font-medium">Quantidade de Parcelas:</Text>
                      <TextInput
                        placeholder="Ex: 6"
                        placeholderTextColor="#64748B"
                        value={totalParcelas}
                        onChangeText={setTotalParcelas}
                        keyboardType="number-pad"
                        className="bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-700 w-24 text-center font-bold text-base text-purple-300"
                      />
                    </View>

                    {parsedValor > 0 && parsedParcelas > 1 && (
                      <View className="bg-purple-950/40 p-2.5 rounded-lg border border-purple-800/60 mt-2">
                        <Text className="text-purple-300 text-xs font-semibold">
                          Resumo: <Text className="font-extrabold">{parsedParcelas}x de {formatBRL(valorPorParcela)}</Text>
                        </Text>
                        <Text className="text-slate-400 text-[11px] mt-0.5">
                          Total acumulado: {formatBRL(valorTotalCompra)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Quinzena de Lançamento */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                Quinzena de Vencimento
              </Text>
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={() => setQuinzena(1)}
                  className={`flex-1 py-2.5 rounded-xl items-center border mr-2 cursor-pointer ${
                    quinzena === 1
                      ? 'bg-emerald-950/80 border-emerald-500'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      quinzena === 1 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    1ª Quinzena (Dia 31)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuinzena(2)}
                  className={`flex-1 py-2.5 rounded-xl items-center border cursor-pointer ${
                    quinzena === 2
                      ? 'bg-emerald-950/80 border-emerald-500'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      quinzena === 2 ? 'text-emerald-400' : 'text-slate-400'
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
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-500'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Switch de Despesa Recorrente */}
            {!isParcelado && (
              <View className="flex-row justify-between items-center py-3 px-1 mb-4 border-t border-b border-slate-800">
                <View>
                  <Text className="text-slate-200 font-semibold text-sm">Despesa Recorrente?</Text>
                  <Text className="text-slate-400 text-xs">
                    Conta fixa que se repete mensalmente
                  </Text>
                </View>
                <Switch
                  value={recorrente}
                  onValueChange={setRecorrente}
                  trackColor={{ false: '#334155', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            )}

            {/* Ações */}
            <View className="flex-row space-x-3 mt-4">
              <AppButton
                label="Cancelar"
                variant="outline"
                className="flex-1 mr-2"
                onPress={onClose}
                disabled={isLoading}
              />
              <AppButton
                label={isLoading ? '' : expenseToEdit ? 'Salvar Alterações' : 'Adicionar Despesa'}
                variant="primary"
                className="flex-1"
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
              </AppButton>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
