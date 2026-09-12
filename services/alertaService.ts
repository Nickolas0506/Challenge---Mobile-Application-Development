import type { Alerta, AlertaInput } from '../types/models';
import { http } from './http';

export const alertaService = {
  listar(_userId: string) {
    return http.getLista<Alerta>('/api/alertas');
  },

  buscar(id: string) {
    return http.getItem<Alerta>(`/api/alertas/${id}`);
  },

  criar(dados: AlertaInput) {
    return http.post<Alerta>('/api/alertas', dados);
  },

  atualizar(id: string, dados: AlertaInput) {
    return http.put<Alerta>(`/api/alertas/${id}`, dados);
  },

  remover(id: string) {
    return http.delete(`/api/alertas/${id}`);
  },
};
