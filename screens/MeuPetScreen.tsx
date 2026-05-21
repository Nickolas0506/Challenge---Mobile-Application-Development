import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { Seletor } from '../components/Seletor';
import { TelaLayout } from '../components/TelaLayout';
import {
  OPCOES_ESPECIE,
  especieFormularioParaSalvar,
  especieSalvaParaFormulario,
  rotuloEspecie,
} from '../constants/especies';
import { theme } from '../constants/theme';
import { criarAlertasIniciais } from '../lib/dadosIniciais';
import { Storage, type Pet } from '../lib/storage';
import type { TabParamList } from '../navigation/types';

type Props = {
  onSalvo?: () => void;
};

function petParaFormulario(pet: Pet | null) {
  if (!pet) {
    return {
      nome: '',
      especieValor: '',
      especieOutro: '',
      raca: '',
      peso: '',
      idade: '',
      caracteristicas: '',
      foto: undefined as string | undefined,
      id: '',
    };
  }
  const pesoLimpo = pet.peso.replace(/\s*kg\s*/i, '').trim();
  const esp = especieSalvaParaFormulario(pet.especie);
  return {
    nome: pet.nome,
    especieValor: esp.valor,
    especieOutro: esp.outro,
    raca: pet.raca === 'SRD' ? '' : pet.raca,
    peso: pesoLimpo === '-' ? '' : pesoLimpo,
    idade: pet.idade ?? '',
    caracteristicas: pet.caracteristicas ?? '',
    foto: pet.foto,
    id: pet.id,
  };
}

function montarResumoPet(pet: Pet) {
  return [
    pet.especie,
    pet.raca,
    pet.peso !== '-' ? `${pet.peso} kg` : null,
    pet.idade,
    pet.caracteristicas,
  ]
    .filter(Boolean)
    .join(' · ');
}

export default function MeuPetScreen({ onSalvo }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const bloquearRecarga = useRef(false);

  const [nome, setNome] = useState('');
  const [especieValor, setEspecieValor] = useState('');
  const [especieOutro, setEspecieOutro] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [idade, setIdade] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [foto, setFoto] = useState<string | undefined>();
  const [petId, setPetId] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensagemOk, setMensagemOk] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const carregar = useCallback(async () => {
    const pet = await Storage.getPet();
    const dados = petParaFormulario(pet);
    setNome(dados.nome);
    setEspecieValor(dados.especieValor);
    setEspecieOutro(dados.especieOutro);
    setRaca(dados.raca);
    setPeso(dados.peso);
    setIdade(dados.idade);
    setCaracteristicas(dados.caracteristicas);
    setFoto(dados.foto);
    setPetId(dados.id);
    setEditando(!!pet);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (bloquearRecarga.current) return;
      carregar();
    }, [carregar])
  );

  function rolarParaFeedback() {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      const msg = 'Permissao da galeria negada.';
      setMensagemErro(msg);
      rolarParaFeedback();
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!res.canceled) setFoto(res.assets[0].uri);
  }

  async function salvar() {
    setMensagemOk('');
    setMensagemErro('');

    const especieTexto = especieFormularioParaSalvar(especieValor, especieOutro);

    if (!nome.trim()) {
      const msg = 'Informe o nome do pet.';
      setMensagemErro(msg);
      rolarParaFeedback();
      return;
    }
    if (!especieValor) {
      const msg = 'Selecione a especie na lista (toque no campo Especie).';
      setMensagemErro(msg);
      rolarParaFeedback();
      return;
    }
    if (especieValor === 'outro' && !especieOutro.trim()) {
      const msg = 'Informe qual e o animal em "Outro".';
      setMensagemErro(msg);
      rolarParaFeedback();
      return;
    }

    setSalvando(true);
    bloquearRecarga.current = true;

    try {
      const pet: Pet = {
        id: petId || String(Date.now()),
        nome: nome.trim(),
        especie: especieTexto,
        raca: raca.trim() || 'SRD',
        peso: peso.trim() || '-',
        idade: idade.trim() || undefined,
        caracteristicas: caracteristicas.trim() || undefined,
        foto,
      };

      const eraNovo = !editando;
      await Storage.setPet(pet);

      await Storage.addRegistroPetHistorico({
        id: `hist-pet-${Date.now()}`,
        data: new Date().toISOString(),
        acao: eraNovo ? 'cadastro' : 'edicao',
        nomePet: pet.nome,
        detalhe: montarResumoPet(pet),
      });

      if (eraNovo) {
        await Storage.setAlertas(criarAlertasIniciais(pet.nome));
      }

      setEditando(true);
      setPetId(pet.id);

      const textoOk = eraNovo
        ? `${pet.nome} cadastrado! Veja no Historico e na tela Inicio.`
        : `Alteracoes de ${pet.nome} salvas! Confira no Historico.`;

      setMensagemOk(textoOk);
      rolarParaFeedback();

      if (Platform.OS === 'web') {
        window.alert(textoOk);
      } else {
        Alert.alert('Salvo', textoOk);
      }

      if (onSalvo) onSalvo();
    } catch (e) {
      bloquearRecarga.current = false;
      const msg = e instanceof Error ? e.message : 'Erro ao salvar. Tente de novo.';
      setMensagemErro(msg);
      rolarParaFeedback();
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Erro', msg);
    } finally {
      setSalvando(false);
    }
  }

  const especiePreview =
    especieValor === 'outro'
      ? especieOutro || 'Outro'
      : especieValor
        ? rotuloEspecie(especieValor)
        : '';

  const preview = [
    nome,
    especiePreview,
    raca || 'SRD',
    peso && `${peso} kg`,
    idade && `${idade}`,
    caracteristicas,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <CabecalhoTela
        titulo="Meu pet"
        subtitulo={
          editando
            ? 'Edite os dados e toque em Salvar alteracoes no final da tela.'
            : 'Cadastre um novo pet para comecar check-ins, passeios e alertas.'
        }
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />
      <TelaLayout ref={scrollRef} contentContainerStyle={styles.scrollExtra}>
        <Card style={styles.dica}>
          <View style={styles.dicaRow}>
            <Ionicons name="paw" size={22} color={theme.cores.verde} />
            <Text style={styles.dicaTxt}>
              Depois de salvar, o registro aparece na aba Historico e os dados na tela Inicio.
            </Text>
          </View>
        </Card>

        <Text style={styles.secao}>Dados basicos</Text>
        <Campo label="Nome do pet *" value={nome} onChange={setNome} placeholder="Ex: Luna" />
        <Seletor
          label="Especie"
          valor={especieValor}
          opcoes={OPCOES_ESPECIE}
          onChange={setEspecieValor}
          placeholder="Toque para escolher"
          obrigatorio
        />
        {especieValor === 'outro' ? (
          <Campo
            label="Qual animal? *"
            value={especieOutro}
            onChange={setEspecieOutro}
            placeholder="Ex: Furao, Porquinho-da-india..."
          />
        ) : null}
        <Campo label="Raca" value={raca} onChange={setRaca} placeholder="SRD, Persa, Golden..." />
        <Campo label="Peso (kg)" value={peso} onChange={setPeso} placeholder="4.5" teclado="decimal-pad" />
        <Campo label="Idade" value={idade} onChange={setIdade} placeholder="2 anos, 8 meses..." />

        <Text style={styles.secao}>Outras caracteristicas</Text>
        <Campo
          label="Observacoes do pet"
          value={caracteristicas}
          onChange={setCaracteristicas}
          placeholder="Castrado, alergias, medicamentos..."
          multiline
        />

        <Text style={styles.secao}>Foto (opcional)</Text>
        <Pressable style={styles.fotoBox} onPress={escolherFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <View style={styles.fotoVazio}>
              <Ionicons name="camera-outline" size={32} color={theme.cores.verde} />
              <Text style={styles.fotoTxt}>Toque para adicionar foto</Text>
            </View>
          )}
        </Pressable>

        {preview ? (
          <Card destaque style={styles.preview}>
            <Text style={styles.previewLabel}>Previa</Text>
            <Text style={styles.previewTxt}>{preview}</Text>
          </Card>
        ) : null}

        {mensagemErro ? (
          <Card style={styles.feedbackErro}>
            <View style={styles.feedbackRow}>
              <Ionicons name="alert-circle" size={24} color={theme.cores.vermelho} />
              <Text style={styles.feedbackErroTxt}>{mensagemErro}</Text>
            </View>
          </Card>
        ) : null}

        {mensagemOk ? (
          <Card destaque style={styles.feedbackOk}>
            <View style={styles.feedbackRow}>
              <Ionicons name="checkmark-circle" size={24} color={theme.cores.verde} />
              <Text style={styles.feedbackOkTxt}>{mensagemOk}</Text>
            </View>
            <View style={styles.acoesOk}>
              <Pressable style={styles.linkBtn} onPress={() => navigation.navigate('Inicio')}>
                <Text style={styles.linkBtnTxt}>Ir para Inicio</Text>
              </Pressable>
              <Pressable style={styles.linkBtn} onPress={() => navigation.navigate('Historico')}>
                <Text style={styles.linkBtnTxt}>Ver Historico</Text>
              </Pressable>
            </View>
          </Card>
        ) : null}

        <Botao
          texto={editando ? 'Salvar alteracoes' : 'Cadastrar pet'}
          onPress={salvar}
          carregando={salvando}
        />
      </TelaLayout>
    </>
  );
}

