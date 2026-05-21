import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  valor: string;
  descricao: string;
  corFundo: string;
  corIcone: string;
  onPress?: () => void;
};

export function ResumoDiaCard({
  icone,
  titulo,
  valor,
  descricao,
  corFundo,
  corIcone,
  onPress,
}: Props) {
  const conteudo = (
    <>
      <View style={[styles.iconeWrap, { backgroundColor: corIcone + '22' }]}>
        <Ionicons name={icone} size={28} color={corIcone} />
      </View>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.valor}>{valor}</Text>
        <Text style={styles.desc}>{descricao}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={[styles.card, { backgroundColor: corFundo }]} onPress={onPress}>
        {conteudo}
      </Pressable>
    );
  }

  return <View style={[styles.card, { backgroundColor: corFundo }]}>{conteudo}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.raio.md,
    padding: theme.espaco.md,
    marginBottom: theme.espaco.sm,
    ...theme.sombra.card,
  },
  iconeWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.espaco.md,
  },
  textos: { flex: 1 },
  titulo: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.cores.textoClaro,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  valor: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.cores.texto,
    marginTop: 2,
  },
  desc: {
    fontSize: 14,
    color: theme.cores.texto,
    marginTop: 4,
    lineHeight: 20,
  },
});
