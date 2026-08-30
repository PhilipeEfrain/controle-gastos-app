import { Expense, MonthBalanceSummary, FortnightSummary } from '../types/finance';

/**
 * Soma despesas de uma lista.
 */
export const sumExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((acc, curr) => acc + (curr.valor || 0), 0);
};

/**
 * Filtra despesas pertencentes à Quinzena 1 ou 2.
 */
export const filterExpensesByFortnight = (expenses: Expense[], quinzena: 1 | 2): Expense[] => {
  return expenses.filter(e => e.quinzena === quinzena);
};

/**
 * Calcula saldo da quinzena (Renda - Soma de Despesas da quinzena).
 */
export const calculateFortnightBalance = (income: number, expenses: Expense[]): number => {
  const total = sumExpenses(expenses);
  return Number((income - total).toFixed(2));
};

/**
 * Calcula balanço global do mês com suporte à análise de cobertura de déficit.
 */
export const calculateGlobalBalance = (
  rendaQ1: number,
  rendaQ2: number,
  expenses: Expense[]
): MonthBalanceSummary => {
  const q1Expenses = filterExpensesByFortnight(expenses, 1);
  const q2Expenses = filterExpensesByFortnight(expenses, 2);

  const totalGastosQ1 = Number(sumExpenses(q1Expenses).toFixed(2));
  const totalGastosQ2 = Number(sumExpenses(q2Expenses).toFixed(2));

  const saldoQ1 = Number((rendaQ1 - totalGastosQ1).toFixed(2));
  const saldoQ2 = Number((rendaQ2 - totalGastosQ2).toFixed(2));

  const totalRenda = Number((rendaQ1 + rendaQ2).toFixed(2));
  const totalGastos = Number((totalGastosQ1 + totalGastosQ2).toFixed(2));
  const saldoFinal = Number((totalRenda - totalGastos).toFixed(2));

  const q1Summary: FortnightSummary = {
    quinzena: 1,
    label: 'Quinzena 1 (Dia 31)',
    renda: rendaQ1,
    totalGastos: totalGastosQ1,
    saldo: saldoQ1,
    isDeficit: saldoQ1 < 0,
  };

  const q2Summary: FortnightSummary = {
    quinzena: 2,
    label: 'Quinzena 2 (Dia 15)',
    renda: rendaQ2,
    totalGastos: totalGastosQ2,
    saldo: saldoQ2,
    isDeficit: saldoQ2 < 0,
  };

  // Se a Q1 tiver saldo positivo e cobrir o déficit da Q2
  const q1CobreQ2 = saldoQ2 < 0 ? (saldoQ1 + saldoQ2 >= 0) : true;

  return {
    totalRenda,
    totalGastos,
    saldoFinal,
    temDeficitGlobal: saldoFinal < 0,
    q1: q1Summary,
    q2: q2Summary,
    q1CobreQ2,
  };
};
