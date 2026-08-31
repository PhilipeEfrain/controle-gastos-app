import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, ActivityIndicator } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { formatBRL } from '../../utils/formatters';

interface IncomeFormModalProps {
  visible: boolean;
  rendaQ1: number;
  rendaQ2: number;
  onClose: () => void;
  onSave: (rendaQ1: number, rendaQ2: number) => Promise<void>;
}

export const IncomeFormModal: React.FC<IncomeFormModalProps> = ({
  visible,
  rendaQ1,
  rendaQ2,
  onClose,
  onSave,
}) => {
  const [q1Text, setQ1Text] = useState<string>('');
  const [q2Text, setQ2Text] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setQ1Text(rendaQ1 ? rendaQ1.toString() : '');
    setQ2Text(rendaQ2 ? rendaQ2.toString() : '');
    setErrorMessage(null);
  }, [rendaQ1, rendaQ2, visible]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    const val1 = parseFloat(q1Text.replace(',', '.')) || 0;
    const val2 = parseFloat(q2Text.replace(',', '.')) || 0;

    if (val1 < 0 || val2 < 0) {
      setErrorMessage('Os valores de renda não podem ser negativos.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(val1, val2);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar rendas quinzenais.');
    } finally {
      setIsLoading(false);
    }
  };

  const total = (parseFloat(q1Text.replace(',', '.')) || 0) + (parseFloat(q2Text.replace(',', '.')) || 0);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-950/80 backdrop-blur-md justify-center items-center px-4">
        <View className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <Text className="text-white font-bold text-xl mb-1">Configurar Rendas</Text>
          <Text className="text-slate-400 text-xs mb-4">
            Defina o valor previsto de entrada para cada quinzena
          </Text>

          {errorMessage && (
            <View className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 mb-4">
              <Text className="text-red-400 text-xs font-medium">⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Renda Quinzena 1 */}
          <View className="mb-4">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Renda 1ª Quinzena (Dia 31)
            </Text>
            <TextInput
              placeholder="Ex: 2588.51"
              placeholderTextColor="#64748B"
              value={q1Text}
              onChangeText={setQ1Text}
              keyboardType="numeric"
              className="bg-slate-950 text-emerald-400 px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base font-bold"
            />
          </View>

          {/* Renda Quinzena 2 */}
          <View className="mb-4">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Renda 2ª Quinzena (Dia 15)
            </Text>
            <TextInput
              placeholder="Ex: 2389.28"
              placeholderTextColor="#64748B"
              value={q2Text}
              onChangeText={setQ2Text}
              keyboardType="numeric"
              className="bg-slate-950 text-emerald-400 px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base font-bold"
            />
          </View>

          {/* Totalizador Previsto */}
          <View className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-5 flex-row justify-between items-center">
            <Text className="text-slate-400 text-sm font-medium">Renda Total do Mês:</Text>
            <Text className="text-emerald-400 font-extrabold text-base">{formatBRL(total)}</Text>
          </View>

          {/* Botões */}
          <View className="flex-row space-x-3">
            <AppButton
              label="Cancelar"
              variant="outline"
              className="flex-1 mr-2"
              onPress={onClose}
              disabled={isLoading}
            />
            <AppButton
              label={isLoading ? '' : 'Salvar Rendas'}
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
