import type { Checkin } from '../types/models';
import { chaveDia, ehHoje } from './datas';

/**
 * Dias seguidos com check-in. Se hoje ainda nao teve registro,
 * a sequencia conta a partir de ontem (o dia ainda nao acabou).
 */
export function calcularSequencia(datas: string[]) {
  const dias = new Set(datas.map(chaveDia));
  const cursor = new Date();
  if (!dias.has(chaveDia(cursor))) cursor.setDate(cursor.getDate() - 1);

  let sequencia = 0;
  while (dias.has(chaveDia(cursor))) {
    sequencia += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return sequencia;
}

export function fezCheckinHoje(checkins: Checkin[]) {
  return checkins.some((c) => ehHoje(c.data));
}
