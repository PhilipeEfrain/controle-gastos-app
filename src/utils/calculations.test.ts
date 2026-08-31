import { calculateFortnightBalance, calculateGlobalBalance, sumExpenses, addMonthsToYearMonth } from './calculations';
import { Expense } from '../types/finance';

describe('Motor Financeiro Quinzenal (Entendimento.md)', () => {
  const mockExpenses: Expense[] = [
    // Quinzena 1 (Dia 31)
    { descricao: 'Casa - Débito Alt', valor: 1200.00, quinzena: 1, status_pagamento: true, categoria: 'Moradia' },
    { descricao: 'Energia Solar', valor: 859.19, quinzena: 1, status_pagamento: true, categoria: 'Serviços' },
    // Quinzena 2 (Dia 15)
    { descricao: 'Cartão de Crédito', valor: 2500.00, quinzena: 2, status_pagamento: false, categoria: 'Cartão' },
    { descricao: 'Fies', valor: 683.21, quinzena: 2, status_pagamento: false, categoria: 'Educação' },
  ];

  const rendaQ1 = 2588.51; // Dia 31
  const rendaQ2 = 2389.28; // Dia 15

  it('deve somar despesas corretamente', () => {
    const total = sumExpenses(mockExpenses);
    expect(total).toBeCloseTo(5242.40, 2);
  });

  it('deve calcular o saldo positivo da Quinzena 1 (Dia 31)', () => {
    const q1Expenses = mockExpenses.filter(e => e.quinzena === 1);
    const saldoQ1 = calculateFortnightBalance(rendaQ1, q1Expenses);
    // 2588.51 - (1200 + 859.19) = 2588.51 - 2059.19 = 529.32
    expect(saldoQ1).toBeCloseTo(529.32, 2);
  });

  it('deve calcular o saldo deficitário da Quinzena 2 (Dia 15)', () => {
    const q2Expenses = mockExpenses.filter(e => e.quinzena === 2);
    const saldoQ2 = calculateFortnightBalance(rendaQ2, q2Expenses);
    // 2389.28 - (2500 + 683.21) = 2389.28 - 3183.21 = -793.93
    expect(saldoQ2).toBeCloseTo(-793.93, 2);
  });

  it('deve calcular o balanço global e detectar déficit geral (-R$ 264,61)', () => {
    const summary = calculateGlobalBalance(rendaQ1, rendaQ2, mockExpenses);

    expect(summary.totalRenda).toBeCloseTo(4977.79, 2);
    expect(summary.totalGastos).toBeCloseTo(5242.40, 2);
    expect(summary.saldoFinal).toBeCloseTo(-264.61, 2);
    expect(summary.temDeficitGlobal).toBe(true);
    expect(summary.q1.isDeficit).toBe(false);
    expect(summary.q2.isDeficit).toBe(true);
    // O superávit de Q1 (+529.32) não cobre o déficit de Q2 (-793.93)
    expect(summary.q1CobreQ2).toBe(false);
  });

  describe('addMonthsToYearMonth', () => {
    it('deve avançar meses dentro do mesmo ano', () => {
      expect(addMonthsToYearMonth('2025-03', 1)).toBe('2025-04');
      expect(addMonthsToYearMonth('2025-03', 5)).toBe('2025-08');
    });

    it('deve avançar meses com virada de ano', () => {
      expect(addMonthsToYearMonth('2025-11', 2)).toBe('2026-01');
      expect(addMonthsToYearMonth('2025-03', 12)).toBe('2026-03');
    });
  });
});
