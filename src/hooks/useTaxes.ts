import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnnualTax } from '../types/finance';
import { subscribeTaxes, createTax, updateTax, deleteTax } from '../services/taxes';

interface TaxesSummary {
  totalOrcado: number;
  totalPago: number;
  diferenca: number;
  pendentesCount: number;
  pagosCount: number;
}

interface UseTaxesReturn {
  taxes: AnnualTax[];
  loading: boolean;
  summary: TaxesSummary;
  addTax: (tax: Omit<AnnualTax, 'id'>) => Promise<string>;
  editTax: (taxId: string, data: Partial<AnnualTax>) => Promise<void>;
  removeTax: (taxId: string) => Promise<void>;
  toggleTaxPayment: (tax: AnnualTax, valorPagoEfetivo?: number) => Promise<void>;
}

export function useTaxes(userId: string | undefined): UseTaxesReturn {
  const [taxes, setTaxes] = useState<AnnualTax[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setTaxes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeTaxes(userId, (loadedTaxes) => {
      setTaxes(loadedTaxes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const summary = useMemo<TaxesSummary>(() => {
    let totalOrcado = 0;
    let totalPago = 0;
    let pendentesCount = 0;
    let pagosCount = 0;

    taxes.forEach((t) => {
      totalOrcado += t.valor_orcado || 0;
      totalPago += t.valor_pago || 0;
      if (t.status === 'Pago') {
        pagosCount++;
      } else {
        pendentesCount++;
      }
    });

    return {
      totalOrcado,
      totalPago,
      diferenca: totalPago - totalOrcado,
      pendentesCount,
      pagosCount,
    };
  }, [taxes]);

  const addTax = useCallback(
    async (tax: Omit<AnnualTax, 'id'>) => {
      if (!userId) throw new Error('Usuário não autenticado.');
      return await createTax(userId, tax);
    },
    [userId]
  );

  const editTax = useCallback(
    async (taxId: string, data: Partial<AnnualTax>) => {
      if (!userId) throw new Error('Usuário não autenticado.');
      await updateTax(userId, taxId, data);
    },
    [userId]
  );

  const removeTax = useCallback(
    async (taxId: string) => {
      if (!userId) throw new Error('Usuário não autenticado.');
      await deleteTax(userId, taxId);
    },
    [userId]
  );

  const toggleTaxPayment = useCallback(
    async (tax: AnnualTax, valorPagoEfetivo?: number) => {
      if (!userId || !tax.id) throw new Error('Dados inválidos para atualizar tributo.');
      const newStatus = tax.status === 'Pago' ? 'Pendente' : 'Pago';
      const valorFinal = newStatus === 'Pago' ? (valorPagoEfetivo ?? tax.valor_orcado) : 0;
      await updateTax(userId, tax.id, {
        status: newStatus,
        valor_pago: valorFinal,
      });
    },
    [userId]
  );

  return {
    taxes,
    loading,
    summary,
    addTax,
    editTax,
    removeTax,
    toggleTaxPayment,
  };
}
