import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  titulo: string;
  dica?: string;
};

export function TituloSecao({ titulo, dica }: Props) {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.wrap}>
      <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
      {dica ? <Text style={styles.dica}>{dica}</Text> : null}
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    wrap: { marginBottom: theme.espaco.sm, marginTop: theme.espaco.md },
    titulo: { fontSize: 13, fontWeight: '700', color: cores.textoClaro, letterSpacing: 0.5 },
    dica: { fontSize: 13, color: cores.textoClaro, marginTop: 2 },
  });
