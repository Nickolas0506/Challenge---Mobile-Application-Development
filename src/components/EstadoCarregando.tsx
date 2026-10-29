import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  texto?: string;
};

export function EstadoCarregando({ texto = 'Carregando...' }: Props) {
  return (
    <View style={styles.box}>
      <ActivityIndicator size="large" color={theme.cores.verde} />
      <Text style={styles.txt}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', paddingVertical: theme.espaco.xl },
  txt: { marginTop: 12, color: theme.cores.textoClaro, fontSize: 14 },
});
