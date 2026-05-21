import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function AvisoPlataformaWeb() {
  return (
    <View style={styles.root}>
      <Text style={styles.marca}>SOLIN</Text>
      <Text style={styles.titulo}>Use no celular ou emulador</Text>
      <Text style={styles.txt}>
        Este app foi feito para React Native no Expo Go. A entrega do sprint exige
        demonstração em dispositivo ou emulador — não no navegador (Expo Web).
      </Text>
      <Text style={styles.txt}>
        No computador, execute npm start e escaneie o QR code com o Expo Go no
        Android ou com a Câmera no iPhone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.espaco.lg,
    backgroundColor: theme.cores.fundo,
  },
  marca: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.cores.verde,
    letterSpacing: 2,
    marginBottom: theme.espaco.md,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.cores.texto,
    marginBottom: theme.espaco.sm,
  },
  txt: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.cores.textoClaro,
    marginBottom: theme.espaco.md,
  },
});
