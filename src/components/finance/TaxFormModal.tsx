import React, { useState } from 'react';
import { View, Text, Modal, TextInput, ActivityIndicator } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AnnualTax } from '../../types/finance';

interface TaxFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taxData: Omit<AnnualTax, 'id'>) => Promise<void>;
}

export const TaxFormModal: React.FC<TaxFormModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState<string>('');
  const [dataVencimento, setDataVencimento] = useState<string>('');
  const [valorOrcadoText, setValorOrcadoText] = useState<string>('');
  const [valorPagoText, setValorPagoText] = useState<string>('');
  const [status, setStatus] = useState<'Pendente' | 'Pago'>('Pendente');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!titulo.trim()) {
      setErrorMessage('Por favor, informe o título do tributo/parcela.');
      return;
    }

    const orcado = parseFloat(valorOrcadoText.replace(',', '.')) || 0;
    const pago = parseFloat(valorPagoText.replace(',', '.')) || 0;

    if (orcado <= 0 && pago <= 0) {
      setErrorMessage('Informe um valor orçado ou pago válido.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        titulo: titulo.trim(),
        data_vencimento: dataVencimento.trim() || '',
        valor_orcado: orcado,
        valor_pago: pago,
        status: status,
      });
      setTitulo('');
      setDataVencimento('');
      setValorOrcadoText('');
      setValorPagoText('');
      setStatus('Pendente');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao cadastrar tributo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <View className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <Text className="text-white font-bold text-xl mb-1">Novo Tributo / Imposto</Text>
          <Text className="text-slate-400 text-xs mb-4">
            Controle impostos anuais e taxas parceladas (IPTU, IPVA, Licenciamento)
          </Text>

          {errorMessage && (
            <View className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 mb-4">
              <Text className="text-red-400 text-xs font-medium">⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Título */}
          <View className="mb-4">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Título do Tributo
            </Text>
            <TextInput
              placeholder="Ex: IPTU 2025 ou IPVA - Licenciamento"
              placeholderTextColor="#64748B"
              value={titulo}
              onChangeText={setTitulo}
              className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base"
            />
          </View>

          {/* Vencimento */}
          <View className="mb-4">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Data de Vencimento
            </Text>
            <TextInput
              placeholder="AAAA-MM-DD (Ex: 2025-04-10)"
              placeholderTextColor="#64748B"
              value={dataVencimento}
              onChangeText={setDataVencimento}
              className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base"
            />
          </View>

          {/* Valor Orçado */}
          <View className="mb-4">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Valor Orçado (R$)
            </Text>
            <TextInput
              placeholder="Ex: 92.25"
              placeholderTextColor="#64748B"
              value={valorOrcadoText}
              onChangeText={setValorOrcadoText}
              keyboardType="numeric"
              className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base font-semibold"
            />
          </View>

          {/* Valor Pago */}
          <View className="mb-5">
            <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
              Valor Efetivamente Pago (R$) (Opcional)
            </Text>
            <TextInput
              placeholder="Ex: 136.95"
              placeholderTextColor="#64748B"
              value={valorPagoText}
              onChangeText={setValorPagoText}
              keyboardType="numeric"
              className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 text-base font-semibold"
            />
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
              label={isLoading ? '' : 'Salvar Tributo'}
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
