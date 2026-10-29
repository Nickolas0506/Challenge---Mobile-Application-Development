import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { gerarOrientacao } from '../lib/orientacao';
import type { AppStackParamList } from '../navigation/types';
import type { Cores } from '../constants/cores';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

type Props = NativeStackScreenProps<AppStackParamList, 'Orientacao'>;

export default function OrientacaoScreen({ route, navigation }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const { humor, pet } = route.params;
  const info = gerarOrientacao(humor, pet);

  return (
    <TelaLayout>
      <View style={styles.iconTop}>
        <Ionicons name="checkmark-circle" size={56} color={cores.verde} />
      </View>
      <Text style={styles.tituloPag}>Check-in salvo!</Text>
      <Text style={styles.subPag}>Orientacao para {pet}</Text>

      <Card destaque>
        <Text style={styles.badge}>Sem diagnostico medico</Text>
        <Text style={styles.titulo}>{info.titulo}</Text>
        <Text style={styles.texto}>{info.texto}</Text>
      </Card>

      <Card style={styles.obsCard}>
        <Text style={styles.obsTitulo}>Observe nas proximas horas</Text>
        <Text style={styles.obsTxt}>{info.observar}</Text>
      </Card>

      <Botao
        texto="Voltar ao inicio"
        onPress={() => navigation.navigate('MainTabs', { screen: 'Inicio' })}
      />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    iconTop: { alignItems: 'center', marginBottom: theme.espaco.sm },
    tituloPag: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: cores.texto },
    subPag: { textAlign: 'center', color: cores.textoClaro, marginBottom: theme.espaco.lg },
    badge: { fontSize: 12, fontWeight: '700', color: cores.verde, marginBottom: 8 },
    titulo: { fontSize: 20, fontWeight: '800', color: cores.texto, marginBottom: 8 },
    texto: { fontSize: 16, lineHeight: 24, color: cores.texto },
    obsCard: { marginTop: theme.espaco.sm, backgroundColor: cores.verdeClaro },
    obsTitulo: { fontWeight: '700', color: cores.verdeEscuro },
    obsTxt: { marginTop: 8, lineHeight: 22, color: cores.texto },
  });
