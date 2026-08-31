import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';
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
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação do Google foi fechada antes de concluir.';
    case 'auth/cancelled-popup-request':
      return 'Solicitação de login com Google cancelada.';
    case 'auth/popup-blocked':
      return 'A janela popup foi bloqueada pelo navegador. Permita popups para continuar.';
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
  await ensureUserProfileExists(user, displayName.trim());

  return user;
}

/**
 * Autentica ou cria conta de usuário com o Google
 */
export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  if (Platform.OS === 'web') {
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    // Inicializa perfil do usuário no Firestore se for o primeiro acesso
    await ensureUserProfileExists(user, user.displayName || '');

    return user;
  } else {
    // Fallback nativo
    const credential = await signInWithPopup(auth, provider);
    await ensureUserProfileExists(credential.user, credential.user.displayName || '');
    return credential.user;
  }
}

/**
 * Garante que o documento users/{userId} exista no Firestore
 */
async function ensureUserProfileExists(user: User, customDisplayName?: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingDoc = await getDoc(userDocRef);

    if (!existingDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: customDisplayName || user.displayName || 'Usuário',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('Erro ao verificar/criar perfil de usuário no Firestore:', error);
  }
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
