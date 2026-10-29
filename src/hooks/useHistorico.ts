import { montarHistorico } from '../lib/historico';
import { useCheckins } from './useCheckins';
import { useEventosIot } from './useEventosIot';
import { usePasseios } from './usePasseios';
import { usePets } from './usePets';

/** Linha do tempo unificada (pets, check-ins, passeios e sensor) vinda da API. */
export function useHistorico() {
  const consultas = [usePets(), useCheckins(), usePasseios(), useEventosIot()] as const;
  const [pets, checkins, passeios, eventosIot] = consultas;

  return {
    itens: montarHistorico({
      pets: pets.data,
      checkins: checkins.data,
      passeios: passeios.data,
      eventosIot: eventosIot.data,
    }),
    carregando: consultas.some((c) => c.isLoading),
    erro: consultas.some((c) => c.isError),
    atualizando: consultas.some((c) => c.isRefetching),
    async atualizar() {
      await Promise.all(consultas.map((c) => c.refetch()));
    },
  };
}
