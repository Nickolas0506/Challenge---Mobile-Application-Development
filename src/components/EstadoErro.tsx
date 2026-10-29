import { StyleSheet, Text } from 'react-native';
import { Botao } from './Botao';
import { Card } from './Card';
import type { Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

type Props = {
  mensagem?: string;
  onTentar?: () => void;
};

export function EstadoErro({
  mensagem = 'Nao foi possivel falar com a API. Confira se o backend esta rodando.',
  onTentar,
}: Props) {
  const styles = useEstilos(criarEstilos);
  return (
    <Card style={styles.card}>
      <Text style={styles.titulo}>Erro de conexao</Text>
      <Text style={styles.msg}>{mensagem}</Text>
      {onTentar ? <Botao texto="Tentar novamente" onPress={onTentar} /> : null}
    </Card>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    card: { backgroundColor: cores.erroFundo, borderWidth: 1, borderColor: cores.vermelho },
    titulo: { fontWeight: '800', color: cores.vermelho, fontSize: 16 },
    msg: { marginTop: 8, color: cores.texto, lineHeight: 20 },
  });
