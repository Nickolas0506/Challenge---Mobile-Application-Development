import { getApiUrl } from '../config/api';
import { obterToken } from './session';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function cabecalhos(json = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = obterToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function tratarResposta<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const texto = await res.text();
  const corpo = texto ? (JSON.parse(texto) as { mensagem?: string }) : null;
  if (!res.ok) {
    throw new ApiError(corpo?.mensagem || `Falha na API (${res.status})`, res.status);
  }
  return corpo as T;
}

function comId<T extends { id?: string | number }>(item: T): T & { id: string } {
  return { ...item, id: String(item.id) };
}

export const http = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${getApiUrl()}${path}`, { headers: cabecalhos() });
    return tratarResposta<T>(res);
  },

  async getLista<T extends { id?: string | number }>(path: string): Promise<Array<T & { id: string }>> {
    const lista = await this.get<T[]>(path);
    return (lista ?? []).map(comId);
  },

  async getItem<T extends { id?: string | number }>(path: string): Promise<T & { id: string }> {
    const item = await this.get<T>(path);
    return comId(item);
  },

  async post<T extends { id?: string | number }>(path: string, body: unknown): Promise<T & { id: string }> {
    const res = await fetch(`${getApiUrl()}${path}`, {
      method: 'POST',
      headers: cabecalhos(true),
      body: JSON.stringify(body),
    });
    const item = await tratarResposta<T>(res);
    return comId(item);
  },

  async put<T extends { id?: string | number }>(path: string, body: unknown): Promise<T & { id: string }> {
    const res = await fetch(`${getApiUrl()}${path}`, {
      method: 'PUT',
      headers: cabecalhos(true),
      body: JSON.stringify(body),
    });
    const item = await tratarResposta<T>(res);
    return comId(item);
  },

  async delete(path: string): Promise<void> {
    const res = await fetch(`${getApiUrl()}${path}`, { method: 'DELETE', headers: cabecalhos() });
    await tratarResposta<void>(res);
  },
};
