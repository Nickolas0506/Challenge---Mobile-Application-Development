import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import {
  Storage,
  type Checkin,
  type EventoIot,
  type Passeio,
  type RegistroPetHistorico,
} from '../lib/storage';
import type { TabParamList } from '../navigation/types';

type ItemHistorico =
  | { tipo: 'pet'; data: string; id: string; registro: RegistroPetHistorico }
  | { tipo: 'checkin'; data: string; id: string; checkin: Checkin }
  | { tipo: 'passeio'; data: string; id: string; passeio: Passeio }
  | { tipo: 'iot'; data: string; id: string; evento: EventoIot };

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

export default function HistoricoScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [itens, setItens] = useState<ItemHistorico[]>([]);
  const [refresh, setRefresh] = useState(false);

  const carregar = useCallback(async () => {
    const [registrosPet, checkins, passeios, iot] = await Promise.all([
      Storage.getRegistrosPetHistorico(),
      Storage.getCheckins(),
      Storage.getPasseios(),
      Storage.getEventosIot(),
    ]);
    const lista: ItemHistorico[] = [
      ...registrosPet.map((r) => ({
        tipo: 'pet' as const,
        data: r.data,
        id: r.id,
        registro: r,
      })),
      ...checkins.map((c) => ({ tipo: 'checkin' as const, data: c.data, id: c.id, checkin: c })),
      ...passeios.map((p) => ({ tipo: 'passeio' as const, data: p.data, id: p.id, passeio: p })),
      ...iot.map((e) => ({ tipo: 'iot' as const, data: e.data, id: e.id, evento: e })),
    ];
    lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    setItens(lista);
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  return (
    <View style={styles.fundo}>
      <CabecalhoTela
        titulo="Historico"
        subtitulo="Cadastro do pet, check-ins, passeios e sensor"
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      <FlatList
        data={itens}
        keyExtractor={(item) => `${item.tipo}-${item.id}`}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={async () => {
              setRefresh(true);
              await carregar();
              setRefresh(false);
            }}
          />
        }
        ListEmptyComponent={
          <Card>
            <Text style={styles.vazio}>Nenhum registro ainda.</Text>
            <Text style={styles.vazioSub}>
              Cadastre o pet em Meu Pet, faca check-in ou registre um passeio.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.iconeBox}>
                <Ionicons name={ICONES[item.tipo]} size={18} color={theme.cores.verde} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTipo}>{LABELS[item.tipo]}</Text>
                <Text style={styles.itemData}>{formatarData(item.data)}</Text>
              </View>
            </View>
            {item.tipo === 'pet' && (
              <Text style={styles.itemDetalhe}>
                {item.registro.acao === 'cadastro' ? 'Cadastro' : 'Alteracao'}:{' '}
                <Text style={{ fontWeight: '700' }}>{item.registro.nomePet}</Text>
                {' — '}
                {item.registro.detalhe}
              </Text>
            )}
            {item.tipo === 'checkin' && (
              <Text style={styles.itemDetalhe}>Humor: {item.checkin.humor}</Text>
            )}
            {item.tipo === 'passeio' && (
              <Text style={styles.itemDetalhe}>
                {item.passeio.duracaoMin} min · Agua: {item.passeio.bebeuAgua ? 'sim' : 'nao'}
                {' · '}
                {item.passeio.urinou === false
                  ? 'Sem urina'
                  : `Urina: ${item.passeio.urinaNormal !== false ? 'ok' : 'alterada'}`}
                {' · Fezes: '}
                {item.passeio.fezesNormais ? 'ok' : 'alteradas'}
                {' · Comportamento: '}
                {item.passeio.comportamentoNormal !== false ? 'normal' : 'alterado'}
              </Text>
            )}
            {item.tipo === 'iot' && (
              <Text style={styles.itemDetalhe}>{item.evento.mensagem}</Text>
            )}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
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
