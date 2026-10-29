import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  texto: string;
  onPress: () => void | Promise<void>;
  carregando?: boolean;
  secundario?: boolean;
  perigo?: boolean;
};

export function Botao({ texto, onPress, carregando, secundario, perigo }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        secundario && styles.btnSec,
        perigo && styles.btnPerigo,
        carregando && styles.btnDisabled,
        Platform.OS === 'web' && styles.btnWeb,
      ]}
      onPress={() => {
        if (!carregando) void onPress();
      }}
      disabled={carregando}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? cores.verde : '#fff'} />
      ) : (
        <Text style={[styles.txt, secundario && styles.txtSec, perigo && styles.txtPerigo]}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    btn: {
      backgroundColor: cores.verde,
      paddingVertical: 16,
      borderRadius: theme.raio.md,
      alignItems: 'center',
      marginTop: theme.espaco.sm,
      minHeight: 52,
      justifyContent: 'center',
      zIndex: 10,
      ...theme.sombra.card,
    },
    btnSec: {
      backgroundColor: cores.superficie,
      borderWidth: 1.5,
      borderColor: cores.borda,
      shadowOpacity: 0,
      elevation: 0,
    },
    btnPerigo: {
      backgroundColor: cores.superficie,
      borderWidth: 1.5,
      borderColor: cores.vermelho,
      shadowOpacity: 0,
      elevation: 0,
    },
    txtPerigo: { color: cores.vermelho },
    btnDisabled: { opacity: 0.7 },
    btnWeb: { cursor: 'pointer' as const },
    txt: { color: '#fff', fontWeight: '700', fontSize: 16 },
    txtSec: { color: cores.verde },
  });
