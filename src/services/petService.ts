import type { Pet, PetInput } from '../types/models';
import { http } from './http';

export const petService = {
  listar(_userId: string) {
    return http.getLista<Pet>('/api/pets');
  },

  buscar(id: string) {
    return http.getItem<Pet>(`/api/pets/${id}`);
  },

  criar(dados: PetInput) {
    return http.post<Pet>('/api/pets', dados);
  },

  atualizar(id: string, dados: PetInput) {
    return http.put<Pet>(`/api/pets/${id}`, dados);
  },

  remover(id: string) {
    return http.delete(`/api/pets/${id}`);
  },
};
