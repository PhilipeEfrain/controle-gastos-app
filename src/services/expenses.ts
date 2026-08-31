import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  CollectionReference,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Expense } from '../types/finance';
import { addMonthsToYearMonth } from '../utils/calculations';

/**
 * Retorna a referência da subcoleção de despesas do ciclo mensal
 */
export function getExpensesCollectionRef(userId: string, mesAno: string): CollectionReference {
  return collection(db, 'users', userId, 'ciclos_mensais', mesAno, 'despesas');
}

/**
 * Cadastra uma nova despesa no ciclo mensal
 */
export async function createExpense(
  userId: string,
  mesAno: string,
  expense: Omit<Expense, 'id'>
): Promise<string> {
  const colRef = getExpensesCollectionRef(userId, mesAno);
  const docRef = await addDoc(colRef, {
    descricao: expense.descricao.trim(),
    valor: Number(expense.valor) || 0,
    quinzena: expense.quinzena,
    status_pagamento: expense.status_pagamento ?? false,
    codigo_comprovante: expense.codigo_comprovante?.trim() || '',
    categoria: expense.categoria.trim() || 'Outros',
    recorrente: expense.recorrente ?? false,
    data_vencimento: expense.data_vencimento || '',
    parcela_atual: expense.parcela_atual || null,
    total_parcelas: expense.total_parcelas || null,
    grupo_parcela_id: expense.grupo_parcela_id || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Cria uma despesa parcelada gerando as parcelas automaticamente para os meses subsequentes
 */
export async function createInstallmentExpenses(
  userId: string,
  startMesAno: string,
  expense: Omit<Expense, 'id'>,
  totalParcelas: number
): Promise<string> {
  const grupoParcelaId = `parcela_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let firstDocId = '';

  for (let i = 0; i < totalParcelas; i++) {
    const currentMonth = addMonthsToYearMonth(startMesAno, i);
    const parcelaAtual = i + 1;
    const isFirst = i === 0;

    const installmentPayload: Omit<Expense, 'id'> = {
      ...expense,
      parcela_atual: parcelaAtual,
      total_parcelas: totalParcelas,
      grupo_parcela_id: grupoParcelaId,
      status_pagamento: isFirst ? (expense.status_pagamento ?? false) : false,
      codigo_comprovante: isFirst ? (expense.codigo_comprovante || '') : '',
    };

    const docId = await createExpense(userId, currentMonth, installmentPayload);
    if (isFirst) {
      firstDocId = docId;
    }
  }

  return firstDocId;
}

/**
 * Atualiza os dados de uma despesa existente
 */
export async function updateExpense(
  userId: string,
  mesAno: string,
  expenseId: string,
  data: Partial<Expense>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'ciclos_mensais', mesAno, 'despesas', expenseId);
  const updateData: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (data.descricao !== undefined) updateData.descricao = data.descricao.trim();
  if (data.valor !== undefined) updateData.valor = Number(data.valor);
  if (data.quinzena !== undefined) updateData.quinzena = data.quinzena;
  if (data.status_pagamento !== undefined) updateData.status_pagamento = data.status_pagamento;
  if (data.codigo_comprovante !== undefined) updateData.codigo_comprovante = data.codigo_comprovante.trim();
  if (data.categoria !== undefined) updateData.categoria = data.categoria.trim();
  if (data.recorrente !== undefined) updateData.recorrente = data.recorrente;
  if (data.data_vencimento !== undefined) updateData.data_vencimento = data.data_vencimento;
  if (data.parcela_atual !== undefined) updateData.parcela_atual = data.parcela_atual;
  if (data.total_parcelas !== undefined) updateData.total_parcelas = data.total_parcelas;
  if (data.grupo_parcela_id !== undefined) updateData.grupo_parcela_id = data.grupo_parcela_id;

  await updateDoc(docRef, updateData);
}

/**
 * Alterna o status de pagamento e opcionalmente associa o código do comprovante
 */
export async function toggleExpensePayment(
  userId: string,
  mesAno: string,
  expenseId: string,
  status: boolean,
  codigoComprovante?: string
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'ciclos_mensais', mesAno, 'despesas', expenseId);
  const updatePayload: Record<string, any> = {
    status_pagamento: status,
    updatedAt: serverTimestamp(),
  };

  if (codigoComprovante !== undefined) {
    updatePayload.codigo_comprovante = codigoComprovante.trim();
  }

  await updateDoc(docRef, updatePayload);
}

/**
 * Remove uma despesa da subcoleção
 */
export async function deleteExpense(
  userId: string,
  mesAno: string,
  expenseId: string
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'ciclos_mensais', mesAno, 'despesas', expenseId);
  await deleteDoc(docRef);
}

/**
 * Escuta as despesas do mês em tempo real
 */
export function subscribeExpenses(
  userId: string,
  mesAno: string,
  callback: (expenses: Expense[]) => void
): () => void {
  const colRef = getExpensesCollectionRef(userId, mesAno);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const expenses: Expense[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          descricao: data.descricao || '',
          valor: data.valor || 0,
          quinzena: data.quinzena || 1,
          status_pagamento: data.status_pagamento || false,
          codigo_comprovante: data.codigo_comprovante || '',
          categoria: data.categoria || 'Outros',
          recorrente: data.recorrente || false,
          data_vencimento: data.data_vencimento || '',
          parcela_atual: data.parcela_atual || undefined,
          total_parcelas: data.total_parcelas || undefined,
          grupo_parcela_id: data.grupo_parcela_id || undefined,
        };
      });
      callback(expenses);
    },
    (error) => {
      console.warn('Erro ao escutar despesas:', error);
      callback([]);
    }
  );
}
