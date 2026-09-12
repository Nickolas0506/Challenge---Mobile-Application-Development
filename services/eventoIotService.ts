import type { EventoIot, EventoIotInput } from '../types/models';
import { http } from './http';

export const eventoIotService = {
  listar(_userId: string) {
    return http.getLista<EventoIot>('/api/eventosIot');
  },

  criar(dados: EventoIotInput) {
    return http.post<EventoIot>('/api/eventosIot', dados);
  },

  atualizar(id: string, dados: EventoIotInput) {
    return http.put<EventoIot>(`/api/eventosIot/${id}`, dados);
  },

  remover(id: string) {
    return http.delete(`/api/eventosIot/${id}`);
  },
};
