import AsyncStorage from '@react-native-async-storage/async-storage';

// chaves usadas no asyncstorage
const CHAVES = {
  logado: '@solin_logado',
  tutor: '@solin_tutor',
  pet: '@solin_pet',
  checkins: '@solin_checkins',
  passeios: '@solin_passeios',
  eventosIot: '@solin_eventos_iot',
  alertas: '@solin_alertas',
  streak: '@solin_streak',
  ultimoCheckinDia: '@solin_ultimo_dia_checkin',
  historicoPet: '@solin_historico_pet',
};

export type HumorCheckin = 'otimo' | 'bom' | 'regular' | 'ruim';

export interface Tutor {
  nome: string;
  email: string;
}

export interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  peso: string;
  idade?: string;
  caracteristicas?: string;
  foto?: string;
}

export interface Checkin {
  id: string;
  data: string;
  humor: HumorCheckin;
  observacao?: string;
}

export interface Passeio {
  id: string;
  data: string;
  duracaoMin: string;
  bebeuAgua: boolean;
  urinou: boolean;
  urinaNormal: boolean;
  fezesNormais: boolean;
  comportamentoNormal: boolean;
  observacao: string;
}

export interface EventoIot {
  id: string;
  data: string;
  tipo: 'uso_normal' | 'sem_uso' | 'uso_excessivo';
  mensagem: string;
}

export interface Alerta {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'checkin' | 'iot' | 'vacina' | 'passeio';
  lido: boolean;
  data: string;
}

export interface Streak {
  dias: number;
  ultimaData: string;
}

export interface RegistroPetHistorico {
  id: string;
  data: string;
  acao: 'cadastro' | 'edicao';
  nomePet: string;
  detalhe: string;
}

async function salvarJson<T>(chave: string, valor: T) {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

async function lerJson<T>(chave: string, padrao: T): Promise<T> {
  const raw = await AsyncStorage.getItem(chave);
  if (!raw) return padrao;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return padrao;
  }
}

export const Storage = {
  async setLogado(v: boolean) {
    await AsyncStorage.setItem(CHAVES.logado, v ? 'sim' : 'nao');
  },
  async isLogado() {
    return (await AsyncStorage.getItem(CHAVES.logado)) === 'sim';
  },

  /** Encerra só a sessão (login); mantém pet, check-ins etc. */
  async encerrarSessao() {
    await AsyncStorage.setItem(CHAVES.logado, 'nao');
  },

  async getTutor() {
    return lerJson<Tutor | null>(CHAVES.tutor, null);
  },
  async setTutor(tutor: Tutor) {
    await salvarJson(CHAVES.tutor, tutor);
  },

  async getPet() {
    return lerJson<Pet | null>(CHAVES.pet, null);
  },
  async setPet(pet: Pet) {
    const limpo: Pet = {
      id: pet.id,
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      peso: pet.peso,
      ...(pet.idade ? { idade: pet.idade } : {}),
      ...(pet.caracteristicas ? { caracteristicas: pet.caracteristicas } : {}),
      ...(pet.foto ? { foto: pet.foto } : {}),
    };
    await salvarJson(CHAVES.pet, limpo);
  },

  async getRegistrosPetHistorico() {
    return lerJson<RegistroPetHistorico[]>(CHAVES.historicoPet, []);
  },
  async addRegistroPetHistorico(registro: RegistroPetHistorico) {
    const lista = await this.getRegistrosPetHistorico();
    lista.unshift(registro);
    await salvarJson(CHAVES.historicoPet, lista);
  },

  async getCheckins() {
    return lerJson<Checkin[]>(CHAVES.checkins, []);
  },
  async setCheckins(checkins: Checkin[]) {
    await salvarJson(CHAVES.checkins, checkins);
  },
  async addCheckin(checkin: Checkin) {
    const lista = await this.getCheckins();
    lista.unshift(checkin);
    await salvarJson(CHAVES.checkins, lista);
  },

  async getPasseios() {
    return lerJson<Passeio[]>(CHAVES.passeios, []);
  },
  async setPasseios(passeios: Passeio[]) {
    await salvarJson(CHAVES.passeios, passeios);
  },
  async addPasseio(passeio: Passeio) {
    const lista = await this.getPasseios();
    lista.unshift(passeio);
    await salvarJson(CHAVES.passeios, lista);
  },

  async getEventosIot() {
    return lerJson<EventoIot[]>(CHAVES.eventosIot, []);
  },
  async setEventosIot(eventos: EventoIot[]) {
    await salvarJson(CHAVES.eventosIot, eventos);
  },

  async getAlertas() {
    return lerJson<Alerta[]>(CHAVES.alertas, []);
  },
  async setAlertas(alertas: Alerta[]) {
    await salvarJson(CHAVES.alertas, alertas);
  },

  async getStreak() {
    return lerJson<Streak>(CHAVES.streak, { dias: 0, ultimaData: '' });
  },
  async setStreak(streak: Streak) {
    await salvarJson(CHAVES.streak, streak);
  },
  async atualizarStreak() {
    const hoje = new Date().toISOString().split('T')[0];
    const streak = await this.getStreak();

    if (streak.ultimaData === hoje) {
      return streak;
    }

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().split('T')[0];

    let dias = 1;
    if (streak.ultimaData === dataOntem) {
      dias = streak.dias + 1;
    }

    const novo = { dias, ultimaData: hoje };
    await salvarJson(CHAVES.streak, novo);
    await AsyncStorage.setItem(CHAVES.ultimoCheckinDia, hoje);
    return novo;
  },

  async fezCheckinHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    const ultimo = await AsyncStorage.getItem(CHAVES.ultimoCheckinDia);
    return ultimo === hoje;
  },

  async logout() {
    await this.encerrarSessao();
    await AsyncStorage.removeItem(CHAVES.tutor);
  },
};
