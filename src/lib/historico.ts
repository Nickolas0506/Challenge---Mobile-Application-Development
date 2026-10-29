import { rotuloHumor } from '../constants/humores';
import type { Checkin, EventoIot, Passeio, Pet } from '../types/models';
import { descreverPet } from './pet';
import { resumoUrina } from './passeio';

export type TipoItemHistorico = 'pet' | 'checkin' | 'passeio' | 'iot';

export type ItemHistorico = {
  tipo: TipoItemHistorico;
  id: string;
  data: string;
  titulo: string;
  detalhe: string;
};

type Fontes = {
  pets?: Pet[];
  checkins?: Checkin[];
  passeios?: Passeio[];
  eventosIot?: EventoIot[];
};

/** Junta todos os registros da API numa linha do tempo, do mais novo para o mais antigo. */
export function montarHistorico({ pets = [], checkins = [], passeios = [], eventosIot = [] }: Fontes) {
  const itens: ItemHistorico[] = [
    ...pets.map((p) => ({
      tipo: 'pet' as const,
      id: p.id,
      data: p.createdAt ?? new Date().toISOString(),
      titulo: p.nome,
      detalhe: descreverPet(p),
    })),
    ...checkins.map((c) => ({
      tipo: 'checkin' as const,
      id: c.id,
      data: c.data,
      titulo: 'Check-in',
      detalhe: `Humor: ${rotuloHumor(c.humor)}${c.observacao ? ` — ${c.observacao}` : ''}`,
    })),
    ...passeios.map((p) => ({
      tipo: 'passeio' as const,
      id: p.id,
      data: p.data,
      titulo: 'Passeio',
      detalhe: `${p.duracaoMin} min · Agua: ${p.bebeuAgua ? 'sim' : 'nao'} · ${resumoUrina(p)}`,
    })),
    ...eventosIot.map((e) => ({
      tipo: 'iot' as const,
      id: e.id,
      data: e.data,
      titulo: 'Sensor',
      detalhe: e.mensagem,
    })),
  ];

  return itens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}
