import type { Pet, PetInput } from '../types/models';
import { http } from './http';

export const petService = {
  listar(userId: string) {
    return http.getLista<Pet>(`/pets?userId=${encodeURIComponent(userId)}&_sort=id&_order=desc`);
  },

  buscar(id: string) {
    return http.getItem<Pet>(`/pets/${id}`);
  },

  criar(dados: PetInput) {
    return http.post<Pet>('/pets', dados);
  },

  atualizar(id: string, dados: PetInput) {
    return http.put<Pet>(`/pets/${id}`, { ...dados, id });
  },

  remover(id: string) {
    return http.delete(`/pets/${id}`);
  },
};