const styles = StyleSheet.create({
  scrollExtra: { paddingBottom: 140 },
  feedbackOk: { marginTop: theme.espaco.md, borderWidth: 2, borderColor: theme.cores.verde },
  feedbackErro: {
    marginTop: theme.espaco.md,
    backgroundColor: '#FFF0EB',
    borderWidth: 2,
    borderColor: theme.cores.vermelho,
  },
  feedbackRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  feedbackOkTxt: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.cores.verdeEscuro, lineHeight: 22 },
  feedbackErroTxt: { flex: 1, fontSize: 14, color: theme.cores.vermelho, lineHeight: 20 },
  acoesOk: { flexDirection: 'row', gap: theme.espaco.md, marginTop: theme.espaco.sm, flexWrap: 'wrap' },
  linkBtn: {
    backgroundColor: theme.cores.verdeClaro,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.raio.sm,
  },
  linkBtnTxt: { color: theme.cores.verdeEscuro, fontWeight: '700', fontSize: 14 },
  dica: { marginBottom: theme.espaco.md },
  dicaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dicaTxt: { flex: 1, fontSize: 14, color: theme.cores.texto, lineHeight: 20 },
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.cores.verde,
    marginBottom: theme.espaco.sm,
    marginTop: theme.espaco.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fotoBox: {
    height: 140,
    borderRadius: theme.raio.md,
    borderWidth: 1.5,
    borderColor: theme.cores.borda,
    borderStyle: 'dashed',
    marginBottom: theme.espaco.md,
    overflow: 'hidden',
    backgroundColor: theme.cores.branco,
  },
  foto: { width: '100%', height: '100%' },
  fotoVazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  fotoTxt: { color: theme.cores.verde, fontWeight: '600' },
  preview: { marginBottom: theme.espaco.sm },
  previewLabel: { fontWeight: '700', marginBottom: 6, color: theme.cores.texto },
  previewTxt: { color: theme.cores.textoClaro, lineHeight: 22, fontSize: 15 },
});
