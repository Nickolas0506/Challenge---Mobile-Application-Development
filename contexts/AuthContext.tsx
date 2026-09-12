import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { queryClient } from '../config/queryClient';
import { authService, type UsuarioAuth } from '../services/authService';
import { carregarSessao, limparSessao } from '../services/session';

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
    void (async () => {
      const salva = await carregarSessao();
      if (!salva) {
        setCarregando(false);
        return;
      }
      const atual = await authService.sessaoAtual();
      setUsuario(atual);
      setCarregando(false);
    })();
  }, []);

  const valor = useMemo<AuthContextValor>(
    () => ({
      usuario,
      carregando,
      async cadastrar(nome, email, senha) {
        const criado = await authService.cadastrar(nome, email, senha);
        setUsuario(criado);
      },
      async entrar(email, senha) {
        const logado = await authService.entrar(email, senha);
        setUsuario(logado);
      },
      async sair() {
        await authService.sair();
        await limparSessao();
        setUsuario(null);
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
