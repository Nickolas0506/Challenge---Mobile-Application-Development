import type { Alerta } from '../types/models';

/**
 * Alertas que ainda precisam virar notificacao: nao lidos e nunca notificados.
 * Na primeira vez no aparelho (`jaNotificados` null) nada e notificado — so marca a base,
 * para o tutor nao receber de uma vez todos os alertas antigos.
 */
export function alertasParaNotificar(alertas: Alerta[], jaNotificados: Set<string> | null) {
  if (!jaNotificados) return [];
  return alertas.filter((a) => !a.lido && !jaNotificados.has(a.id));
}

export function contarNaoLidos(alertas: Alerta[] | undefined) {
  return (alertas ?? []).filter((a) => !a.lido).length;
}
