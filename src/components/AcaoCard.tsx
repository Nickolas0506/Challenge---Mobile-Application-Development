import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  principal?: boolean;
};

export function AcaoCard({ titulo, descricao, icone, onPress, principal }: Props) {
  return (
    <Pressable
      style={[styles.card, principal && styles.principal]}
      onPress={onPress}
    >
      <View style={[styles.iconeBox, principal && styles.iconeBoxPrincipal]}>
        <Ionicons name={icone} size={24} color={principal ? '#fff' : theme.cores.verde} />
      </View>
      <View style={styles.textos}>
        <Text style={[styles.titulo, principal && styles.tituloPrincipal]}>{titulo}</Text>
        <Text style={[styles.desc, principal && styles.descPrincipal]}>{descricao}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={principal ? 'rgba(255,255,255,0.8)' : theme.cores.textoClaro}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cores.branco,
    borderRadius: theme.raio.md,
    padding: theme.espaco.md,
    marginBottom: theme.espaco.sm,
    ...theme.sombra.card,
  },
  principal: {
    backgroundColor: theme.cores.verde,
  },
  iconeBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.cores.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.espaco.md,
  },
  iconeBoxPrincipal: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textos: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: '700', color: theme.cores.texto },
  tituloPrincipal: { color: '#fff' },
  desc: { fontSize: 13, color: theme.cores.textoClaro, marginTop: 2 },
  descPrincipal: { color: 'rgba(255,255,255,0.85)' },
});
