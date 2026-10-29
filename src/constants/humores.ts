import type { HumorCheckin } from '../types/models';
import type { Cores } from './cores';

export const HUMORES: { valor: HumorCheckin; emoji: string; label: string; cor: keyof Cores }[] = [
  { valor: 'otimo', emoji: '😄', label: 'Otimo', cor: 'verdeEscuro' },
  { valor: 'bom', emoji: '🙂', label: 'Bom', cor: 'verde' },
  { valor: 'regular', emoji: '😐', label: 'Regular', cor: 'laranja' },
  { valor: 'ruim', emoji: '😟', label: 'Ruim', cor: 'vermelho' },
];

export function rotuloHumor(humor: HumorCheckin) {
  return HUMORES.find((h) => h.valor === humor)?.label ?? humor;
}
