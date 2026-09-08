import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../config/firebase';
import { queryClient } from '../config/queryClient';
import { authService, usuarioDeFirebase, type UsuarioAuth } from '../services/authService';

type AuthContextValor = {
  usuario: UsuarioAuth | null;
  carregando: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(usuarioDeFirebase(user));
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  const valor = useMemo<AuthContextValor>(
    () => ({
      usuario,
      carregando,
      async cadastrar(nome, email, senha) {
        await authService.cadastrar(nome, email, senha);
      },
      async entrar(email, senha) {
        await authService.entrar(email, senha);
      },
      async sair() {
        await authService.sair();
        queryClient.clear();
      },
    }),
    [usuario, carregando]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
