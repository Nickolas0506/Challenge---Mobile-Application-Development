import { useQuery } from '@tanstack/react-query';
import { versaoApp } from '../config/versao';
import { distribuicaoService } from '../services/distribuicaoService';
import { queryKeys } from './queryKeys';

/** Compara o commit deste build com o ultimo APK distribuido aos testadores. */
export function useVersaoDistribuida() {
  const query = useQuery({
    queryKey: queryKeys.versaoDistribuida,
    queryFn: () => distribuicaoService.ultimaVersao(),
  });
  const ultima = query.data;

  return {
    ...query,
    ultima,
    atualizado: !!ultima && ultima.commit === versaoApp.commit,
  };
}
