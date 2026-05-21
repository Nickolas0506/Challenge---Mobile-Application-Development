import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  destaque?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style, destaque }: Props) {
  return (
    <View style={[styles.card, destaque && styles.destaque, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.cores.branco,
    borderRadius: theme.raio.md,
    padding: theme.espaco.md,
    ...theme.sombra.card,
  },
  destaque: {
    borderWidth: 2,
    borderColor: theme.cores.verde,
    backgroundColor: theme.cores.verdeClaro,
  },
});
