import type { Passeio, PasseioInput } from '../types/models';
import { http } from './http';

export const passeioService = {
  listar(userId: string) {
    return http.getLista<Passeio>(`/passeios?userId=${encodeURIComponent(userId)}&_sort=data&_order=desc`);
  },

  buscar(id: string) {
    return http.getItem<Passeio>(`/passeios/${id}`);
  },

  criar(dados: PasseioInput) {
    return http.post<Passeio>('/passeios', dados);
  },

  atualizar(id: string, dados: PasseioInput) {
    return http.put<Passeio>(`/passeios/${id}`, { ...dados, id });
  },

  remover(id: string) {
    return http.delete(`/passeios/${id}`);
  },
};
