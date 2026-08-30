import { calculateGlobalBalance } from '../utils/calculations';
import { Expense } from '../types/finance';

describe('Integração de Modelos e Cálculos do Ciclo Mensal (CARD-002)', () => {
  it('deve consolidar o ciclo mensal da planilha com base nos dados quinzenais', () => {
    const rendaQ1 = 2588.51; // Dia 31
    const rendaQ2 = 2389.28; // Dia 15
    const mockExpenses: Expense[] = [
      { id: '1', descricao: 'Casa - Débito Alt', valor: 1200.0, quinzena: 1, status_pagamento: true, codigo_comprovante: '137', categoria: 'Moradia' },
      { id: '2', descricao: 'Energia Solar', valor: 859.19, quinzena: 1, status_pagamento: true, categoria: 'Serviços' },
      { id: '3', descricao: 'Cartão de Crédito', valor: 2500.0, quinzena: 2, status_pagamento: false, categoria: 'Cartão' },
      { id: '4', descricao: 'Fies', valor: 683.21, quinzena: 2, status_pagamento: false, categoria: 'Educação' },
    ];

    const summary = calculateGlobalBalance(rendaQ1, rendaQ2, mockExpenses);

    // Validações exatas do Entendimento.md
    expect(summary.totalRenda).toBeCloseTo(4977.79, 2);
    expect(summary.totalGastos).toBeCloseTo(5242.4, 2);
    expect(summary.saldoFinal).toBeCloseTo(-264.61, 2);
    expect(summary.temDeficitGlobal).toBe(true);

    // Validação Quinzena 1
    expect(summary.q1.renda).toBe(2588.51);
    expect(summary.q1.totalGastos).toBeCloseTo(2059.19, 2);
    expect(summary.q1.saldo).toBeCloseTo(529.32, 2);
    expect(summary.q1.isDeficit).toBe(false);

    // Validação Quinzena 2
    expect(summary.q2.renda).toBe(2389.28);
    expect(summary.q2.totalGastos).toBeCloseTo(3183.21, 2);
    expect(summary.q2.saldo).toBeCloseTo(-793.93, 2);
    expect(summary.q2.isDeficit).toBe(true);
  });
});
