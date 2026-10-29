import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useAtualizarCheckin, useCheckin, useRemoverCheckin } from '../hooks/useCheckins';
import { avisar, confirmar } from '../lib/confirmar';
import type { AppStackParamList } from '../navigation/types';
import type { HumorCheckin } from '../types/models';
import { HUMORES } from '../constants/humores';
import type { Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

type Props = NativeStackScreenProps<AppStackParamList, 'CheckinEditar'>;

export default function CheckinEditarScreen({ navigation, route }: Props) {
  const styles = useEstilos(criarEstilos);
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
      avisar('Erro', e instanceof Error ? e.message : 'Falha ao atualizar.');
    }
  }

  function excluir() {
    confirmar('Excluir check-in', 'Remover este registro da API?', async () => {
      try {
        await remover.mutateAsync(checkinId);
        navigation.goBack();
      } catch (e) {
        avisar('Erro', e instanceof Error ? e.message : 'Falha ao excluir.');
      }
    });
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
            key={h.valor}
            style={[styles.chip, humor === h.valor && styles.chipAtivo]}
            onPress={() => setHumor(h.valor)}
          >
            <Text style={[styles.chipTxt, humor === h.valor && styles.chipTxtAtivo]}>
              {h.emoji} {h.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Campo label="Observacao" value={obs} onChange={setObs} placeholder="Opcional" multiline />
      <Botao texto="Salvar alteracoes" onPress={() => void salvar()} carregando={atualizar.isPending} />
      <Botao texto="Excluir check-in" onPress={excluir} perigo carregando={remover.isPending} />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    titulo: { fontSize: 22, fontWeight: '800', color: cores.texto },
    sub: { color: cores.textoClaro, marginBottom: theme.espaco.lg, marginTop: 6 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.espaco.md },
    chip: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: theme.raio.pill,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
    chipAtivo: { backgroundColor: cores.verdeClaro, borderColor: cores.verde },
    chipTxt: { fontWeight: '700', color: cores.textoClaro, textTransform: 'capitalize' },
    chipTxtAtivo: { color: cores.verdeEscuro },
  });
