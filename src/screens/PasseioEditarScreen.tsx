import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Botao } from '../components/Botao';
import { CamposPasseio } from '../components/CamposPasseio';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { TelaLayout } from '../components/TelaLayout';
import type { Cores } from '../constants/cores';
import { theme } from '../constants/theme';
import { useEstilos } from '../hooks/useEstilos';
import { useFormulario } from '../hooks/useFormulario';
import { useAtualizarPasseio, usePasseio, useRemoverPasseio } from '../hooks/usePasseios';
import { avisar, confirmar } from '../lib/confirmar';
import {
  FORMULARIO_PASSEIO_VAZIO,
  formularioParaPasseio,
  passeioParaFormulario,
  validarFormularioPasseio,
} from '../lib/passeio';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'PasseioEditar'>;

export default function PasseioEditarScreen({ navigation, route }: Props) {
  const styles = useEstilos(criarEstilos);
  const { passeioId } = route.params;
  const { data, isLoading, isError, refetch } = usePasseio(passeioId);
  const atualizar = useAtualizarPasseio();
  const remover = useRemoverPasseio();
  const { valores, alterar, redefinir } = useFormulario(FORMULARIO_PASSEIO_VAZIO);

  useEffect(() => {
    if (data) redefinir(passeioParaFormulario(data));
  }, [data, redefinir]);

  async function salvar() {
    if (!data) return;
    const erro = validarFormularioPasseio(valores);
    if (erro) {
      avisar('Confira o registro', erro);
      return;
    }
    try {
      await atualizar.mutateAsync({
        id: data.id,
        dados: formularioParaPasseio(valores, { petId: data.petId, data: data.data }),
      });
      navigation.goBack();
    } catch (e) {
      avisar('Erro', e instanceof Error ? e.message : 'Falha ao atualizar.');
    }
  }

  function excluir() {
    confirmar('Excluir passeio', 'Remover este registro da API?', async () => {
      try {
        await remover.mutateAsync(passeioId);
        navigation.goBack();
      } catch (e) {
        avisar('Erro', e instanceof Error ? e.message : 'Falha ao excluir.');
      }
    });
  }

  if (isLoading) {
    return (
      <TelaLayout>
        <EstadoCarregando texto="Carregando passeio..." />
      </TelaLayout>
    );
  }

  if (isError || !data) {
    return (
      <TelaLayout>
        <EstadoErro onTentar={() => void refetch()} />
      </TelaLayout>
    );
  }

  return (
    <TelaLayout>
      <Text style={styles.titulo}>Editar passeio</Text>
      <CamposPasseio valores={valores} alterar={alterar} />
      <Botao texto="Salvar alteracoes" onPress={() => void salvar()} carregando={atualizar.isPending} />
      <Botao texto="Excluir passeio" onPress={excluir} perigo carregando={remover.isPending} />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    titulo: { fontSize: 22, fontWeight: '800', color: cores.texto, marginBottom: theme.espaco.md },
  });
