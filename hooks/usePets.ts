import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { petService } from '../services/petService';
import type { PetInput } from '../types/models';
import { queryKeys } from './queryKeys';

export function usePets() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.pets(userId),
    queryFn: () => petService.listar(userId),
    enabled: !!userId,
  });
}

export function usePet(id?: string) {
  return useQuery({
    queryKey: queryKeys.pet(id ?? ''),
    queryFn: () => petService.buscar(id!),
    enabled: !!id,
  });
}

export function useCriarPet() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<PetInput, 'userId'>) =>
      petService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useAtualizarPet() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Omit<PetInput, 'userId'> }) =>
      petService.atualizar(id, { ...dados, userId: usuario!.uid }),
    onSuccess: (_pet, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.pet(vars.id) });
    },
  });
}

export function useRemoverPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => petService.remover(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
