/**
 * Utilitários de formatação para moeda (BRL) e datas.
 */

export const formatBRL = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const parseBRL = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  const clean = formattedValue
    .replace(/[R$\s.]/g, '')
    .replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatMonthYear = (mesAno: string): string => {
  // Ex: '2025-03' -> 'Março de 2025'
  const [year, month] = mesAno.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${year}`;
};
