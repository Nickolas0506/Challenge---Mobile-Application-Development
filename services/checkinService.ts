import type { Checkin, CheckinInput } from '../types/models';
import { http } from './http';

export const checkinService = {
  listar(userId: string) {
    return http.getLista<Checkin>(`/checkins?userId=${encodeURIComponent(userId)}&_sort=data&_order=desc`);
  },

  buscar(id: string) {
    return http.getItem<Checkin>(`/checkins/${id}`);
  },

  criar(dados: CheckinInput) {
    return http.post<Checkin>('/checkins', dados);
  },

  atualizar(id: string, dados: CheckinInput) {
    return http.put<Checkin>(`/checkins/${id}`, { ...dados, id });
  },

  remover(id: string) {
    return http.delete(`/checkins/${id}`);
  },
};
