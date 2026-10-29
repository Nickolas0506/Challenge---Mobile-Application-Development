import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  principal?: boolean;
};

export function AcaoCard({ titulo, descricao, icone, onPress, principal }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  return (
    <Pressable
      style={[styles.card, principal && styles.principal]}
      onPress={onPress}
    >
      <View style={[styles.iconeBox, principal && styles.iconeBoxPrincipal]}>
        <Ionicons name={icone} size={24} color={principal ? '#fff' : cores.verde} />
      </View>
      <View style={styles.textos}>
        <Text style={[styles.titulo, principal && styles.tituloPrincipal]}>{titulo}</Text>
        <Text style={[styles.desc, principal && styles.descPrincipal]}>{descricao}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={principal ? 'rgba(255,255,255,0.8)' : cores.textoClaro}
      />
    </Pressable>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.superficie,
      borderRadius: theme.raio.md,
      padding: theme.espaco.md,
      marginBottom: theme.espaco.sm,
      ...theme.sombra.card,
    },
    principal: {
      backgroundColor: cores.verde,
    },
    iconeBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: cores.verdeClaro,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.espaco.md,
    },
    iconeBoxPrincipal: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    textos: { flex: 1 },
    titulo: { fontSize: 16, fontWeight: '700', color: cores.texto },
    tituloPrincipal: { color: '#fff' },
    desc: { fontSize: 13, color: cores.textoClaro, marginTop: 2 },
    descPrincipal: { color: 'rgba(255,255,255,0.85)' },
  });
