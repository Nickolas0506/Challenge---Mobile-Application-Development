import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  titulo: string;
  subtitulo?: string;
  onVoltarInicio?: () => void;
};

export function CabecalhoTela({ titulo, subtitulo, onVoltarInicio }: Props) {
  return (
    <View style={styles.wrap}>
      {onVoltarInicio ? (
        <Pressable
          style={({ pressed }) => [styles.btnInicio, pressed && styles.btnInicioPressed]}
          onPress={onVoltarInicio}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao inicio"
        >
          <Ionicons name="arrow-back" size={20} color={theme.cores.verde} />
          <Ionicons name="home" size={18} color={theme.cores.verde} />
          <Text style={styles.btnInicioTxt}>Voltar ao Inicio</Text>
        </Pressable>
      ) : null}
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.sub}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.espaco.md,
    paddingTop: theme.espaco.lg,
    paddingBottom: theme.espaco.sm,
    backgroundColor: theme.cores.fundo,
  },
  btnInicio: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: theme.cores.verdeClaro,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.raio.pill,
    marginBottom: theme.espaco.md,
    borderWidth: 1,
    borderColor: theme.cores.borda,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  btnInicioPressed: { opacity: 0.85 },
  btnInicioTxt: { fontSize: 14, fontWeight: '700', color: theme.cores.verdeEscuro },
  titulo: { fontSize: 26, fontWeight: '800', color: theme.cores.texto },
  sub: { fontSize: 14, color: theme.cores.textoClaro, marginTop: 4, lineHeight: 20 },
});
