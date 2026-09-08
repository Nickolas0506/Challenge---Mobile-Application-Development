import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useAtualizarPasseio, usePasseio, useRemoverPasseio } from '../hooks/usePasseios';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'PasseioEditar'>;

export default function PasseioEditarScreen({ navigation, route }: Props) {
  const { passeioId } = route.params;
  const { data, isLoading, isError, refetch } = usePasseio(passeioId);
  const atualizar = useAtualizarPasseio();
  const remover = useRemoverPasseio();

  const [duracao, setDuracao] = useState('');
  const [agua, setAgua] = useState(true);
  const [urinou, setUrinou] = useState(true);
  const [urinaNormal, setUrinaNormal] = useState(true);
  const [fezes, setFezes] = useState(true);
  const [comportamentoNormal, setComportamentoNormal] = useState(true);
  const [obs, setObs] = useState('');

  useEffect(() => {
    if (!data) return;
    setDuracao(data.duracaoMin);
    setAgua(data.bebeuAgua);
    setUrinou(data.urinou);
    setUrinaNormal(data.urinaNormal);
    setFezes(data.fezesNormais);
    setComportamentoNormal(data.comportamentoNormal);
    setObs(data.observacao);
  }, [data]);

  async function salvar() {
    if (!data) return;
    if (!duracao.trim()) {
      Alert.alert('Falta a duracao', 'Informe os minutos.');
      return;
    }
    try {
      await atualizar.mutateAsync({
        id: data.id,
        dados: {
          petId: data.petId,
          data: data.data,
          duracaoMin: duracao.trim(),
          bebeuAgua: agua,
          urinou,
          urinaNormal: urinou ? urinaNormal : false,
          fezesNormais: fezes,
          comportamentoNormal,
          observacao: obs.trim(),
        },
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao atualizar.');
    }
  }

  function excluir() {
    Alert.alert('Excluir passeio', 'Remover este registro da API?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await remover.mutateAsync(passeioId);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao excluir.');
          }
        },
      },
    ]);
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
      <Campo label="Duracao (minutos)" value={duracao} onChange={setDuracao} teclado="numeric" />
      <Card style={styles.switchCard}>
        <Linha label="Bebeu agua?" valor={agua} onChange={setAgua} />
        <Linha label="Urinou?" valor={urinou} onChange={setUrinou} />
        {urinou ? <Linha label="Urina normal?" valor={urinaNormal} onChange={setUrinaNormal} /> : null}
        <Linha label="Fezes normais?" valor={fezes} onChange={setFezes} />
        <Linha label="Comportamento normal?" valor={comportamentoNormal} onChange={setComportamentoNormal} />
      </Card>
      <Campo label="Observacoes" value={obs} onChange={setObs} multiline />
      <Botao texto="Salvar alteracoes" onPress={() => void salvar()} carregando={atualizar.isPending} />
      <Botao texto="Excluir passeio" onPress={excluir} perigo carregando={remover.isPending} />
    </TelaLayout>
  );
}

function Linha({
  label,
  valor,
  onChange,
}: {
  label: string;
  valor: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={valor} onValueChange={onChange} trackColor={{ true: theme.cores.verde }} />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '800', color: theme.cores.texto, marginBottom: theme.espaco.md },
  switchCard: { paddingVertical: 4 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabel: { fontSize: 16, fontWeight: '600', color: theme.cores.texto },
});
