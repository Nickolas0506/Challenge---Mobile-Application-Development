import * as ImagePicker from 'expo-image-picker';

export const galeriaService = {
  /** Abre a galeria com recorte quadrado. Retorna a URI da foto ou null se o tutor cancelar. */
  async escolherFoto(): Promise<string | null> {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      throw new Error('Permissao da galeria negada.');
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    return resultado.canceled ? null : resultado.assets[0].uri;
  },
};
