import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import { Storage, type Alerta } from '../lib/storage';
import type { TabParamList } from '../navigation/types';

const TIPO_CONFIG: Record<Alerta['tipo'], { label: string; icone: keyof typeof Ionicons.glyphMap }> = {
  checkin: { label: 'Rotina', icone: 'calendar' },
  iot: { label: 'Sensor', icone: 'hardware-chip-outline' },
  vacina: { label: 'Vacina', icone: 'medkit' },
  passeio: { label: 'Passeio', icone: 'walk' },
};

export default function AlertasScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [refresh, setRefresh] = useState(false);

  const carregar = useCallback(async () => {
    setAlertas(await Storage.getAlertas());
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  async function marcarLido(id: string) {
    const lista = alertas.map((a) => (a.id === id ? { ...a, lido: true } : a));
    await Storage.setAlertas(lista);
    setAlertas(lista);
  }

  const pendentes = alertas.filter((a) => !a.lido).length;

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

      <FlatList
        data={alertas}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={async () => {
            setRefresh(true);
            await carregar();
            setRefresh(false);
          }} />
        }
        renderItem={({ item }) => {
          const cfg = TIPO_CONFIG[item.tipo];
          return (
            <Pressable onPress={() => !item.lido && marcarLido(item.id)}>
              <Card style={[styles.card, !item.lido && styles.naoLido]}>
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
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
  lista: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl },
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
});
