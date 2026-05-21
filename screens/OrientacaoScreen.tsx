import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { theme } from '../constants/theme';
import { gerarOrientacao } from '../lib/orientacao';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Orientacao'>;

export default function OrientacaoScreen({ route, navigation }: Props) {
  const { humor, pet } = route.params;
  const info = gerarOrientacao(humor, pet);

  return (
    <TelaLayout>
      <View style={styles.iconTop}>
        <Ionicons name="checkmark-circle" size={56} color={theme.cores.verde} />
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

const styles = StyleSheet.create({
  iconTop: { alignItems: 'center', marginBottom: theme.espaco.sm },
  tituloPag: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: theme.cores.texto },
  subPag: { textAlign: 'center', color: theme.cores.textoClaro, marginBottom: theme.espaco.lg },
  badge: { fontSize: 12, fontWeight: '700', color: theme.cores.verde, marginBottom: 8 },
  titulo: { fontSize: 20, fontWeight: '800', color: theme.cores.texto, marginBottom: 8 },
  texto: { fontSize: 16, lineHeight: 24, color: theme.cores.texto },
  obsCard: { marginTop: theme.espaco.sm, backgroundColor: theme.cores.verdeClaro },
  obsTitulo: { fontWeight: '700', color: theme.cores.verdeEscuro },
  obsTxt: { marginTop: 8, lineHeight: 22, color: theme.cores.texto },
});
