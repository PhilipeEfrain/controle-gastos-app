export type FortnightNumber = 1 | 2;

export interface Expense {
  id?: string;
  descricao: string;
  valor: number;
  quinzena: FortnightNumber;
  status_pagamento: boolean;
  codigo_comprovante?: string;
  categoria: string;
  recorrente?: boolean;
  data_vencimento?: string;
}

export interface MonthlyCycle {
  id?: string;
  mesAno: string; // Ex: '2025-03'
  renda_quinzena_1: number; // Dia 31
  renda_quinzena_2: number; // Dia 15
  total_renda: number;
  total_gastos: number;
  saldo_final: number;
}

export interface FortnightSummary {
  quinzena: FortnightNumber;
  label: string; // 'Quinzena 1 (Dia 31)' ou 'Quinzena 2 (Dia 15)'
  renda: number;
  totalGastos: number;
  saldo: number;
  isDeficit: boolean;
}

export interface MonthBalanceSummary {
  totalRenda: number;
  totalGastos: number;
  saldoFinal: number;
  temDeficitGlobal: boolean;
  q1: FortnightSummary;
  q2: FortnightSummary;
  q1CobreQ2: boolean;
}

export interface AnnualTax {
  id?: string;
  titulo: string; // Ex: "IPTU 2025", "IPVA 2025 - Licenciamento"
  data_vencimento: string; // YYYY-MM-DD
  valor_orcado: number;
  valor_pago: number;
  status: 'Pendente' | 'Pago';
}
