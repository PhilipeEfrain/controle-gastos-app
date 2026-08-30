import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { Expense } from '../../types/finance';

interface ReceiptModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (expenseId: string, receiptCode: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  expense,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (expense) {
      setCode(expense.codigo_comprovante || '');
    }
  }, [expense]);

  if (!expense) return null;

  const handleSave = () => {
    if (expense.id) {
      onSave(expense.id, code);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <View className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <Text className="text-white font-bold text-lg mb-1">
            Código do Comprovante
          </Text>
          <Text className="text-slate-400 text-sm mb-4">
            Associe o identificador numérico/comprovante de pagamento para <Text className="text-slate-200 font-semibold">{expense.descricao}</Text>.
          </Text>

          <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
            Código / Número do Comprovante
          </Text>
          <TextInput
            placeholder="Ex: 137"
            placeholderTextColor="#64748B"
            value={code}
            onChangeText={setCode}
            keyboardType="default"
            autoFocus
            className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base mb-5"
          />

          <View className="flex-row space-x-3">
            <AppButton
              label="Cancelar"
              variant="outline"
              className="flex-1 mr-2"
              onPress={onClose}
            />
            <AppButton
              label="Salvar Comprovante"
              variant="primary"
              className="flex-1"
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
