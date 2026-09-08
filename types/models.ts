export type HumorCheckin = 'otimo' | 'bom' | 'regular' | 'ruim';

export type TipoAlerta = 'checkin' | 'iot' | 'vacina' | 'passeio';

export type TipoEventoIot = 'uso_normal' | 'sem_uso' | 'uso_excessivo';

export interface Pet {
  id: string;
  userId: string;
  nome: string;
  especie: string;
  raca: string;
  peso: string;
  idade?: string;
  caracteristicas?: string;
  foto?: string;
  createdAt?: string;
}

export type PetInput = Omit<Pet, 'id'>;

export interface Checkin {
  id: string;
  userId: string;
  petId?: string;
  data: string;
  humor: HumorCheckin;
  observacao?: string;
}

export type CheckinInput = Omit<Checkin, 'id'>;

export interface Passeio {
  id: string;
  userId: string;
  petId?: string;
  data: string;
  duracaoMin: string;
  bebeuAgua: boolean;
  urinou: boolean;
  urinaNormal: boolean;
  fezesNormais: boolean;
  comportamentoNormal: boolean;
  observacao: string;
}

export type PasseioInput = Omit<Passeio, 'id'>;

export interface Alerta {
  id: string;
  userId: string;
  titulo: string;
  mensagem: string;
  tipo: TipoAlerta;
  lido: boolean;
  data: string;
}

export type AlertaInput = Omit<Alerta, 'id'>;

export interface EventoIot {
  id: string;
  userId: string;
  data: string;
  tipo: TipoEventoIot;
  mensagem: string;
}

export type EventoIotInput = Omit<EventoIot, 'id'>;
