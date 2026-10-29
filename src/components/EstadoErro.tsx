import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { Botao } from './Botao';
import { Card } from './Card';

type Props = {
  mensagem?: string;
  onTentar?: () => void;
};

export function EstadoErro({
  mensagem = 'Nao foi possivel falar com a API. Confira se o backend esta rodando.',
  onTentar,
}: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.titulo}>Erro de conexao</Text>
      <Text style={styles.msg}>{mensagem}</Text>
      {onTentar ? <Botao texto="Tentar novamente" onPress={onTentar} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF0EB', borderWidth: 1, borderColor: theme.cores.vermelho },
  titulo: { fontWeight: '800', color: theme.cores.vermelho, fontSize: 16 },
  msg: { marginTop: 8, color: theme.cores.texto, lineHeight: 20 },
});
