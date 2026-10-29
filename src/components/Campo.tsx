import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

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
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, Platform.OS === 'web' && styles.inputWeb]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.textoClaro}
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

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    box: { marginBottom: theme.espaco.md },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: cores.texto },
    input: {
      backgroundColor: cores.fundo,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: theme.raio.sm,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 16,
      color: cores.texto,
    },
    multiline: { minHeight: 88, textAlignVertical: 'top' },
    inputWeb: {
      outlineStyle: 'solid',
      outlineWidth: 0,
    },
  });
