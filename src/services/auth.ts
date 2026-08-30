import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { UserProfile } from '../types/user';

/**
 * Mapeia erros do Firebase Auth para mensagens amigáveis em Português
 */
export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'O formato do e-mail informado é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta de usuário foi desativada.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado em outra conta.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua internet.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
    default:
      return 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}

/**
 * Autentica usuário com e-mail e senha
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

/**
 * Cria uma nova conta com e-mail, senha e nome do usuário
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const user = credential.user;

  if (displayName.trim()) {
    await updateProfile(user, { displayName: displayName.trim() });
  }

  // Cria documento inicial do usuário em users/{userId}
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingDoc = await getDoc(userDocRef);

    if (!existingDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || user.displayName || 'Usuário',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('Erro ao criar perfil de usuário no Firestore:', error);
  }

  return user;
}

/**
 * Realiza o encerramento da sessão (Logout)
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Inscreve observador de mudança de estado de autenticação
 */
export function subscribeAuthState(callback: (user: UserProfile | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } else {
      callback(null);
    }
  });
}
