import AsyncStorage from '@react-native-async-storage/async-storage';

export type PreferenciaTema = 'sistema' | 'claro' | 'escuro';

export type PreferenciaLembrete = {
  ativo: boolean;
  hora: number;
  minuto: number;
};

export const LEMBRETE_PADRAO: PreferenciaLembrete = { ativo: true, hora: 20, minuto: 0 };

const CHAVE_TEMA = '@solin_tema';
const CHAVE_LEMBRETE = '@solin_lembrete_checkin';
const chaveAlertasNotificados = (userId: string) => `@solin_alertas_notificados_${userId}`;

// preferencias locais do aparelho (nao vao para a API)
export const preferenciasService = {
  async lerTema(): Promise<PreferenciaTema> {
    const valor = await AsyncStorage.getItem(CHAVE_TEMA);
    return valor === 'claro' || valor === 'escuro' ? valor : 'sistema';
  },

  async salvarTema(preferencia: PreferenciaTema): Promise<void> {
    await AsyncStorage.setItem(CHAVE_TEMA, preferencia);
  },

  async lerLembrete(): Promise<PreferenciaLembrete> {
    const valor = await AsyncStorage.getItem(CHAVE_LEMBRETE);
    return valor ? { ...LEMBRETE_PADRAO, ...(JSON.parse(valor) as PreferenciaLembrete) } : LEMBRETE_PADRAO;
  },

  async salvarLembrete(preferencia: PreferenciaLembrete): Promise<void> {
    await AsyncStorage.setItem(CHAVE_LEMBRETE, JSON.stringify(preferencia));
  },

  /** Ids de alertas ja notificados neste aparelho; null quando o usuario nunca abriu o app aqui. */
  async lerAlertasNotificados(userId: string): Promise<Set<string> | null> {
    const valor = await AsyncStorage.getItem(chaveAlertasNotificados(userId));
    return valor ? new Set(JSON.parse(valor) as string[]) : null;
  },

  async salvarAlertasNotificados(userId: string, ids: Set<string>): Promise<void> {
    await AsyncStorage.setItem(chaveAlertasNotificados(userId), JSON.stringify([...ids]));
  },

  async marcarAlertaNotificado(userId: string, id: string): Promise<void> {
    const ids = await this.lerAlertasNotificados(userId);
    if (!ids) return; // a primeira sincronizacao ja vai incluir este alerta na base
    ids.add(id);
    await this.salvarAlertasNotificados(userId, ids);
  },
};
