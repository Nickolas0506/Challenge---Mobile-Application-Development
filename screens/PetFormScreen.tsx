import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { Seletor } from '../components/Seletor';
import { TelaLayout } from '../components/TelaLayout';
import {
  OPCOES_ESPECIE,
  especieFormularioParaSalvar,
  especieSalvaParaFormulario,
  rotuloEspecie,
} from '../constants/especies';
import { theme } from '../constants/theme';
import { useAtualizarPet, useCriarPet, usePet } from '../hooks/usePets';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'PetForm'>;

export default function PetFormScreen({ navigation, route }: Props) {
  const petId = route.params?.petId;
  const petQuery = usePet(petId);
  const criar = useCriarPet();
  const atualizar = useAtualizarPet();

  const [nome, setNome] = useState('');
  const [especieValor, setEspecieValor] = useState('');
  const [especieOutro, setEspecieOutro] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [idade, setIdade] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [foto, setFoto] = useState<string | undefined>();
  const [erro, setErro] = useState('');

  useEffect(() => {
    const pet = petQuery.data;
    if (!pet) return;
    const esp = especieSalvaParaFormulario(pet.especie);
    setNome(pet.nome);
    setEspecieValor(esp.valor);
    setEspecieOutro(esp.outro);
    setRaca(pet.raca === 'SRD' ? '' : pet.raca);
    setPeso(pet.peso.replace(/\s*kg\s*/i, '').replace('-', ''));
    setIdade(pet.idade ?? '');
    setCaracteristicas(pet.caracteristicas ?? '');
    setFoto(pet.foto);
  }, [petQuery.data]);

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErro('Permissao da galeria negada.');
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
    setErro('');
    const especieTexto = especieFormularioParaSalvar(especieValor, especieOutro);
    if (!nome.trim()) {
      setErro('Informe o nome do pet.');
      return;
    }
    if (!especieValor) {
      setErro('Selecione a especie.');
      return;
    }
    if (especieValor === 'outro' && !especieOutro.trim()) {
      setErro('Informe qual e o animal em "Outro".');
      return;
    }

    const dados = {
      nome: nome.trim(),
      especie: especieTexto,
      raca: raca.trim() || 'SRD',
      peso: peso.trim() || '-',
      idade: idade.trim() || undefined,
      caracteristicas: caracteristicas.trim() || undefined,
      foto,
      createdAt: petQuery.data?.createdAt ?? new Date().toISOString(),
    };

    try {
      if (petId) {
        await atualizar.mutateAsync({ id: petId, dados });
      } else {
        await criar.mutateAsync(dados);
      }
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar na API.';
      setErro(msg);
      Alert.alert('Erro', msg);
    }
  }

  const especiePreview =
    especieValor === 'outro' ? especieOutro || 'Outro' : especieValor ? rotuloEspecie(especieValor) : '';
  const preview = [nome, especiePreview, raca || 'SRD', peso && `${peso} kg`, idade]
    .filter(Boolean)
    .join(' · ');

  if (petId && petQuery.isLoading) {
    return (
      <TelaLayout>
        <EstadoCarregando texto="Carregando pet da API..." />
      </TelaLayout>
    );
  }

  return (
    <TelaLayout contentContainerStyle={styles.scroll}>
      <Card style={styles.dica}>
        <View style={styles.dicaRow}>
          <Ionicons name="cloud-outline" size={22} color={theme.cores.verde} />
          <Text style={styles.dicaTxt}>
            Este cadastro e enviado para a API HTTP. Depois de salvar, a lista atualiza sozinha.
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
      <Pressable style={styles.fotoBox} onPress={() => void escolherFoto()}>
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

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao
        texto={petId ? 'Salvar alteracoes' : 'Cadastrar pet'}
        onPress={() => void salvar()}
        carregando={criar.isPending || atualizar.isPending}
      />
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 140 },
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
  erro: { color: theme.cores.vermelho, fontWeight: '600', marginBottom: theme.espaco.sm },
});
