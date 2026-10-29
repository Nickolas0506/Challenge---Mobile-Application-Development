import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CamposPasseio } from '../components/CamposPasseio';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import type { Cores } from '../constants/cores';
import { theme } from '../constants/theme';
import { useEstilos } from '../hooks/useEstilos';
import { useFormulario } from '../hooks/useFormulario';
import { useCriarPasseio } from '../hooks/usePasseios';
import { usePets } from '../hooks/usePets';
import { avisar } from '../lib/confirmar';
import {
  FORMULARIO_PASSEIO_VAZIO,
  formularioParaPasseio,
  resumoPasseio,
  validarFormularioPasseio,
} from '../lib/passeio';
import type { AppStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Passeio'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function PasseioScreen({ navigation }: Props) {
  const styles = useEstilos(criarEstilos);
  const { data: pets } = usePets();
  const criar = useCriarPasseio();
  const { valores, alterar, redefinir } = useFormulario(FORMULARIO_PASSEIO_VAZIO);

  async function salvar() {
    const erro = validarFormularioPasseio(valores);
    if (erro) {
      avisar('Confira o registro', erro);
      return;
    }
    try {
      await criar.mutateAsync(
        formularioParaPasseio(valores, { petId: pets?.[0]?.id, data: new Date().toISOString() })
      );
      avisar('Salvo', 'Passeio registrado na API. Veja na aba Historico.');
      redefinir(FORMULARIO_PASSEIO_VAZIO);
    } catch (e) {
      avisar('Erro', e instanceof Error ? e.message : 'Falha ao salvar o passeio.');
    }
  }

  return (
    <TelaLayout keyboardShouldPersistTaps="always">
      <CabecalhoTela
        titulo="Apos o passeio"
        subtitulo="Registre agua, urina, fezes e comportamento. Os dados vao para a API."
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      <CamposPasseio valores={valores} alterar={alterar} />

      <Card style={styles.preview}>
        <Text style={styles.previewLabel}>Resumo</Text>
        {resumoPasseio(valores).map((linha) => (
          <Text key={linha} style={styles.previewTxt}>
            {linha}
          </Text>
        ))}
      </Card>

      <Botao texto="Salvar registro" onPress={() => void salvar()} carregando={criar.isPending} />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    preview: { backgroundColor: cores.verdeClaro, marginTop: theme.espaco.sm },
    previewLabel: { fontSize: 12, fontWeight: '700', color: cores.verdeEscuro },
    previewTxt: { fontSize: 14, color: cores.texto, marginTop: 6, lineHeight: 20 },
  });
