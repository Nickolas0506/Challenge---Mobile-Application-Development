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
import type { AppStackParamList, TabParamList } from '../navigation/types';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import { useResumoDia } from '../hooks/useResumoDia';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Inicio'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function InicioScreen({ navigation }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const { usuario, sair } = useAuth();
  const { pet, fezHoje, sequencia, ultimoEventoIot, carregando, erro, atualizando, atualizar } =
    useResumoDia();
  const primeiroNome = usuario?.nome?.split(/\s+/)[0] || 'tutor';

  return (
    <TelaLayout
      semPadding
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={() => void atualizar()}
        />
      }
    >
      <View style={[styles.hero, { paddingTop: insets.top + theme.espaco.sm }]}>
        <View style={styles.heroTopo}>
          <View style={styles.heroEspaco} />
          <Pressable
            style={styles.config}
            onPress={() => navigation.navigate('Configuracoes')}
            hitSlop={8}
            accessibilityLabel="Configuracoes"
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </Pressable>
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
              <Ionicons name="paw" size={36} color={cores.verde} />
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
                <Ionicons name="create-outline" size={22} color={cores.verde} />
              </View>
              <Text style={styles.editarHint}>Toque para gerenciar os pets</Text>
            </Card>
          </Pressable>
        ) : null}

        <TituloSecao titulo="Resumo de hoje" dica="Status da sua rotina diaria" />

        <ResumoDiaCard
          icone="flame"
          titulo="Sequencia de check-ins"
          valor={`${sequencia} ${sequencia === 1 ? 'dia' : 'dias'}`}
          descricao={
            sequencia > 0
              ? 'Dias seguidos registrando como seu pet esta'
              : 'Faca o primeiro check-in para comecar a sequencia'
          }
          corFundo={cores.avisoFundo}
          corIcone={cores.vermelho}
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
          corFundo={fezHoje ? cores.sucessoFundo : cores.erroFundo}
          corIcone={fezHoje ? cores.verde : cores.vermelho}
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

        {ultimoEventoIot ? (
          <>
            <TituloSecao titulo="Sensor urinario" dica="Caixa de areia / tapete" />
            <Card>
              <View style={styles.iotHeader}>
                <Ionicons name="hardware-chip-outline" size={22} color={cores.verde} />
                <Text style={styles.iotTitulo}>Ultimo evento PIR</Text>
              </View>
              <Text style={styles.iotMsg}>{ultimoEventoIot.mensagem}</Text>
              <Text style={styles.iotData}>{new Date(ultimoEventoIot.data).toLocaleString('pt-BR')}</Text>
            </Card>
          </>
        ) : null}
      </View>
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    hero: {
      backgroundColor: cores.verde,
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
    config: {
      padding: 8,
      borderRadius: theme.raio.pill,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginRight: theme.espaco.sm,
    },
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
      color: cores.texto,
      marginTop: theme.espaco.sm,
    },
    semPetSub: {
      fontSize: 14,
      color: cores.textoClaro,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 21,
      paddingHorizontal: theme.espaco.sm,
    },
    negrito: { fontWeight: '700', color: cores.verde },
    petCard: { marginBottom: theme.espaco.md },
    petRow: { flexDirection: 'row', alignItems: 'center', gap: theme.espaco.md },
    foto: { width: 56, height: 56, borderRadius: 28 },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: cores.verdeClaro,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letra: { fontSize: 24, fontWeight: '800', color: cores.verde },
    petNome: { fontSize: 20, fontWeight: '800', color: cores.texto },
    petInfo: { fontSize: 14, color: cores.textoClaro, marginTop: 4 },
    petExtra: { fontSize: 13, color: cores.texto, marginTop: 4, lineHeight: 18 },
    editarHint: {
      fontSize: 12,
      color: cores.verde,
      fontWeight: '600',
      marginTop: theme.espaco.sm,
      textAlign: 'center',
    },
    iotHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    iotTitulo: { fontSize: 15, fontWeight: '700', color: cores.texto },
    iotMsg: { fontSize: 14, color: cores.texto, lineHeight: 20 },
    iotData: { fontSize: 12, color: cores.textoClaro, marginTop: 8 },
  });
