import { parseBRL } from '../../utils/formatters';

describe('Validação de Dados de Formulários Financeiros (CARD-004)', () => {
  it('deve converter valores digitados em float numérico corretamente', () => {
    expect(parseBRL('R$ 859,19')).toBe(859.19);
    expect(parseBRL('2500,00')).toBe(2500.0);
    expect(parseBRL('1.200,50')).toBe(1200.5);
  });

  it('deve rejeitar valores vazios ou não numéricos', () => {
    expect(parseBRL('')).toBe(0);
    expect(parseBRL('abc')).toBe(0);
  });
});
