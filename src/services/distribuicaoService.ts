import type { VersaoDistribuida } from '../types/models';
import { ApiError, http } from './http';

export const distribuicaoService = {
  /** Ultimo APK publicado para os testadores; null se ainda nao houver nenhum. */
  async ultimaVersao(): Promise<VersaoDistribuida | null> {
    try {
      return await http.get<VersaoDistribuida>('/distribuicao/ultima');
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 404) return null;
      throw erro;
    }
  },
};
