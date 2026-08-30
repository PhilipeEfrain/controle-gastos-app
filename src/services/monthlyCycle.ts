import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { MonthlyCycle } from '../types/finance';

/**
 * Retorna a referência do documento de ciclo mensal
 */
export function getMonthlyCycleDocRef(userId: string, mesAno: string): DocumentReference {
  return doc(db, 'users', userId, 'ciclos_mensais', mesAno);
}

/**
 * Busca os dados de um ciclo mensal específico
 */
export async function getMonthlyCycle(userId: string, mesAno: string): Promise<MonthlyCycle | null> {
  const docRef = getMonthlyCycleDocRef(userId, mesAno);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, mesAno, ...(docSnap.data() as Omit<MonthlyCycle, 'id' | 'mesAno'>) };
  }
  return null;
}

/**
 * Cria ou inicializa um ciclo mensal caso ainda não exista
 */
export async function saveMonthlyCycle(
  userId: string,
  mesAno: string,
  data: Partial<MonthlyCycle>
): Promise<void> {
  const docRef = getMonthlyCycleDocRef(userId, mesAno);
  await setDoc(
    docRef,
    {
      mesAno,
      renda_quinzena_1: data.renda_quinzena_1 ?? 0,
      renda_quinzena_2: data.renda_quinzena_2 ?? 0,
      total_renda: (data.renda_quinzena_1 ?? 0) + (data.renda_quinzena_2 ?? 0),
      total_gastos: data.total_gastos ?? 0,
      saldo_final: data.saldo_final ?? 0,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Atualiza apenas os valores de renda da Quinzena 1 (Dia 31) e Quinzena 2 (Dia 15)
 */
export async function updateCycleIncomes(
  userId: string,
  mesAno: string,
  rendaQ1: number,
  rendaQ2: number
): Promise<void> {
  const docRef = getMonthlyCycleDocRef(userId, mesAno);
  await setDoc(
    docRef,
    {
      mesAno,
      renda_quinzena_1: rendaQ1,
      renda_quinzena_2: rendaQ2,
      total_renda: rendaQ1 + rendaQ2,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Observa o ciclo mensal em tempo real via onSnapshot
 */
export function subscribeMonthlyCycle(
  userId: string,
  mesAno: string,
  callback: (cycle: MonthlyCycle | null) => void
): () => void {
  const docRef = getMonthlyCycleDocRef(userId, mesAno);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          mesAno,
          renda_quinzena_1: data.renda_quinzena_1 || 0,
          renda_quinzena_2: data.renda_quinzena_2 || 0,
          total_renda: data.total_renda || 0,
          total_gastos: data.total_gastos || 0,
          saldo_final: data.saldo_final || 0,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.warn('Erro ao escutar ciclo mensal:', error);
      callback(null);
    }
  );
}
