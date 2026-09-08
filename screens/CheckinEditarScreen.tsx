import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useAtualizarCheckin, useCheckin, useRemoverCheckin } from '../hooks/useCheckins';
import type { AppStackParamList } from '../navigation/types';
import type { HumorCheckin } from '../types/models';

const HUMORES: HumorCheckin[] = ['otimo', 'bom', 'regular', 'ruim'];

type Props = NativeStackScreenProps<AppStackParamList, 'CheckinEditar'>;

export default function CheckinEditarScreen({ navigation, route }: Props) {
  const { checkinId } = route.params;
  const { data, isLoading, isError, refetch } = useCheckin(checkinId);
  const atualizar = useAtualizarCheckin();
  const remover = useRemoverCheckin();
  const [humor, setHumor] = useState<HumorCheckin>('bom');
  const [obs, setObs] = useState('');

  useEffect(() => {
    if (!data) return;
    setHumor(data.humor);
    setObs(data.observacao ?? '');
  }, [data]);

  async function salvar() {
    if (!data) return;
    try {
      await atualizar.mutateAsync({
        id: data.id,
        dados: {
          petId: data.petId,
          data: data.data,
          humor,
          observacao: obs.trim() || undefined,
        },
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao atualizar.');
    }
  }

  function excluir() {
    Alert.alert('Excluir check-in', 'Remover este registro da API?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await remover.mutateAsync(checkinId);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao excluir.');
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <TelaLayout>
        <EstadoCarregando texto="Carregando check-in..." />
      </TelaLayout>
    );
  }

  if (isError || !data) {
    return (
      <TelaLayout>
        <EstadoErro onTentar={() => void refetch()} />
      </TelaLayout>
    );
  }

  return (
    <TelaLayout>
      <Text style={styles.titulo}>Editar check-in</Text>
      <Text style={styles.sub}>Alterar ou excluir atualiza a API e a lista automaticamente.</Text>

      <View style={styles.grid}>
        {HUMORES.map((h) => (
          <Pressable
            key={h}
            style={[styles.chip, humor === h && styles.chipAtivo]}
            onPress={() => setHumor(h)}
          >
            <Text style={[styles.chipTxt, humor === h && styles.chipTxtAtivo]}>{h}</Text>
          </Pressable>
        ))}
      </View>

      <Campo label="Observacao" value={obs} onChange={setObs} placeholder="Opcional" multiline />
      <Botao texto="Salvar alteracoes" onPress={() => void salvar()} carregando={atualizar.isPending} />
      <Botao texto="Excluir check-in" onPress={excluir} perigo carregando={remover.isPending} />
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '800', color: theme.cores.texto },
  sub: { color: theme.cores.textoClaro, marginBottom: theme.espaco.lg, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.espaco.md },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.raio.pill,
    borderWidth: 1,
    borderColor: theme.cores.borda,
    backgroundColor: theme.cores.branco,
  },
  chipAtivo: { backgroundColor: theme.cores.verdeClaro, borderColor: theme.cores.verde },
  chipTxt: { fontWeight: '700', color: theme.cores.textoClaro, textTransform: 'capitalize' },
  chipTxtAtivo: { color: theme.cores.verdeEscuro },
});
