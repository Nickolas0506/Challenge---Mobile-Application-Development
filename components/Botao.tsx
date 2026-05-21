import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  texto: string;
  onPress: () => void | Promise<void>;
  carregando?: boolean;
  secundario?: boolean;
};

export function Botao({ texto, onPress, carregando, secundario }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        secundario && styles.btnSec,
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
        <ActivityIndicator color={secundario ? theme.cores.verde : '#fff'} />
      ) : (
        <Text style={[styles.txt, secundario && styles.txtSec]}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: theme.cores.verde,
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
    backgroundColor: theme.cores.branco,
    borderWidth: 1.5,
    borderColor: theme.cores.borda,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnDisabled: { opacity: 0.7 },
  btnWeb: { cursor: 'pointer' as const },
  txt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  txtSec: { color: theme.cores.verde },
});
