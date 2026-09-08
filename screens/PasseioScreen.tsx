import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { useCriarPasseio } from '../hooks/usePasseios';
import { usePets } from '../hooks/usePets';
import type { TabParamList } from '../navigation/types';

function simNao(valor: boolean) {
  return valor ? 'sim' : 'nao';
}

export default function PasseioScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { data: pets } = usePets();
  const criar = useCriarPasseio();
  const [duracao, setDuracao] = useState('');
  const [agua, setAgua] = useState(true);
  const [urinou, setUrinou] = useState(true);
  const [urinaNormal, setUrinaNormal] = useState(true);
  const [fezes, setFezes] = useState(true);
  const [comportamentoNormal, setComportamentoNormal] = useState(true);
  const [obs, setObs] = useState('');

  function resetFormulario() {
    setDuracao('');
    setObs('');
    setAgua(true);
    setUrinou(true);
    setUrinaNormal(true);
    setFezes(true);
    setComportamentoNormal(true);
  }

  async function salvar() {
    if (!duracao.trim()) {
      Alert.alert('Falta a duracao', 'Informe quantos minutos durou o passeio.');
      return;
    }
    try {
      await criar.mutateAsync({
        petId: pets?.[0]?.id,
        data: new Date().toISOString(),
        duracaoMin: duracao.trim(),
        bebeuAgua: agua,
        urinou,
        urinaNormal: urinou ? urinaNormal : false,
        fezesNormais: fezes,
        comportamentoNormal,
        observacao: obs.trim(),
      });
      Alert.alert('Salvo', 'Passeio registrado na API. Veja na aba Historico.');
      resetFormulario();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao salvar o passeio.');
    }
  }

  const minutos = duracao.trim() || '—';
  const resumoUrina = urinou ? `Urina: ${urinaNormal ? 'normal' : 'alterada'}` : 'Urina: nao urinou';

  return (
    <TelaLayout keyboardShouldPersistTaps="always">
      <CabecalhoTela
        titulo="Apos o passeio"
        subtitulo="Registre agua, urina, fezes e comportamento. Os dados vao para a API."
        onVoltarInicio={() => navigation.navigate('Inicio')}
      />

      <Campo
        label="Duracao (minutos)"
        value={duracao}
        onChange={setDuracao}
        placeholder="20"
        teclado="numeric"
      />

      <Card style={styles.switchCard}>
        <View style={styles.switchRow}>
          <View style={styles.switchTextos}>
            <Text style={styles.switchLabel}>Bebeu agua?</Text>
            <Text style={styles.switchDica}>Durante ou logo apos o passeio</Text>
          </View>
          <Switch value={agua} onValueChange={setAgua} trackColor={{ true: theme.cores.verde }} />
        </View>
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchTextos}>
            <Text style={styles.switchLabel}>Urinou no passeio?</Text>
            <Text style={styles.switchDica}>Registrou xixi durante a caminhada</Text>
          </View>
          <Switch value={urinou} onValueChange={setUrinou} trackColor={{ true: theme.cores.verde }} />
        </View>
        {urinou ? (
          <>
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <View style={styles.switchTextos}>
                <Text style={styles.switchLabel}>Urina normal?</Text>
                <Text style={styles.switchDica}>Cor, frequencia e quantidade habituais</Text>
              </View>
              <Switch
                value={urinaNormal}
                onValueChange={setUrinaNormal}
                trackColor={{ true: theme.cores.verde }}
              />
            </View>
          </>
        ) : null}
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchTextos}>
            <Text style={styles.switchLabel}>Fezes normais?</Text>
            <Text style={styles.switchDica}>Consistencia e aspecto habituais</Text>
          </View>
          <Switch value={fezes} onValueChange={setFezes} trackColor={{ true: theme.cores.verde }} />
        </View>
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchTextos}>
            <Text style={styles.switchLabel}>Comportamento normal?</Text>
            <Text style={styles.switchDica}>Animo, energia e interacao como de costume</Text>
          </View>
          <Switch
            value={comportamentoNormal}
            onValueChange={setComportamentoNormal}
            trackColor={{ true: theme.cores.verde }}
          />
        </View>
      </Card>

      <Campo label="Observacoes" value={obs} onChange={setObs} placeholder="Opcional" multiline />

      <Card style={styles.preview}>
        <Text style={styles.previewLabel}>Resumo</Text>
        <Text style={styles.previewTxt}>
          {minutos} min · Agua: {simNao(agua)} · {resumoUrina}
        </Text>
        <Text style={styles.previewTxt}>
          Fezes: {fezes ? 'normais' : 'alteradas'} · Comportamento:{' '}
          {comportamentoNormal ? 'normal' : 'alterado'}
        </Text>
      </Card>

      <Botao texto="Salvar registro" onPress={() => void salvar()} carregando={criar.isPending} />
    </TelaLayout>
  );
}

const styles = StyleSheet.create({
  switchCard: { paddingVertical: 4 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: theme.espaco.sm,
  },
  switchTextos: { flex: 1 },
  divider: { height: 1, backgroundColor: theme.cores.borda },
  switchLabel: { fontSize: 16, fontWeight: '600', color: theme.cores.texto },
  switchDica: { fontSize: 12, color: theme.cores.textoClaro, marginTop: 2, lineHeight: 16 },
  preview: { backgroundColor: theme.cores.verdeClaro, marginTop: theme.espaco.sm },
  previewLabel: { fontSize: 12, fontWeight: '700', color: theme.cores.verdeEscuro },
  previewTxt: { fontSize: 14, color: theme.cores.texto, marginTop: 6, lineHeight: 20 },
});
