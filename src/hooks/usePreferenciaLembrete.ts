import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { preferenciasService, type PreferenciaLembrete } from '../services/preferenciasService';

const CHAVE = ['preferencias', 'lembreteCheckin'] as const;

export function usePreferenciaLembrete() {
  return useQuery({ queryKey: CHAVE, queryFn: () => preferenciasService.lerLembrete() });
}

export function useSalvarPreferenciaLembrete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferencia: PreferenciaLembrete) => preferenciasService.salvarLembrete(preferencia),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHAVE });
    },
  });
}
