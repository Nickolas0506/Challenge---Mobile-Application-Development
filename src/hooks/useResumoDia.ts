import { calcularSequencia, fezCheckinHoje } from '../lib/rotina';
import { useCheckins } from './useCheckins';
import { useEventosIot } from './useEventosIot';
import { usePets } from './usePets';

/** Dados do painel inicial: pet principal, sequencia de check-ins e ultimo evento do sensor. */
export function useResumoDia() {
  const petsQuery = usePets();
  const checkinsQuery = useCheckins();
  const iotQuery = useEventosIot();
  const checkins = checkinsQuery.data ?? [];

  return {
    pet: petsQuery.data?.[0],
    fezHoje: fezCheckinHoje(checkins),
    sequencia: calcularSequencia(checkins.map((c) => c.data)),
    ultimoEventoIot: iotQuery.data?.[0],
    carregando: petsQuery.isLoading || checkinsQuery.isLoading || iotQuery.isLoading,
    erro: petsQuery.isError || checkinsQuery.isError || iotQuery.isError,
    atualizando: petsQuery.isRefetching || checkinsQuery.isRefetching,
    async atualizar() {
      await Promise.all([petsQuery.refetch(), checkinsQuery.refetch(), iotQuery.refetch()]);
    },
  };
}
