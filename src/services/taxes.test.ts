import { AnnualTax } from '../types/finance';

describe('Cálculos e Modelos de Tributos Anuais (CARD-005)', () => {
  it('deve calcular corretamente a variação entre orçado e pago', () => {
    const taxIPVA: AnnualTax = {
      id: 'tax-1',
      titulo: 'IPVA 2025 - Licenciamento',
      data_vencimento: '2025-04-10',
      valor_orcado: 92.25,
      valor_pago: 136.95,
      status: 'Pago',
    };

    const diff = taxIPVA.valor_pago - taxIPVA.valor_orcado;
    expect(diff).toBeCloseTo(44.7, 2);
    expect(taxIPVA.status).toBe('Pago');
  });

  it('deve identificar tributos com status pendente', () => {
    const taxIPTU: AnnualTax = {
      id: 'tax-2',
      titulo: 'IPTU 2025',
      data_vencimento: '2025-05-15',
      valor_orcado: 350.0,
      valor_pago: 0,
      status: 'Pendente',
    };

    expect(taxIPTU.status).toBe('Pendente');
    expect(taxIPTU.valor_pago).toBe(0);
  });
});
