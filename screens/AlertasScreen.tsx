import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { theme } from '../constants/theme';
import { alertaParaInput, useAlertas, useAtualizarAlerta, useRemoverAlerta } from '../hooks/useAlertas';
import { useCriarEventoIot } from '../hooks/useEventosIot';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import type { Alerta } from '../types/models';

const TIPO_CONFIG: Record<Alerta['tipo'], { label: string; icone: keyof typeof Ionicons.glyphMap }> = {
  checkin: { label: 'Rotina', icone: 'calendar' },
  iot: { label: 'Sensor', icone: 'hardware-chip-outline' },
  vacina: { label: 'Vacina', icone: 'medkit' },
  passeio: { label: 'Passeio', icone: 'walk' },
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Alertas'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function AlertasScreen({ navigation }: Props) {
  const { data: alertas, isLoading, isError, refetch, isRefetching } = useAlertas();
  const atualizar = useAtualizarAlerta();
  const remover = useRemoverAlerta();
  const criarIot = useCriarEventoIot();

  const pendentes = (alertas ?? []).filter((a) => !a.lido).length;

  function marcarLido(item: Alerta) {
    if (item.lido) return;
    atualizar.mutate({
      id: item.id,
      dados: { ...alertaParaInput(item), lido: true },
    });
  }

  function excluir(item: Alerta) {
    Alert.alert('Excluir alerta', `Remover "${item.titulo}" da API?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => remover.mutate(item.id) },
    ]);
  }

  async function registrarSensor() {
    try {
      await criarIot.mutateAsync({
        data: new Date().toISOString(),
        tipo: 'uso_normal',
        mensagem: 'Uso registrado na caixa de areia (sensor PIR)',
      });
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao registrar evento.');
    }
  }

  return (
    <View style={styles.fundo}>
      <CabecalhoTela
        titulo="Alertas"
        subtitulo={
          pendentes > 0
            ? `${pendentes} pendente(s) — toque para marcar como lido`
            : 'Tudo em dia'
        }
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      {isLoading ? <EstadoCarregando /> : null}
      {isError ? (
        <View style={styles.pad}>
          <EstadoErro onTentar={() => void refetch()} />
        </View>
      ) : null}

      <FlatList
        data={alertas ?? []}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListHeaderComponent={
          <View style={styles.topoAcoes}>
            <Botao texto="Novo alerta" onPress={() => navigation.navigate('AlertaForm')} />
            <Botao
              texto="Registrar evento do sensor"
              secundario
              onPress={() => void registrarSensor()}
              carregando={criarIot.isPending}
            />
          </View>
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Card>
              <Text style={styles.vazio}>Nenhum alerta na API.</Text>
              <Text style={styles.vazioSub}>Crie um lembrete para acompanhar a rotina.</Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => {
          const cfg = TIPO_CONFIG[item.tipo];
          return (
            <Card style={[styles.card, !item.lido && styles.naoLido]}>
              <Pressable onPress={() => marcarLido(item)}>
                <View style={styles.row}>
                  <View style={[styles.iconeBox, !item.lido && styles.iconePendente]}>
                    <Ionicons name={cfg.icone} size={20} color={theme.cores.verde} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipo}>{cfg.label}</Text>
                    <Text style={styles.titulo}>{item.titulo}</Text>
                    <Text style={styles.msg}>{item.mensagem}</Text>
                  </View>
                  {!item.lido && <View style={styles.bolinha} />}
                </View>
              </Pressable>
              <View style={styles.acoes}>
                <Pressable onPress={() => navigation.navigate('AlertaForm', { alertaId: item.id })}>
                  <Text style={styles.link}>Editar</Text>
                </Pressable>
                <Pressable onPress={() => excluir(item)}>
                  <Text style={styles.linkExcluir}>Excluir</Text>
                </Pressable>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
  pad: { paddingHorizontal: theme.espaco.md },
  lista: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
  topoAcoes: { marginBottom: theme.espaco.md },
  card: { marginBottom: theme.espaco.sm },
  naoLido: { borderWidth: 2, borderColor: theme.cores.verde },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.espaco.sm },
  iconeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconePendente: { backgroundColor: theme.cores.verdeClaro },
  tipo: { fontSize: 11, fontWeight: '800', color: theme.cores.verde, textTransform: 'uppercase' },
  titulo: { fontSize: 16, fontWeight: '700', marginTop: 2, color: theme.cores.texto },
  msg: { fontSize: 14, color: theme.cores.textoClaro, marginTop: 4, lineHeight: 20 },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.cores.vermelho,
    marginTop: 6,
  },
  acoes: { flexDirection: 'row', gap: theme.espaco.lg, marginTop: theme.espaco.sm },
  link: { color: theme.cores.verde, fontWeight: '700' },
  linkExcluir: { color: theme.cores.vermelho, fontWeight: '700' },
  vazio: { fontWeight: '700', fontSize: 16, textAlign: 'center' },
  vazioSub: { textAlign: 'center', color: theme.cores.textoClaro, marginTop: 8 },
});
