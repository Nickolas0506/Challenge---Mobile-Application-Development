import type { EventoIot, EventoIotInput } from '../types/models';
import { http } from './http';

export const eventoIotService = {
  listar(userId: string) {
    return http.getLista<EventoIot>(`/eventosIot?userId=${encodeURIComponent(userId)}&_sort=data&_order=desc`);
  },

  criar(dados: EventoIotInput) {
    return http.post<EventoIot>('/eventosIot', dados);
  },

  atualizar(id: string, dados: EventoIotInput) {
    return http.put<EventoIot>(`/eventosIot/${id}`, { ...dados, id });
  },

  remover(id: string) {
    return http.delete(`/eventosIot/${id}`);
  },
};
