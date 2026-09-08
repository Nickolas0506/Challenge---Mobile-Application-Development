import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export type UsuarioAuth = {
  uid: string;
  nome: string;
  email: string;
};

export function usuarioDeFirebase(user: User | null): UsuarioAuth | null {
  if (!user) return null;
  return {
    uid: user.uid,
    nome: user.displayName?.trim() || user.email?.split('@')[0] || 'Tutor',
    email: user.email ?? '',
  };
}

function mensagemFirebase(erro: unknown): string {
  const codigo = typeof erro === 'object' && erro && 'code' in erro ? String(erro.code) : '';
  switch (codigo) {
    case 'auth/email-already-in-use':
      return 'Este e-mail ja possui uma conta.';
    case 'auth/invalid-email':
      return 'E-mail invalido.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um momento e tente de novo.';
    case 'auth/network-request-failed':
      return 'Sem conexao. Verifique a internet e tente novamente.';
    case 'auth/operation-not-allowed':
      return 'Login por e-mail nao esta habilitado no Firebase.';
    default:
      return erro instanceof Error ? erro.message : 'Nao foi possivel autenticar.';
  }
}

export const authService = {
  async cadastrar(nome: string, email: string, senha: string): Promise<UsuarioAuth> {
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(credencial.user, { displayName: nome });
      const usuario = usuarioDeFirebase(credencial.user);
      if (!usuario) throw new Error('Falha ao criar usuario.');
      return { ...usuario, nome };
    } catch (erro) {
      throw new Error(mensagemFirebase(erro));
    }
  },

  async entrar(email: string, senha: string): Promise<UsuarioAuth> {
    try {
      const credencial = await signInWithEmailAndPassword(auth, email, senha);
      const usuario = usuarioDeFirebase(credencial.user);
      if (!usuario) throw new Error('Falha ao entrar.');
      return usuario;
    } catch (erro) {
      throw new Error(mensagemFirebase(erro));
    }
  },

  async sair(): Promise<void> {
    await signOut(auth);
  },
};
