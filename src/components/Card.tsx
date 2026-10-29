import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  children: React.ReactNode;
  destaque?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style, destaque }: Props) {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={[styles.card, destaque && styles.destaque, style]}>
      {children}
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    card: {
      backgroundColor: cores.superficie,
      borderRadius: theme.raio.md,
      padding: theme.espaco.md,
      ...theme.sombra.card,
    },
    destaque: {
      borderWidth: 2,
      borderColor: cores.verde,
      backgroundColor: cores.verdeClaro,
    },
  });
