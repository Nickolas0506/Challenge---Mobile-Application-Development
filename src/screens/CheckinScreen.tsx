import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useCriarCheckin } from '../hooks/useCheckins';
import { usePets } from '../hooks/usePets';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import type { HumorCheckin } from '../types/models';
import { HUMORES } from '../constants/humores';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Checkin'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function CheckinScreen({ navigation }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const { data: pets } = usePets();
  const criar = useCriarCheckin();
  const [selecionado, setSelecionado] = useState<HumorCheckin | null>(null);
  const [obs, setObs] = useState('');
  const [erro, setErro] = useState('');

  async function registrar(humor: HumorCheckin) {
    setSelecionado(humor);
    setErro('');
    const pet = pets?.[0];
    try {
      await criar.mutateAsync({
        petId: pet?.id,
        data: new Date().toISOString(),
        humor,
        observacao: obs.trim() || undefined,
      });
      setObs('');
      navigation.navigate('Orientacao', { humor, pet: pet?.nome ?? 'seu pet' });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Nao foi possivel salvar o check-in.');
    }
  }

  return (
    <TelaLayout semPadding keyboardShouldPersistTaps="handled">
      <CabecalhoTela
        titulo="Check-in"
        subtitulo="Toque no humor do seu pet. O registro vai para a API."
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      <View style={styles.grid}>
        {HUMORES.map((h) => (
          <Pressable
            key={h.valor}
            style={[
              styles.humorBtn,
              selecionado === h.valor && { borderColor: cores[h.cor], backgroundColor: cores.verdeClaro },
            ]}
            onPress={() => void registrar(h.valor)}
            disabled={criar.isPending}
          >
            {criar.isPending && selecionado === h.valor ? (
              <ActivityIndicator color={cores[h.cor]} />
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
            placeholderTextColor={cores.textoClaro}
            multiline
          />
        </Card>
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <Text style={styles.aviso}>
          Nao e diagnostico. Voce vera uma orientacao simples apos salvar.
        </Text>
      </View>
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: theme.espaco.md,
      gap: theme.espaco.sm,
      justifyContent: 'space-between',
    },
    humorBtn: {
      width: '48%',
      backgroundColor: cores.superficie,
      borderRadius: theme.raio.md,
      paddingVertical: 24,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: cores.borda,
      ...theme.sombra.card,
    },
    emoji: { fontSize: 40 },
    humorLabel: { marginTop: 8, fontWeight: '700', fontSize: 16, color: cores.texto },
    corpo: { padding: theme.espaco.md },
    obsTitulo: { fontWeight: '600', marginBottom: 8, color: cores.texto },
    input: {
      backgroundColor: cores.fundo,
      borderRadius: theme.raio.sm,
      padding: 12,
      minHeight: 80,
      fontSize: 15,
      textAlignVertical: 'top',
      color: cores.texto,
    },
    erro: { marginTop: 12, color: cores.vermelho, fontWeight: '600' },
    aviso: {
      marginTop: theme.espaco.md,
      fontSize: 13,
      color: cores.textoClaro,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
