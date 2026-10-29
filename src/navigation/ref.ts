import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Executa a navegacao assim que o container estiver pronto
 * (a notificacao pode abrir o app antes das rotas montarem).
 */
export function quandoNavegacaoPronta(acao: () => void, tentativas = 50) {
  if (navigationRef.isReady()) {
    acao();
    return;
  }
  if (tentativas > 0) setTimeout(() => quandoNavegacaoPronta(acao, tentativas - 1), 100);
}
