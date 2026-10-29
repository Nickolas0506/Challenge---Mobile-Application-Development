import { forwardRef } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  semPadding?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

export const TelaLayout = forwardRef<ScrollView, Props>(function TelaLayout(
  { children, semPadding, contentContainerStyle, keyboardShouldPersistTaps, ...rest },
  ref
) {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.fundo}>
      <ScrollView
        ref={ref}
        contentContainerStyle={[styles.scroll, semPadding && styles.semPad, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'always'}
        keyboardDismissMode="on-drag"
        nestedScrollEnabled
        {...rest}
      >
        {children}
      </ScrollView>
    </View>
  );
});

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    fundo: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
    semPad: { padding: 0 },
  });

