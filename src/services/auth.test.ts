import { formatAuthError } from './auth';

describe('Serviço de Autenticação (Auth Service)', () => {
  describe('formatAuthError', () => {
    it('deve formatar erro de e-mail inválido', () => {
      expect(formatAuthError('auth/invalid-email')).toBe('O formato do e-mail informado é inválido.');
    });

    it('deve formatar erro de credencial ou senha incorreta', () => {
      expect(formatAuthError('auth/wrong-password')).toBe('E-mail ou senha incorretos.');
      expect(formatAuthError('auth/invalid-credential')).toBe('E-mail ou senha incorretos.');
      expect(formatAuthError('auth/user-not-found')).toBe('E-mail ou senha incorretos.');
    });

    it('deve formatar erro de e-mail já em uso', () => {
      expect(formatAuthError('auth/email-already-in-use')).toBe('Este e-mail já está cadastrado em outra conta.');
    });

    it('deve formatar erro de senha fraca', () => {
      expect(formatAuthError('auth/weak-password')).toBe('A senha deve conter no mínimo 6 caracteres.');
    });

    it('deve retornar mensagem genérica para erros desconhecidos', () => {
      expect(formatAuthError('auth/unknown-error')).toBe('Ocorreu um erro na autenticação. Tente novamente.');
    });
  });
});
