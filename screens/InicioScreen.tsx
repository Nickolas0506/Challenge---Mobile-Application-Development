import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AcaoCard } from '../components/AcaoCard';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { ResumoDiaCard } from '../components/ResumoDiaCard';
import { TelaLayout } from '../components/TelaLayout';
import { TituloSecao } from '../components/TituloSecao';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useCheckins } from '../hooks/useCheckins';
import { useEventosIot } from '../hooks/useEventosIot';
import { usePets } from '../hooks/usePets';
import type { AppStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<AppStackParamList>
>;

function mesmoDia(iso: string) {
  const hoje = new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10) === hoje;
}

function calcularStreak(datas: string[]) {
  const dias = new Set(datas.map((d) => d.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (dias.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (streak === 0) {
    cursor.setDate(cursor.getDate() - 1);
    while (dias.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return streak;
}

export default function InicioScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { usuario, sair } = useAuth();
  const petsQuery = usePets();
  const checkinsQuery = useCheckins();
  const iotQuery = useEventosIot();

  const carregando = petsQuery.isLoading || checkinsQuery.isLoading || iotQuery.isLoading;
  const erro = petsQuery.isError || checkinsQuery.isError || iotQuery.isError;
  const pet = petsQuery.data?.[0];
  const checkins = checkinsQuery.data ?? [];
  const fezHoje = checkins.some((c) => mesmoDia(c.data));
  const streak = calcularStreak(checkins.map((c) => c.data));
  const ultimoIot = iotQuery.data?.[0];
  const primeiroNome = usuario?.nome?.split(/\s+/)[0] || 'tutor';

  async function atualizar() {
    await Promise.all([petsQuery.refetch(), checkinsQuery.refetch(), iotQuery.refetch()]);
  }

  return (
    <TelaLayout
      semPadding
      refreshControl={
        <RefreshControl
          refreshing={petsQuery.isRefetching || checkinsQuery.isRefetching}
          onRefresh={() => void atualizar()}
        />
      }
    >
      <View style={[styles.hero, { paddingTop: insets.top + theme.espaco.sm }]}>
        <View style={styles.heroTopo}>
          <View style={styles.heroEspaco} />
          <Pressable style={styles.sair} onPress={() => void sair()} hitSlop={8}>
            <Text style={styles.sairTxt}>Sair</Text>
          </Pressable>
        </View>
        <Text style={styles.ola}>Ola, {primeiroNome}</Text>
        <Text style={styles.frase}>
          {pet
            ? `Acompanhando a rotina de ${pet.nome}`
            : 'Cadastre seu pet na aba Meu Pet para comecar'}
        </Text>
      </View>

      <View style={styles.corpo}>
        {carregando ? <EstadoCarregando texto="Buscando dados da API..." /> : null}
        {erro ? (
          <EstadoErro
            onTentar={() => {
              void atualizar();
            }}
          />
        ) : null}

        {!carregando && !erro && !pet ? (
          <Pressable onPress={() => navigation.navigate('MeuPet')}>
            <Card destaque style={styles.semPet}>
              <Ionicons name="paw" size={36} color={theme.cores.verde} />
              <Text style={styles.semPetTitulo}>Nenhum pet cadastrado</Text>
              <Text style={styles.semPetSub}>
                Toque aqui ou va na aba <Text style={styles.negrito}>Meu Pet</Text> para
                adicionar nome, peso, idade e caracteristicas.
              </Text>
            </Card>
          </Pressable>
        ) : null}

        {pet ? (
          <Pressable onPress={() => navigation.navigate('MeuPet')}>
            <Card style={styles.petCard}>
              <View style={styles.petRow}>
                {pet.foto ? (
                  <Image source={{ uri: pet.foto }} style={styles.foto} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.letra}>{pet.nome[0]}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.petNome}>{pet.nome}</Text>
                  <Text style={styles.petInfo}>
                    {pet.especie} · {pet.raca} · {pet.peso !== '-' ? `${pet.peso} kg` : 'peso nao informado'}
                  </Text>
                  {pet.idade ? <Text style={styles.petExtra}>{pet.idade}</Text> : null}
                </View>
                <Ionicons name="create-outline" size={22} color={theme.cores.verde} />
              </View>
              <Text style={styles.editarHint}>Toque para gerenciar os pets</Text>
            </Card>
          </Pressable>
        ) : null}

        <TituloSecao titulo="Resumo de hoje" dica="Status da sua rotina diaria" />

        <ResumoDiaCard
          icone="flame"
          titulo="Sequencia de check-ins"
          valor={`${streak} ${streak === 1 ? 'dia' : 'dias'}`}
          descricao={
            streak > 0
              ? 'Dias seguidos registrando como seu pet esta'
              : 'Faca o primeiro check-in para comecar a sequencia'
          }
          corFundo="#FFF4E6"
          corIcone="#E76F51"
        />

        <ResumoDiaCard
          icone={fezHoje ? 'checkmark-circle' : 'heart'}
          titulo="Check-in de hoje"
          valor={fezHoje ? 'Concluido' : 'Pendente'}
          descricao={
            fezHoje
              ? 'Voce ja registrou o humor do pet hoje. Otimo!'
              : 'Ainda falta registrar como seu pet esta hoje'
          }
          corFundo={fezHoje ? '#E8F6F3' : '#FFF0EB'}
          corIcone={fezHoje ? theme.cores.verde : '#E76F51'}
          onPress={fezHoje ? undefined : () => navigation.navigate('Checkin')}
        />

        <TituloSecao titulo="Acoes rapidas" dica="Toque para registrar" />
        <AcaoCard
          principal
          titulo="Check-in de hoje"
          descricao="Como seu pet esta? Leva 10 segundos"
          icone="heart"
          onPress={() => navigation.navigate('Checkin')}
        />
        <AcaoCard
          titulo="Depois do passeio"
          descricao="Agua, urina, fezes e comportamento"
          icone="walk"
          onPress={() => navigation.navigate('Passeio')}
        />
        <AcaoCard
          titulo="Ver alertas"
          descricao="Lembretes e avisos do sensor"
          icone="notifications"
          onPress={() => navigation.navigate('Alertas')}
        />

        <TituloSecao titulo="Historico" dica="Tudo que voce registrou" />
        <AcaoCard
          titulo="Linha do tempo"
          descricao="Check-ins, passeios e sensor IoT"
          icone="time"
          onPress={() => navigation.navigate('Historico')}
        />

        {ultimoIot ? (
          <>
            <TituloSecao titulo="Sensor urinario" dica="Caixa de areia / tapete" />
            <Card>
              <View style={styles.iotHeader}>
                <Ionicons name="hardware-chip-outline" size={22} color={theme.cores.verde} />
                <Text style={styles.iotTitulo}>Ultimo evento PIR</Text>
              </View>
              <Text style={styles.iotMsg}>{ultimoIot.mensagem}</Text>
              <Text style={styles.iotData}>{new Date(ultimoIot.data).toLocaleString('pt-BR')}</Text>
            </Card>
          </>
        ) : null}
      </View>
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.cores.verde,
    paddingHorizontal: theme.espaco.md,
    paddingBottom: theme.espaco.lg,
    borderBottomLeftRadius: theme.raio.lg,
    borderBottomRightRadius: theme.raio.lg,
  },
  heroTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 36,
    marginBottom: theme.espaco.sm,
  },
  heroEspaco: { flex: 1 },
  sair: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.raio.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sairTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  ola: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 4 },
  frase: { fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 6, lineHeight: 22 },
  corpo: { padding: theme.espaco.md, paddingTop: theme.espaco.md },
  semPet: { alignItems: 'center', paddingVertical: theme.espaco.lg },
  semPetTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.cores.texto,
    marginTop: theme.espaco.sm,
  },
  semPetSub: {
    fontSize: 14,
    color: theme.cores.textoClaro,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
    paddingHorizontal: theme.espaco.sm,
  },
  negrito: { fontWeight: '700', color: theme.cores.verde },
  petCard: { marginBottom: theme.espaco.md },
  petRow: { flexDirection: 'row', alignItems: 'center', gap: theme.espaco.md },
  foto: { width: 56, height: 56, borderRadius: 28 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.cores.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letra: { fontSize: 24, fontWeight: '800', color: theme.cores.verde },
  petNome: { fontSize: 20, fontWeight: '800', color: theme.cores.texto },
  petInfo: { fontSize: 14, color: theme.cores.textoClaro, marginTop: 4 },
  petExtra: { fontSize: 13, color: theme.cores.texto, marginTop: 4, lineHeight: 18 },
  editarHint: {
    fontSize: 12,
    color: theme.cores.verde,
    fontWeight: '600',
    marginTop: theme.espaco.sm,
    textAlign: 'center',
  },
  iotHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  iotTitulo: { fontSize: 15, fontWeight: '700', color: theme.cores.texto },
  iotMsg: { fontSize: 14, color: theme.cores.texto, lineHeight: 20 },
  iotData: { fontSize: 12, color: theme.cores.textoClaro, marginTop: 8 },
});
