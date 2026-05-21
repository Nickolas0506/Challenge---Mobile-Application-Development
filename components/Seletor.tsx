import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export type OpcaoSeletor = { value: string; label: string };

type Props = {
  label: string;
  valor: string;
  opcoes: readonly OpcaoSeletor[];
  onChange: (valor: string) => void;
  placeholder?: string;
  obrigatorio?: boolean;
};

export function Seletor({ label, valor, opcoes, onChange, placeholder, obrigatorio }: Props) {
  const [aberto, setAberto] = useState(false);
  const selecionado = opcoes.find((o) => o.value === valor);

  function escolher(novoValor: string) {
    onChange(novoValor);
    setAberto(false);
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>
        {label}
        {obrigatorio ? ' *' : ''}
      </Text>

      <Pressable
        style={({ pressed }) => [styles.campo, pressed && styles.campoPressed]}
        onPress={() => setAberto(true)}
        accessibilityRole="button"
      >
        <Text style={[styles.valor, !selecionado && styles.placeholder]}>
          {selecionado?.label ?? placeholder ?? 'Selecione...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.cores.textoClaro} />
      </Pressable>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={styles.overlay} onPress={() => setAberto(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitulo}>{label}</Text>
            <ScrollView style={styles.lista} keyboardShouldPersistTaps="handled">
              {opcoes.map((op) => {
                const ativo = op.value === valor;
                return (
                  <Pressable
                    key={op.value}
                    style={[styles.opcao, ativo && styles.opcaoAtiva]}
                    onPress={() => escolher(op.value)}
                  >
                    <Text style={[styles.opcaoTxt, ativo && styles.opcaoTxtAtiva]}>{op.label}</Text>
                    {ativo ? (
                      <Ionicons name="checkmark-circle" size={22} color={theme.cores.verde} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={styles.fechar} onPress={() => setAberto(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginBottom: theme.espaco.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: theme.cores.texto },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.cores.branco,
    borderWidth: 1,
    borderColor: theme.cores.borda,
    borderRadius: theme.raio.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 50,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as const } : {}),
  },
  campoPressed: { backgroundColor: theme.cores.verdeClaro },
  valor: { fontSize: 16, color: theme.cores.texto, flex: 1 },
  placeholder: { color: theme.cores.textoClaro },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.cores.branco,
    borderTopLeftRadius: theme.raio.lg,
    borderTopRightRadius: theme.raio.lg,
    paddingTop: theme.espaco.md,
    paddingHorizontal: theme.espaco.md,
    paddingBottom: theme.espaco.lg,
    maxHeight: '70%',
  },
  sheetTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.cores.texto,
    marginBottom: theme.espaco.sm,
  },
  lista: { maxHeight: 320 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: theme.raio.sm,
    marginBottom: 4,
  },
  opcaoAtiva: { backgroundColor: theme.cores.verdeClaro },
  opcaoTxt: { fontSize: 16, color: theme.cores.texto },
  opcaoTxtAtiva: { fontWeight: '700', color: theme.cores.verdeEscuro },
  fechar: {
    marginTop: theme.espaco.sm,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.cores.borda,
  },
  fecharTxt: { fontSize: 16, fontWeight: '700', color: theme.cores.verde },
});
