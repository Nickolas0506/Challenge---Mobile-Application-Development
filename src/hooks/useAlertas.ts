import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { alertaService } from '../services/alertaService';
import { preferenciasService } from '../services/preferenciasService';
import type { Alerta, AlertaInput } from '../types/models';
import { queryKeys } from './queryKeys';

/** A cada minuto o app confere se a API gerou alertas novos (viram notificacao). */
const INTERVALO_MONITORAMENTO_MS = 60_000;

export function useAlertas() {
  const { usuario } = useAuth();
  const userId = usuario?.uid ?? '';

  return useQuery({
    queryKey: queryKeys.alertas(userId),
    queryFn: () => alertaService.listar(userId),
    enabled: !!userId,
    refetchInterval: INTERVALO_MONITORAMENTO_MS,
  });
}

export function useCriarAlerta() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: Omit<AlertaInput, 'userId'>) =>
      alertaService.criar({ ...dados, userId: usuario!.uid }),
    onSuccess: async (criado) => {
      // lembrete criado pelo proprio tutor nao precisa notificar de volta
      await preferenciasService.marcarAlertaNotificado(usuario!.uid, criado.id);
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

/** Marca como lido buscando o alerta atual na API (usado ao tocar na notificacao). */
export function useMarcarAlertaLido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const alerta = await alertaService.buscar(id);
      if (alerta.lido) return alerta;
      return alertaService.atualizar(id, { ...alertaParaInput(alerta), lido: true });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alertas'] });
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
