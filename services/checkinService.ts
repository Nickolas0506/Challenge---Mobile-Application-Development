import type { Checkin, CheckinInput } from '../types/models';
import { http } from './http';

export const checkinService = {
  listar(_userId: string) {
    return http.getLista<Checkin>('/api/checkins');
  },

  buscar(id: string) {
    return http.getItem<Checkin>(`/api/checkins/${id}`);
  },

  criar(dados: CheckinInput) {
    return http.post<Checkin>('/api/checkins', dados);
  },

  atualizar(id: string, dados: CheckinInput) {
    return http.put<Checkin>(`/api/checkins/${id}`, dados);
  },

  remover(id: string) {
    return http.delete(`/api/checkins/${id}`);
  },
};
