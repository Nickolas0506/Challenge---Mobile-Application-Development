import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import type { HumorCheckin } from '../lib/storage';
import { Storage } from '../lib/storage';
import type { RootStackParamList, TabParamList } from '../navigation/types';

const HUMORES: { valor: HumorCheckin; emoji: string; label: string; cor: string }[] = [
  { valor: 'otimo', emoji: '😄', label: 'Otimo', cor: '#2A9D8F' },
  { valor: 'bom', emoji: '🙂', label: 'Bom', cor: theme.cores.verde },
  { valor: 'regular', emoji: '😐', label: 'Regular', cor: theme.cores.laranja },
  { valor: 'ruim', emoji: '😟', label: 'Ruim', cor: theme.cores.vermelho },
];

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Checkin'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function CheckinScreen({ navigation }: Props) {
  const [selecionado, setSelecionado] = useState<HumorCheckin | null>(null);
  const [obs, setObs] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function registrar(humor: HumorCheckin) {
    setSelecionado(humor);
    setSalvando(true);

    const pet = await Storage.getPet();
    await Storage.addCheckin({
      id: String(Date.now()),
      data: new Date().toISOString(),
      humor,
      observacao: obs.trim() || undefined,
    });
    await Storage.atualizarStreak();

    const alertas = await Storage.getAlertas();
    await Storage.setAlertas(
      alertas.map((a) => (a.tipo === 'checkin' ? { ...a, lido: true } : a))
    );

    setSalvando(false);
    navigation.navigate('Orientacao', { humor, pet: pet?.nome ?? 'seu pet' });
  }

  return (
    <TelaLayout semPadding keyboardShouldPersistTaps="handled">
      <CabecalhoTela
        titulo="Check-in"
        subtitulo="Toque no humor do seu pet. Leva menos de 10 segundos."
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      <View style={styles.grid}>
        {HUMORES.map((h) => (
          <Pressable
            key={h.valor}
            style={[
              styles.humorBtn,
              selecionado === h.valor && { borderColor: h.cor, backgroundColor: theme.cores.verdeClaro },
            ]}
            onPress={() => registrar(h.valor)}
            disabled={salvando}
          >
            {salvando && selecionado === h.valor ? (
              <ActivityIndicator color={h.cor} />
            ) : (
              <>
                <Text style={styles.emoji}>{h.emoji}</Text>
                <Text style={styles.humorLabel}>{h.label}</Text>
              </>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.corpo}>
        <Card>
          <Text style={styles.obsTitulo}>Observacao (opcional)</Text>
          <TextInput
            style={styles.input}
            value={obs}
            onChangeText={setObs}
            placeholder="Ex: comeu bem, brincou..."
            placeholderTextColor={theme.cores.textoClaro}
            multiline
          />
        </Card>

        <Text style={styles.aviso}>
          Nao e diagnostico. Voce vera uma orientacao simples apos salvar.
        </Text>
      </View>
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.espaco.md,
    gap: theme.espaco.sm,
    justifyContent: 'space-between',
  },
  humorBtn: {
    width: '48%',
    backgroundColor: theme.cores.branco,
    borderRadius: theme.raio.md,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.cores.borda,
    ...theme.sombra.card,
  },
  emoji: { fontSize: 40 },
  humorLabel: { marginTop: 8, fontWeight: '700', fontSize: 16, color: theme.cores.texto },
  corpo: { padding: theme.espaco.md },
  obsTitulo: { fontWeight: '600', marginBottom: 8, color: theme.cores.texto },
  input: {
    backgroundColor: theme.cores.fundo,
    borderRadius: theme.raio.sm,
    padding: 12,
    minHeight: 80,
    fontSize: 15,
    textAlignVertical: 'top',
    color: theme.cores.texto,
  },
  aviso: {
    marginTop: theme.espaco.md,
    fontSize: 13,
    color: theme.cores.textoClaro,
    textAlign: 'center',
    lineHeight: 20,
  },
});
