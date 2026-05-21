import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  titulo: string;
  dica?: string;
};

export function TituloSecao({ titulo, dica }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.titulo}>{titulo.toUpperCase()}</Text>
      {dica ? <Text style={styles.dica}>{dica}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: theme.espaco.sm, marginTop: theme.espaco.md },
  titulo: theme.fonte.secao,
  dica: { fontSize: 13, color: theme.cores.textoClaro, marginTop: 2 },
});
