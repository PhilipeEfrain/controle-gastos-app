import React from 'react';
import { View, Text } from 'react-native';
import { formatBRL } from '../../utils/formatters';

interface DeficitAlertBannerProps {
  saldoFinal: number;
  q1CobreQ2: boolean;
}

export const DeficitAlertBanner: React.FC<DeficitAlertBannerProps> = ({ saldoFinal, q1CobreQ2 }) => {
  if (saldoFinal >= 0 && q1CobreQ2) {
    return null;
  }

  const isCritical = saldoFinal < 0;
  const bgColor = isCritical ? 'bg-red-900/40 border-red-500/80' : 'bg-amber-900/40 border-amber-500/80';
  const textColor = isCritical ? 'text-red-200' : 'text-amber-200';
  const title = isCritical ? '⚠️ Atenção: Déficit Geral no Mês' : '⚠️ Atenção: Déficit na 2ª Quinzena';

  const message = isCritical
    ? `Suas despesas totais superam a renda mensal em ${formatBRL(Math.abs(saldoFinal))}. Realoque despesas para fechar no azul.`
    : `A Quinzena 2 fecha no vermelho, mas o superávit da Quinzena 1 cobre o valor acumulado.`;

  return (
    <View className={`p-4 rounded-2xl border mb-4 ${bgColor}`}>
      <Text className="text-white font-bold text-base mb-1">{title}</Text>
      <Text className={`text-sm ${textColor}`}>{message}</Text>
    </View>
  );
};
