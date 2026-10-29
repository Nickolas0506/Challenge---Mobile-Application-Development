import AsyncStorage from '@react-native-async-storage/async-storage';

export type PreferenciaTema = 'sistema' | 'claro' | 'escuro';

const CHAVE_TEMA = '@solin_tema';

// preferencias locais do aparelho (nao vao para a API)
export const preferenciasService = {
  async lerTema(): Promise<PreferenciaTema> {
    const valor = await AsyncStorage.getItem(CHAVE_TEMA);
    return valor === 'claro' || valor === 'escuro' ? valor : 'sistema';
  },

  async salvarTema(preferencia: PreferenciaTema): Promise<void> {
    await AsyncStorage.setItem(CHAVE_TEMA, preferencia);
  },
};
