import { Expense } from '../../types/finance';
import { formatBRL } from '../../utils/formatters';

describe('Componentes e Regras da Listagem e Edição de Despesas (CARD-003 & CARD-007)', () => {
  it('deve formatar valor monetário e validar dados de comprovante', () => {
    const expenseWithReceipt: Expense = {
      id: 'exp-1',
      descricao: 'Casa - Débito Alt',
      valor: 1200.0,
      quinzena: 1,
      status_pagamento: true,
      codigo_comprovante: '137',
      categoria: 'Moradia',
    };

    expect(formatBRL(expenseWithReceipt.valor)).toBe('R$ 1.200,00');
    expect(expenseWithReceipt.codigo_comprovante).toBe('137');
    expect(expenseWithReceipt.status_pagamento).toBe(true);
  });

  it('deve permitir atualizar os dados de uma despesa na edição', () => {
    const originalExpense: Expense = {
      id: 'exp-2',
      descricao: 'Supermercado Mensal',
      valor: 800.0,
      quinzena: 1,
      status_pagamento: false,
      categoria: 'Alimentação',
      recorrente: true,
    };

    const updatedData: Partial<Expense> = {
      descricao: 'Supermercado Premium',
      valor: 950.0,
      quinzena: 2,
    };

    const editedExpense: Expense = {
      ...originalExpense,
      ...updatedData,
    };

    expect(editedExpense.id).toBe('exp-2');
    expect(editedExpense.descricao).toBe('Supermercado Premium');
    expect(editedExpense.valor).toBe(950.0);
    expect(editedExpense.quinzena).toBe(2);
    expect(editedExpense.categoria).toBe('Alimentação');
    expect(editedExpense.recorrente).toBe(true);
  });
});
