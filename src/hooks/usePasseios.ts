import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { passeioService } from '../services/passeioService';
import type { PasseioInput } from '../types/models';
import { queryKeys } from './queryKeys';

export function usePasseios() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.passeios(userId),
    queryFn: () => passeioService.listar(userId),
    enabled: !!userId,
  });
}

export function usePasseio(id?: string) {
  return useQuery({
    queryKey: queryKeys.passeio(id ?? ''),
    queryFn: () => passeioService.buscar(id!),
    enabled: !!id,
  });
}

export function useCriarPasseio() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<PasseioInput, 'userId'>) =>
      passeioService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['passeios'] });
    },
  });
}

export function useAtualizarPasseio() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Omit<PasseioInput, 'userId'> }) =>
      passeioService.atualizar(id, { ...dados, userId: usuario!.uid }),
    onSuccess: (_item, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['passeios'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.passeio(vars.id) });
    },
  });
}

export function useRemoverPasseio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => passeioService.remover(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['passeios'] });
    },
  });
}
