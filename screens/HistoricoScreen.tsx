import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { theme } from '../constants/theme';
import { useCheckins } from '../hooks/useCheckins';
import { useEventosIot } from '../hooks/useEventosIot';
import { usePasseios } from '../hooks/usePasseios';
import { usePets } from '../hooks/usePets';
import type { AppStackParamList, TabParamList } from '../navigation/types';

type ItemHistorico =
  | { tipo: 'pet'; data: string; id: string; titulo: string; detalhe: string }
  | { tipo: 'checkin'; data: string; id: string; titulo: string; detalhe: string }
  | { tipo: 'passeio'; data: string; id: string; titulo: string; detalhe: string }
  | { tipo: 'iot'; data: string; id: string; titulo: string; detalhe: string };

const ICONES = {
  pet: 'paw' as const,
  checkin: 'heart' as const,
  passeio: 'walk' as const,
  iot: 'hardware-chip-outline' as const,
};

const LABELS = {
  pet: 'Meu pet',
  checkin: 'Check-in',
  passeio: 'Passeio',
  iot: 'Sensor',
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Historico'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function HistoricoScreen({ navigation }: Props) {
  const petsQuery = usePets();
  const checkinsQuery = useCheckins();
  const passeiosQuery = usePasseios();
  const iotQuery = useEventosIot();

  const carregando =
    petsQuery.isLoading || checkinsQuery.isLoading || passeiosQuery.isLoading || iotQuery.isLoading;
  const erro = petsQuery.isError || checkinsQuery.isError || passeiosQuery.isError || iotQuery.isError;

  const itens: ItemHistorico[] = [
    ...(petsQuery.data ?? []).map((p) => ({
      tipo: 'pet' as const,
      data: p.createdAt ?? new Date().toISOString(),
      id: p.id,
      titulo: p.nome,
      detalhe: [p.especie, p.raca, p.peso !== '-' ? `${p.peso} kg` : null, p.idade]
        .filter(Boolean)
        .join(' · '),
    })),
    ...(checkinsQuery.data ?? []).map((c) => ({
      tipo: 'checkin' as const,
      data: c.data,
      id: c.id,
      titulo: 'Check-in',
      detalhe: `Humor: ${c.humor}${c.observacao ? ` — ${c.observacao}` : ''}`,
    })),
    ...(passeiosQuery.data ?? []).map((p) => ({
      tipo: 'passeio' as const,
      data: p.data,
      id: p.id,
      titulo: 'Passeio',
      detalhe: `${p.duracaoMin} min · Agua: ${p.bebeuAgua ? 'sim' : 'nao'} · Urina: ${
        p.urinou ? (p.urinaNormal ? 'ok' : 'alterada') : 'nao'
      }`,
    })),
    ...(iotQuery.data ?? []).map((e) => ({
      tipo: 'iot' as const,
      data: e.data,
      id: e.id,
      titulo: 'Sensor',
      detalhe: e.mensagem,
    })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  function abrir(item: ItemHistorico) {
    if (item.tipo === 'checkin') navigation.navigate('CheckinEditar', { checkinId: item.id });
    if (item.tipo === 'passeio') navigation.navigate('PasseioEditar', { passeioId: item.id });
    if (item.tipo === 'pet') navigation.navigate('PetForm', { petId: item.id });
  }

  async function atualizar() {
    await Promise.all([
      petsQuery.refetch(),
      checkinsQuery.refetch(),
      passeiosQuery.refetch(),
      iotQuery.refetch(),
    ]);
  }

  return (
    <View style={styles.fundo}>
      <CabecalhoTela
        titulo="Historico"
        subtitulo="Dados da API — toque em check-in ou passeio para editar/excluir"
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      {carregando ? <EstadoCarregando /> : null}
      {erro ? (
        <View style={styles.pad}>
          <EstadoErro onTentar={() => void atualizar()} />
        </View>
      ) : null}

      <FlatList
        data={itens}
        keyExtractor={(item) => `${item.tipo}-${item.id}`}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={checkinsQuery.isRefetching} onRefresh={() => void atualizar()} />
        }
        ListEmptyComponent={
          !carregando && !erro ? (
            <Card>
              <Text style={styles.vazio}>Nenhum registro ainda.</Text>
              <Text style={styles.vazioSub}>
                Cadastre o pet, faca check-in ou registre um passeio.
              </Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => abrir(item)} disabled={item.tipo === 'iot'}>
            <Card style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.iconeBox}>
                  <Ionicons name={ICONES[item.tipo]} size={18} color={theme.cores.verde} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTipo}>{LABELS[item.tipo]}</Text>
                  <Text style={styles.itemData}>{formatarData(item.data)}</Text>
                </View>
                {item.tipo !== 'iot' ? (
                  <Ionicons name="chevron-forward" size={18} color={theme.cores.textoClaro} />
                ) : null}
              </View>
              <Text style={styles.itemDetalhe}>{item.detalhe}</Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
  pad: { paddingHorizontal: theme.espaco.md },
  lista: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
  item: { marginBottom: theme.espaco.sm },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.espaco.sm },
  iconeBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.cores.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTipo: { fontWeight: '700', fontSize: 16, color: theme.cores.texto },
  itemData: { fontSize: 12, color: theme.cores.textoClaro, marginTop: 2 },
  itemDetalhe: { marginTop: 10, fontSize: 14, color: theme.cores.texto, lineHeight: 20 },
  vazio: { fontWeight: '700', fontSize: 16, textAlign: 'center' },
  vazioSub: { textAlign: 'center', color: theme.cores.textoClaro, marginTop: 8, lineHeight: 20 },
});
