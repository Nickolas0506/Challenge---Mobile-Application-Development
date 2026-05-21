import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CommonActions, type CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AcaoCard } from '../components/AcaoCard';
import { Card } from '../components/Card';
import { ResumoDiaCard } from '../components/ResumoDiaCard';
import { TituloSecao } from '../components/TituloSecao';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { Storage, type EventoIot, type Pet, type Streak, type Tutor } from '../lib/storage';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function InicioScreen({ navigation }: Props) {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [streak, setStreak] = useState<Streak>({ dias: 0, ultimaData: '' });
  const [fezHoje, setFezHoje] = useState(false);
  const [eventosIot, setEventosIot] = useState<EventoIot[]>([]);
  const [refresh, setRefresh] = useState(false);

  const carregar = useCallback(async () => {
    setTutor(await Storage.getTutor());
    setPet(await Storage.getPet());
    setStreak(await Storage.getStreak());
    setFezHoje(await Storage.fezCheckinHoje());
    setEventosIot(await Storage.getEventosIot());
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const primeiroNome = tutor?.nome?.split(' ')[0] ?? 'tutor';
  const ultimoIot = eventosIot[0];

  return (
    <TelaLayout
      semPadding
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
    >
      <View style={styles.hero}>
        <Pressable
          style={styles.sair}
          onPress={async () => {
            await Storage.logout();
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
            );
          }}
        >
          <Text style={styles.sairTxt}>Sair</Text>
        </Pressable>
        <Text style={styles.ola}>Ola, {primeiroNome}</Text>
        <Text style={styles.frase}>
          {pet
            ? `Acompanhando a rotina de ${pet.nome}`
            : 'Cadastre seu pet na aba Meu Pet para comecar'}
        </Text>
      </View>

      <View style={styles.corpo}>
        {!pet ? (
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
        ) : (
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
                  {pet.caracteristicas ? (
                    <Text style={styles.petExtra} numberOfLines={2}>
                      {pet.caracteristicas}
                    </Text>
                  ) : null}
                </View>
                <Ionicons name="create-outline" size={22} color={theme.cores.verde} />
              </View>
              <Text style={styles.editarHint}>Toque para editar os dados do pet</Text>
            </Card>
          </Pressable>
        )}

        <TituloSecao titulo="Resumo de hoje" dica="Status da sua rotina diaria" />

        <ResumoDiaCard
          icone="flame"
          titulo="Sequencia de check-ins"
          valor={`${streak.dias} ${streak.dias === 1 ? 'dia' : 'dias'}`}
          descricao={
            streak.dias > 0
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

        {ultimoIot && (
          <>
            <TituloSecao titulo="Sensor urinario" dica="Caixa de areia / tapete" />
            <Card>
              <View style={styles.iotHeader}>
                <Ionicons name="hardware-chip-outline" size={22} color={theme.cores.verde} />
                <Text style={styles.iotTitulo}>Ultimo evento PIR</Text>
              </View>
              <Text style={styles.iotMsg}>{ultimoIot.mensagem}</Text>
              <Text style={styles.iotData}>
                {new Date(ultimoIot.data).toLocaleString('pt-BR')}
              </Text>
            </Card>
          </>
        )}
      </View>
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.cores.verde,
    paddingHorizontal: theme.espaco.md,
    paddingTop: theme.espaco.md,
    paddingBottom: theme.espaco.lg,
    borderBottomLeftRadius: theme.raio.lg,
    borderBottomRightRadius: theme.raio.lg,
  },
  sair: { alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 8 },
  sairTxt: { color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: 14 },
  ola: { fontSize: 28, fontWeight: '800', color: '#fff' },
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
