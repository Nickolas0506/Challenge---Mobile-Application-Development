import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { checkinService } from '../services/checkinService';
import type { CheckinInput } from '../types/models';
import { queryKeys } from './queryKeys';

export function useCheckins() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.checkins(userId),
    queryFn: () => checkinService.listar(userId),
    enabled: !!userId,
  });
}

export function useCheckin(id?: string) {
  return useQuery({
    queryKey: queryKeys.checkin(id ?? ''),
    queryFn: () => checkinService.buscar(id!),
    enabled: !!id,
  });
}

export function useCriarCheckin() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<CheckinInput, 'userId'>) =>
      checkinService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkins'] });
    },
  });
}

export function useAtualizarCheckin() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Omit<CheckinInput, 'userId'> }) =>
      checkinService.atualizar(id, { ...dados, userId: usuario!.uid }),
    onSuccess: (_item, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['checkins'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.checkin(vars.id) });
    },
  });
}

export function useRemoverCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => checkinService.remover(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkins'] });
    },
  });
}
