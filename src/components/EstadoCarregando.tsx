import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  texto?: string;
};

export function EstadoCarregando({ texto = 'Carregando...' }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.box}>
      <ActivityIndicator size="large" color={cores.verde} />
      <Text style={styles.txt}>{texto}</Text>
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    box: { alignItems: 'center', justifyContent: 'center', paddingVertical: theme.espaco.xl },
    txt: { marginTop: 12, color: cores.textoClaro, fontSize: 14 },
  });
