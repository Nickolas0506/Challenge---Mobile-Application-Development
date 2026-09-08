import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { Seletor } from '../components/Seletor';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useAlertas, useAtualizarAlerta, useCriarAlerta } from '../hooks/useAlertas';
import type { AppStackParamList } from '../navigation/types';
import type { TipoAlerta } from '../types/models';

const TIPOS = [
  { value: 'checkin', label: 'Rotina / check-in' },
  { value: 'passeio', label: 'Passeio' },
  { value: 'vacina', label: 'Vacina' },
  { value: 'iot', label: 'Sensor' },
];

type Props = NativeStackScreenProps<AppStackParamList, 'AlertaForm'>;

export default function AlertaFormScreen({ navigation, route }: Props) {
  const alertaId = route.params?.alertaId;
  const { data: alertas, isLoading } = useAlertas();
  const criar = useCriarAlerta();
  const atualizar = useAtualizarAlerta();
  const atual = alertas?.find((a) => a.id === alertaId);

  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    if (!atual) return;
    setTitulo(atual.titulo);
    setMensagem(atual.mensagem);
    setTipo(atual.tipo);
  }, [atual]);

  async function salvar() {
    if (!titulo.trim() || !mensagem.trim() || !tipo) {
      Alert.alert('Preencha os campos', 'Titulo, mensagem e tipo sao obrigatorios.');
      return;
    }
    try {
      if (alertaId && atual) {
        await atualizar.mutateAsync({
          id: alertaId,
          dados: {
            userId: atual.userId,
            titulo: titulo.trim(),
            mensagem: mensagem.trim(),
            tipo: tipo as TipoAlerta,
            lido: atual.lido,
            data: atual.data,
          },
        });
      } else {
        await criar.mutateAsync({
          titulo: titulo.trim(),
          mensagem: mensagem.trim(),
          tipo: tipo as TipoAlerta,
          lido: false,
          data: new Date().toISOString(),
        });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao salvar alerta.');
    }
  }

  if (alertaId && isLoading) {
    return (
      <TelaLayout>
        <EstadoCarregando texto="Carregando alerta..." />
      </TelaLayout>
    );
  }

  return (
    <TelaLayout>
      <Text style={styles.titulo}>{alertaId ? 'Editar alerta' : 'Novo alerta'}</Text>
      <Text style={styles.sub}>O registro e persistido na API HTTP.</Text>
      <Campo label="Titulo *" value={titulo} onChange={setTitulo} placeholder="Ex: Vacina V10" />
      <Campo
        label="Mensagem *"
        value={mensagem}
        onChange={setMensagem}
        placeholder="Descreva o lembrete"
        multiline
      />
      <Seletor
        label="Tipo"
        valor={tipo}
        opcoes={TIPOS}
        onChange={setTipo}
        placeholder="Toque para escolher"
        obrigatorio
      />
      <Botao
        texto={alertaId ? 'Salvar alteracoes' : 'Criar alerta'}
        onPress={() => void salvar()}
        carregando={criar.isPending || atualizar.isPending}
      />
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '800', color: theme.cores.texto },
  sub: { color: theme.cores.textoClaro, marginBottom: theme.espaco.lg, marginTop: 6 },
});
