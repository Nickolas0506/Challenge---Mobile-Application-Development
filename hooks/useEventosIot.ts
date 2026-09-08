import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { eventoIotService } from '../services/eventoIotService';
import type { EventoIotInput } from '../types/models';
import { queryKeys } from './queryKeys';

export function useEventosIot() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.eventosIot(userId),
    queryFn: () => eventoIotService.listar(userId),
    enabled: !!userId,
  });
}

export function useCriarEventoIot() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<EventoIotInput, 'userId'>) =>
      eventoIotService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['eventosIot'] });
    },
  });
}

export function useRemoverEventoIot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventoIotService.remover(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['eventosIot'] });
    },
  });
}
