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
import { formatarDataHora } from '../lib/datas';
import type { ItemHistorico } from '../lib/historico';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import { useHistorico } from '../hooks/useHistorico';

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

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Historico'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function HistoricoScreen({ navigation }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const { itens, carregando, erro, atualizando, atualizar } = useHistorico();

  function abrir(item: ItemHistorico) {
    if (item.tipo === 'checkin') navigation.navigate('CheckinEditar', { checkinId: item.id });
    if (item.tipo === 'passeio') navigation.navigate('PasseioEditar', { passeioId: item.id });
    if (item.tipo === 'pet') navigation.navigate('PetForm', { petId: item.id });
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
          <RefreshControl refreshing={atualizando} onRefresh={() => void atualizar()} />
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
                  <Ionicons name={ICONES[item.tipo]} size={18} color={cores.verde} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTipo}>{LABELS[item.tipo]}</Text>
                  <Text style={styles.itemData}>{formatarDataHora(item.data)}</Text>
                </View>
                {item.tipo !== 'iot' ? (
                  <Ionicons name="chevron-forward" size={18} color={cores.textoClaro} />
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

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    fundo: { flex: 1, backgroundColor: cores.fundo },
    pad: { paddingHorizontal: theme.espaco.md },
    lista: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
    item: { marginBottom: theme.espaco.sm },
    itemHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.espaco.sm },
    iconeBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: cores.verdeClaro,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemTipo: { fontWeight: '700', fontSize: 16, color: cores.texto },
    itemData: { fontSize: 12, color: cores.textoClaro, marginTop: 2 },
    itemDetalhe: { marginTop: 10, fontSize: 14, color: cores.texto, lineHeight: 20 },
    vazio: { fontWeight: '700', fontSize: 16, textAlign: 'center' },
    vazioSub: { textAlign: 'center', color: cores.textoClaro, marginTop: 8, lineHeight: 20 },
  });
