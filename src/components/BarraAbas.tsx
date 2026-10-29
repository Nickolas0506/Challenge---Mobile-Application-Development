import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type IconeNome = keyof typeof Ionicons.glyphMap;

const ROTULOS: Record<string, string> = {
  Inicio: 'Inicio',
  MeuPet: 'Pet',
  Checkin: 'Check-in',
  Passeio: 'Passeio',
  Historico: 'Historico',
  Alertas: 'Alertas',
};

const ICONES: Record<string, { ativo: IconeNome; inativo: IconeNome }> = {
  Inicio: { ativo: 'home', inativo: 'home-outline' },
  MeuPet: { ativo: 'paw', inativo: 'paw-outline' },
  Checkin: { ativo: 'heart', inativo: 'heart-outline' },
  Passeio: { ativo: 'walk', inativo: 'walk-outline' },
  Historico: { ativo: 'time', inativo: 'time-outline' },
  Alertas: { ativo: 'notifications', inativo: 'notifications-outline' },
};

export function BarraAbas({ state, navigation }: BottomTabBarProps) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focado = state.index === index;
        const icones = ICONES[route.name];
        const rotulo = ROTULOS[route.name] ?? route.name;

        return (
          <Pressable
            key={route.key}
            style={({ pressed }) => [
              styles.item,
              focado && styles.itemAtivo,
              pressed && styles.itemPressed,
            ]}
            onPress={() => navigation.navigate(route.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focado }}
            accessibilityLabel={rotulo}
          >
            <View style={[styles.iconeBox, focado && styles.iconeBoxAtivo]}>
              <Ionicons
                name={focado ? icones.ativo : icones.inativo}
                size={24}
                color={focado ? cores.verde : cores.textoClaro}
              />
            </View>
            <Text style={[styles.rotulo, focado && styles.rotuloAtivo]} numberOfLines={1}>
              {rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor: cores.superficie,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
      paddingTop: 6,
      paddingHorizontal: 2,
      minHeight: 64,
      ...theme.sombra.card,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      paddingVertical: 6,
      paddingHorizontal: 2,
      borderRadius: theme.raio.sm,
      marginHorizontal: 1,
      ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
    },
    itemAtivo: {
      backgroundColor: cores.verdeClaro,
    },
    itemPressed: { opacity: 0.75 },
    iconeBox: {
      width: 44,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    iconeBoxAtivo: {
      backgroundColor: cores.superficie,
    },
    rotulo: {
      fontSize: 10,
      fontWeight: '600',
      color: cores.textoClaro,
      textAlign: 'center',
      maxWidth: '100%',
    },
    rotuloAtivo: {
      color: cores.verdeEscuro,
      fontWeight: '800',
    },
  });
