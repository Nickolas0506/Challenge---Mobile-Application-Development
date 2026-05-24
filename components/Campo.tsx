import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  seguro?: boolean;
  multiline?: boolean;
  teclado?: 'default' | 'decimal-pad' | 'numeric' | 'email-address';
};

export function Campo({ label, value, onChange, placeholder, seguro, multiline, teclado }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, Platform.OS === 'web' && styles.inputWeb]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.cores.textoClaro}
        secureTextEntry={seguro}
        multiline={multiline}
        keyboardType={teclado}
        editable
        selectTextOnFocus={false}
        autoCapitalize={teclado === 'email-address' ? 'none' : 'sentences'}
        autoCorrect={teclado === 'email-address' ? false : true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginBottom: theme.espaco.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: theme.cores.texto },
  input: {
    backgroundColor: theme.cores.fundo,
    borderWidth: 1,
    borderColor: theme.cores.borda,
    borderRadius: theme.raio.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.cores.texto,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  inputWeb: {
    outlineStyle: 'solid',
    outlineWidth: 0,
    cursor: 'text',
  } as const,
});
