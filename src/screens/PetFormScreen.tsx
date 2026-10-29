import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { Seletor } from '../components/Seletor';
import { TelaLayout } from '../components/TelaLayout';
import type { Cores } from '../constants/cores';
import { OPCOES_ESPECIE } from '../constants/especies';
import { theme } from '../constants/theme';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import { useFormulario } from '../hooks/useFormulario';
import { useAtualizarPet, useCriarPet, usePet } from '../hooks/usePets';
import { avisar } from '../lib/confirmar';
import {
  FORMULARIO_PET_VAZIO,
  formularioParaPet,
  petParaFormulario,
  previaPet,
  validarFormularioPet,
} from '../lib/pet';
import type { AppStackParamList } from '../navigation/types';
import { galeriaService } from '../services/galeriaService';

type Props = NativeStackScreenProps<AppStackParamList, 'PetForm'>;

export default function PetFormScreen({ navigation, route }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const petId = route.params?.petId;
  const petQuery = usePet(petId);
  const criar = useCriarPet();
  const atualizar = useAtualizarPet();
  const { valores, alterar, redefinir } = useFormulario(FORMULARIO_PET_VAZIO);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (petQuery.data) redefinir(petParaFormulario(petQuery.data));
  }, [petQuery.data, redefinir]);

  async function escolherFoto() {
    try {
      const uri = await galeriaService.escolherFoto();
      if (uri) alterar('foto', uri);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Nao foi possivel abrir a galeria.');
    }
  }

  async function salvar() {
    setErro('');
    const erroValidacao = validarFormularioPet(valores);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const dados = formularioParaPet(valores, petQuery.data?.createdAt);
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
      avisar('Erro', msg);
    }
  }

  const preview = previaPet(valores);

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
          <Ionicons name="cloud-outline" size={22} color={cores.verde} />
          <Text style={styles.dicaTxt}>
            Este cadastro e enviado para a API HTTP. Depois de salvar, a lista atualiza sozinha.
          </Text>
        </View>
      </Card>

      <Text style={styles.secao}>Dados basicos</Text>
      <Campo label="Nome do pet *" value={valores.nome} onChange={(v) => alterar('nome', v)} placeholder="Ex: Luna" />
      <Seletor
        label="Especie"
        valor={valores.especieValor}
        opcoes={OPCOES_ESPECIE}
        onChange={(v) => alterar('especieValor', v)}
        placeholder="Toque para escolher"
        obrigatorio
      />
      {valores.especieValor === 'outro' ? (
        <Campo
          label="Qual animal? *"
          value={valores.especieOutro}
          onChange={(v) => alterar('especieOutro', v)}
          placeholder="Ex: Furao, Porquinho-da-india..."
        />
      ) : null}
      <Campo label="Raca" value={valores.raca} onChange={(v) => alterar('raca', v)} placeholder="SRD, Persa, Golden..." />
      <Campo
        label="Peso (kg)"
        value={valores.peso}
        onChange={(v) => alterar('peso', v)}
        placeholder="4.5"
        teclado="decimal-pad"
      />
      <Campo label="Idade" value={valores.idade} onChange={(v) => alterar('idade', v)} placeholder="2 anos, 8 meses..." />

      <Text style={styles.secao}>Outras caracteristicas</Text>
      <Campo
        label="Observacoes do pet"
        value={valores.caracteristicas}
        onChange={(v) => alterar('caracteristicas', v)}
        placeholder="Castrado, alergias, medicamentos..."
        multiline
      />

      <Text style={styles.secao}>Foto (opcional)</Text>
      <Pressable style={styles.fotoBox} onPress={() => void escolherFoto()}>
        {valores.foto ? (
          <Image source={{ uri: valores.foto }} style={styles.foto} />
        ) : (
          <View style={styles.fotoVazio}>
            <Ionicons name="camera-outline" size={32} color={cores.verde} />
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

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    scroll: { paddingBottom: 140 },
    dica: { marginBottom: theme.espaco.md },
    dicaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    dicaTxt: { flex: 1, fontSize: 14, color: cores.texto, lineHeight: 20 },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.verde,
      marginBottom: theme.espaco.sm,
      marginTop: theme.espaco.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    fotoBox: {
      height: 140,
      borderRadius: theme.raio.md,
      borderWidth: 1.5,
      borderColor: cores.borda,
      borderStyle: 'dashed',
      marginBottom: theme.espaco.md,
      overflow: 'hidden',
      backgroundColor: cores.superficie,
    },
    foto: { width: '100%', height: '100%' },
    fotoVazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    fotoTxt: { color: cores.verde, fontWeight: '600' },
    preview: { marginBottom: theme.espaco.sm },
    previewLabel: { fontWeight: '700', marginBottom: 6, color: cores.texto },
    previewTxt: { color: cores.textoClaro, lineHeight: 22, fontSize: 15 },
    erro: { color: cores.vermelho, fontWeight: '600', marginBottom: theme.espaco.sm },
  });
