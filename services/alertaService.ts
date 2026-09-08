import type { Alerta, AlertaInput } from '../types/models';
import { http } from './http';

export const alertaService = {
  listar(userId: string) {
    return http.getLista<Alerta>(`/alertas?userId=${encodeURIComponent(userId)}&_sort=data&_order=desc`);
  },

  buscar(id: string) {
    return http.getItem<Alerta>(`/alertas/${id}`);
  },

  criar(dados: AlertaInput) {
    return http.post<Alerta>('/alertas', dados);
  },

  atualizar(id: string, dados: AlertaInput) {
    return http.put<Alerta>(`/alertas/${id}`, { ...dados, id });
  },

  remover(id: string) {
    return http.delete(`/alertas/${id}`);
  },
};
