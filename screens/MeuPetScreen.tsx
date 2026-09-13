import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { theme } from '../constants/theme';
import { usePets, useRemoverPet } from '../hooks/usePets';
import { confirmar } from '../lib/confirmar';
import type { AppStackParamList, TabParamList } from '../navigation/types';
import type { Pet } from '../types/models';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MeuPet'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function MeuPetScreen({ navigation }: Props) {
  const { data: pets, isLoading, isError, refetch, isRefetching } = usePets();
  const remover = useRemoverPet();

  function confirmarExclusao(pet: Pet) {
    confirmar('Excluir pet', `Remover ${pet.nome} da API?`, () => remover.mutate(pet.id));
  }

  return (
    <View style={styles.fundo}>
      <CabecalhoTela
        titulo="Meu pet"
        subtitulo="Cadastre, edite ou remova pets. Os dados vem da API."
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      {isLoading ? <EstadoCarregando texto="Carregando pets..." /> : null}
      {isError ? <View style={styles.pad}><EstadoErro onTentar={() => void refetch()} /></View> : null}

      <FlatList
        data={pets ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListHeaderComponent={
          <Botao texto="Cadastrar novo pet" onPress={() => navigation.navigate('PetForm')} />
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <Card>
              <Text style={styles.vazio}>Nenhum pet na API ainda.</Text>
              <Text style={styles.vazioSub}>Toque em cadastrar para criar o primeiro registro.</Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              {item.foto ? (
                <Image source={{ uri: item.foto }} style={styles.foto} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.letra}>{item.nome[0]}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.info}>
                  {item.especie} · {item.raca}
                  {item.peso && item.peso !== '-' ? ` · ${item.peso} kg` : ''}
                </Text>
                {item.idade ? <Text style={styles.extra}>{item.idade}</Text> : null}
              </View>
            </View>
            <View style={styles.acoes}>
              <Pressable
                style={styles.acao}
                onPress={() => navigation.navigate('PetForm', { petId: item.id })}
              >
                <Ionicons name="create-outline" size={18} color={theme.cores.verde} />
                <Text style={styles.acaoTxt}>Editar</Text>
              </Pressable>
              <Pressable style={styles.acao} onPress={() => confirmarExclusao(item)}>
                <Ionicons name="trash-outline" size={18} color={theme.cores.vermelho} />
                <Text style={[styles.acaoTxt, { color: theme.cores.vermelho }]}>Excluir</Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: theme.cores.fundo },
  pad: { paddingHorizontal: theme.espaco.md },
  lista: { padding: theme.espaco.md, paddingBottom: theme.espaco.xl, gap: theme.espaco.sm },
  card: { marginTop: theme.espaco.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.espaco.md },
  foto: { width: 56, height: 56, borderRadius: 28 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.cores.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letra: { fontSize: 22, fontWeight: '800', color: theme.cores.verde },
  nome: { fontSize: 18, fontWeight: '800', color: theme.cores.texto },
  info: { fontSize: 14, color: theme.cores.textoClaro, marginTop: 4 },
  extra: { fontSize: 13, color: theme.cores.texto, marginTop: 4 },
  acoes: { flexDirection: 'row', gap: theme.espaco.md, marginTop: theme.espaco.md },
  acao: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 4 },
  acaoTxt: { fontWeight: '700', color: theme.cores.verde },
  vazio: { fontWeight: '700', fontSize: 16, textAlign: 'center' },
  vazioSub: { textAlign: 'center', color: theme.cores.textoClaro, marginTop: 8 },
});
