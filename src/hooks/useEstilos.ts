import { useMemo } from 'react';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';

/** Gera os estilos da tela com a paleta do tema atual (claro ou escuro). */
export function useEstilos<T>(criarEstilos: (cores: Cores) => T): T {
  const { cores } = useTema();
  return useMemo(() => criarEstilos(cores), [cores, criarEstilos]);
}
