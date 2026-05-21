import { forwardRef } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
} from 'react-native';
import { theme } from '../constants/theme';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  semPadding?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
};

export const TelaLayout = forwardRef<ScrollView, Props>(function TelaLayout(
  { children, semPadding, contentContainerStyle, keyboardShouldPersistTaps, ...rest },
  ref
) {
  return (
    <Pressable style={styles.fundo} onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        ref={ref}
        contentContainerStyle={[styles.scroll, semPadding && styles.semPad, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
        keyboardDismissMode="on-drag"
        {...rest}
      >
        {children}
      </ScrollView>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
  scroll: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
  semPad: { padding: 0 },
});
