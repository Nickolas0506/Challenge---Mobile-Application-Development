import type { Passeio, PasseioInput } from '../types/models';
import { http } from './http';

export const passeioService = {
  listar(_userId: string) {
    return http.getLista<Passeio>('/api/passeios');
  },

  buscar(id: string) {
    return http.getItem<Passeio>(`/api/passeios/${id}`);
  },

  criar(dados: PasseioInput) {
    return http.post<Passeio>('/api/passeios', dados);
  },

  atualizar(id: string, dados: PasseioInput) {
    return http.put<Passeio>(`/api/passeios/${id}`, dados);
  },

  remover(id: string) {
    return http.delete(`/api/passeios/${id}`);
  },
};
