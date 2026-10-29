import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  titulo: string;
  subtitulo?: string;
  onVoltarInicio?: () => void;
};

export function CabecalhoTela({ titulo, subtitulo, onVoltarInicio }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + theme.espaco.sm }]}>
      {onVoltarInicio ? (
        <Pressable
          style={({ pressed }) => [styles.btnInicio, pressed && styles.btnInicioPressed]}
          onPress={onVoltarInicio}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao inicio"
        >
          <Ionicons name="arrow-back" size={20} color={cores.verde} />
          <Ionicons name="home" size={18} color={cores.verde} />
          <Text style={styles.btnInicioTxt}>Voltar ao Inicio</Text>
        </Pressable>
      ) : null}
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.sub}>{subtitulo}</Text> : null}
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    wrap: {
      paddingHorizontal: theme.espaco.md,
      paddingBottom: theme.espaco.sm,
      backgroundColor: cores.fundo,
    },
    btnInicio: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      backgroundColor: cores.verdeClaro,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: theme.raio.pill,
      marginBottom: theme.espaco.md,
      borderWidth: 1,
      borderColor: cores.borda,
      ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
    },
    btnInicioPressed: { opacity: 0.85 },
    btnInicioTxt: { fontSize: 14, fontWeight: '700', color: cores.verdeEscuro },
    titulo: { fontSize: 24, fontWeight: '800', color: cores.texto },
    sub: { fontSize: 14, color: cores.textoClaro, marginTop: 4, lineHeight: 20 },
  });
