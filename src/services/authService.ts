import { getApiUrl } from '../config/api';
import { ApiError } from './http';
import { guardarSessao, limparSessao, obterToken } from './session';

export type UsuarioAuth = {
  uid: string;
  nome: string;
  email: string;
};

type AuthResposta = {
  token: string;
  uid: string;
  nome: string;
  email: string;
  mensagem?: string;
};

function paraUsuario(data: AuthResposta): UsuarioAuth {
  return {
    uid: String(data.uid),
    nome: data.nome?.trim() || data.email?.split('@')[0] || 'Tutor',
    email: data.email ?? '',
  };
}

async function chamarAuth(rota: string, corpo?: Record<string, unknown>): Promise<AuthResposta> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = obterToken();
  if (token && !corpo) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiUrl()}${rota}`, {
    method: corpo ? 'POST' : 'GET',
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const data = (await res.json()) as AuthResposta;
  if (!res.ok) {
    throw new ApiError(data.mensagem || `Falha na autenticacao (${res.status})`, res.status);
  }
  return data;
}

export const authService = {
  async cadastrar(nome: string, email: string, senha: string): Promise<UsuarioAuth> {
    const data = await chamarAuth('/api/auth/cadastrar', { nome, email, senha });
    const usuario = paraUsuario(data);
    await guardarSessao(data.token, JSON.stringify(usuario));
    return usuario;
  },

  async entrar(email: string, senha: string): Promise<UsuarioAuth> {
    const data = await chamarAuth('/api/auth/login', { email, senha });
    const usuario = paraUsuario(data);
    await guardarSessao(data.token, JSON.stringify(usuario));
    return usuario;
  },

  async sessaoAtual(): Promise<UsuarioAuth | null> {
    if (!obterToken()) return null;
    try {
      const data = await chamarAuth('/api/auth/me');
      const usuario = paraUsuario(data);
      await guardarSessao(data.token, JSON.stringify(usuario));
      return usuario;
    } catch {
      await limparSessao();
      return null;
    }
  },

  async sair(): Promise<void> {
    await limparSessao();
  },
};
