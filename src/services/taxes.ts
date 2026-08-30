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
import { AnnualTax } from '../types/finance';

/**
 * Retorna a referência da coleção de tributos e parcelas do usuário
 */
export function getTaxesCollectionRef(userId: string): CollectionReference {
  return collection(db, 'users', userId, 'tributos_e_parcelas');
}

/**
 * Cadastra um novo tributo ou conta anual parcelada
 */
export async function createTax(
  userId: string,
  tax: Omit<AnnualTax, 'id'>
): Promise<string> {
  const colRef = getTaxesCollectionRef(userId);
  const docRef = await addDoc(colRef, {
    titulo: tax.titulo.trim(),
    data_vencimento: tax.data_vencimento || '',
    valor_orcado: Number(tax.valor_orcado) || 0,
    valor_pago: Number(tax.valor_pago) || 0,
    status: tax.status || 'Pendente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Atualiza um tributo existente
 */
export async function updateTax(
  userId: string,
  taxId: string,
  data: Partial<AnnualTax>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'tributos_e_parcelas', taxId);
  const updatePayload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (data.titulo !== undefined) updatePayload.titulo = data.titulo.trim();
  if (data.data_vencimento !== undefined) updatePayload.data_vencimento = data.data_vencimento;
  if (data.valor_orcado !== undefined) updatePayload.valor_orcado = Number(data.valor_orcado);
  if (data.valor_pago !== undefined) updatePayload.valor_pago = Number(data.valor_pago);
  if (data.status !== undefined) updatePayload.status = data.status;

  await updateDoc(docRef, updatePayload);
}

/**
 * Remove um tributo cadastrado
 */
export async function deleteTax(userId: string, taxId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'tributos_e_parcelas', taxId);
  await deleteDoc(docRef);
}

/**
 * Escuta os tributos e parcelamentos em tempo real
 */
export function subscribeTaxes(
  userId: string,
  callback: (taxes: AnnualTax[]) => void
): () => void {
  const colRef = getTaxesCollectionRef(userId);
  const q = query(colRef, orderBy('data_vencimento', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const taxes: AnnualTax[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          titulo: data.titulo || '',
          data_vencimento: data.data_vencimento || '',
          valor_orcado: data.valor_orcado || 0,
          valor_pago: data.valor_pago || 0,
          status: data.status || 'Pendente',
        };
      });
      callback(taxes);
    },
    (error) => {
      console.warn('Erro ao escutar tributos:', error);
      callback([]);
    }
  );
}
