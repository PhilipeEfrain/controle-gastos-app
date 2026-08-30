import { useState, useEffect, useMemo, useCallback } from 'react';
import { MonthlyCycle, Expense, MonthBalanceSummary } from '../types/finance';
import { subscribeMonthlyCycle, updateCycleIncomes, saveMonthlyCycle } from '../services/monthlyCycle';
import {
  subscribeExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  toggleExpensePayment,
} from '../services/expenses';
import { calculateGlobalBalance } from '../utils/calculations';

interface UseMonthlyCycleReturn {
  cycle: MonthlyCycle | null;
  expenses: Expense[];
  summary: MonthBalanceSummary;
  loading: boolean;
  saveIncomes: (rendaQ1: number, rendaQ2: number) => Promise<void>;
  addNewExpense: (expense: Omit<Expense, 'id'>) => Promise<string>;
  modifyExpense: (expenseId: string, data: Partial<Expense>) => Promise<void>;
  removeExpense: (expenseId: string) => Promise<void>;
  togglePayment: (expenseId: string, status: boolean, codigoComprovante?: string) => Promise<void>;
}

export function useMonthlyCycle(userId: string | undefined, mesAno: string): UseMonthlyCycleReturn {
  const [cycle, setCycle] = useState<MonthlyCycle | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !mesAno) {
      setCycle(null);
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cycleLoaded = false;
    let expensesLoaded = false;

    const checkLoading = () => {
      if (cycleLoaded && expensesLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeCycle = subscribeMonthlyCycle(userId, mesAno, (loadedCycle) => {
      setCycle(loadedCycle);
      cycleLoaded = true;
      checkLoading();
    });

    const unsubscribeExpenses = subscribeExpenses(userId, mesAno, (loadedExpenses) => {
      setExpenses(loadedExpenses);
      expensesLoaded = true;
      checkLoading();
    });

    return () => {
      unsubscribeCycle();
      unsubscribeExpenses();
    };
  }, [userId, mesAno]);

  const summary = useMemo<MonthBalanceSummary>(() => {
    const rendaQ1 = cycle?.renda_quinzena_1 || 0;
    const rendaQ2 = cycle?.renda_quinzena_2 || 0;
    return calculateGlobalBalance(rendaQ1, rendaQ2, expenses);
  }, [cycle?.renda_quinzena_1, cycle?.renda_quinzena_2, expenses]);

  const saveIncomes = useCallback(
    async (rendaQ1: number, rendaQ2: number) => {
      if (!userId || !mesAno) return;
      await updateCycleIncomes(userId, mesAno, rendaQ1, rendaQ2);
    },
    [userId, mesAno]
  );

  const addNewExpense = useCallback(
    async (expense: Omit<Expense, 'id'>) => {
      if (!userId || !mesAno) throw new Error('Usuário não autenticado.');
      return await createExpense(userId, mesAno, expense);
    },
    [userId, mesAno]
  );

  const modifyExpense = useCallback(
    async (expenseId: string, data: Partial<Expense>) => {
      if (!userId || !mesAno) throw new Error('Usuário não autenticado.');
      await updateExpense(userId, mesAno, expenseId, data);
    },
    [userId, mesAno]
  );

  const removeExpense = useCallback(
    async (expenseId: string) => {
      if (!userId || !mesAno) throw new Error('Usuário não autenticado.');
      await deleteExpense(userId, mesAno, expenseId);
    },
    [userId, mesAno]
  );

  const togglePayment = useCallback(
    async (expenseId: string, status: boolean, codigoComprovante?: string) => {
      if (!userId || !mesAno) throw new Error('Usuário não autenticado.');
      await toggleExpensePayment(userId, mesAno, expenseId, status, codigoComprovante);
    },
    [userId, mesAno]
  );

  return {
    cycle,
    expenses,
    summary,
    loading,
    saveIncomes,
    addNewExpense,
    modifyExpense,
    removeExpense,
    togglePayment,
  };
}
