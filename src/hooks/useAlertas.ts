import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { alertaService } from '../services/alertaService';
import type { Alerta, AlertaInput } from '../types/models';
import { queryKeys } from './queryKeys';

export function useAlertas() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.alertas(userId),
    queryFn: () => alertaService.listar(userId),
    enabled: !!userId,
  });
}

export function useCriarAlerta() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<AlertaInput, 'userId'>) =>
      alertaService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
}

export function useAtualizarAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: AlertaInput }) =>
      alertaService.atualizar(id, dados),
    onSuccess: (_item, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['alertas'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerta(vars.id) });
    },
  });
}

export function useRemoverAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertaService.remover(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
}

export function alertaParaInput(alerta: Alerta): AlertaInput {
  return {
    userId: alerta.userId,
    titulo: alerta.titulo,
    mensagem: alerta.mensagem,
    tipo: alerta.tipo,
    lido: alerta.lido,
    data: alerta.data,
  };
}
