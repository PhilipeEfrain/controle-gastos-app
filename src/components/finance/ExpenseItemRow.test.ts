import { Expense } from '../../types/finance';
import { formatBRL } from '../../utils/formatters';

describe('Componentes e Regras da Listagem de Despesas (CARD-003)', () => {
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
});
