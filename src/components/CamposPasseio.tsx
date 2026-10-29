import { Fragment } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import type { Cores } from '../constants/cores';
import { theme } from '../constants/theme';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import type { FormularioPasseio } from '../lib/passeio';
import { Campo } from './Campo';
import { Card } from './Card';

type CampoBooleano = 'bebeuAgua' | 'urinou' | 'urinaNormal' | 'fezesNormais' | 'comportamentoNormal';

const PERGUNTAS: { campo: CampoBooleano; label: string; dica: string }[] = [
  { campo: 'bebeuAgua', label: 'Bebeu agua?', dica: 'Durante ou logo apos o passeio' },
  { campo: 'urinou', label: 'Urinou no passeio?', dica: 'Registrou xixi durante a caminhada' },
  { campo: 'urinaNormal', label: 'Urina normal?', dica: 'Cor, frequencia e quantidade habituais' },
  { campo: 'fezesNormais', label: 'Fezes normais?', dica: 'Consistencia e aspecto habituais' },
  {
    campo: 'comportamentoNormal',
    label: 'Comportamento normal?',
    dica: 'Animo, energia e interacao como de costume',
  },
];

type Props = {
  valores: FormularioPasseio;
  alterar: <K extends keyof FormularioPasseio>(campo: K, valor: FormularioPasseio[K]) => void;
};

/** Campos do registro pos-passeio, compartilhados entre criar e editar. */
export function CamposPasseio({ valores, alterar }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const perguntas = PERGUNTAS.filter((p) => p.campo !== 'urinaNormal' || valores.urinou);

  return (
    <>
      <Campo
        label="Duracao (minutos) *"
        value={valores.duracao}
        onChange={(v) => alterar('duracao', v)}
        placeholder="20"
        teclado="numeric"
      />

      <Card style={styles.card}>
        {perguntas.map((p, i) => (
          <Fragment key={p.campo}>
            {i > 0 ? <View style={styles.divisor} /> : null}
            <View style={styles.linha}>
              <View style={styles.textos}>
                <Text style={styles.label}>{p.label}</Text>
                <Text style={styles.dica}>{p.dica}</Text>
              </View>
              <Switch
                value={valores[p.campo]}
                onValueChange={(v) => alterar(p.campo, v)}
                trackColor={{ true: cores.verde }}
              />
            </View>
          </Fragment>
        ))}
      </Card>

      <Campo
        label="Observacoes"
        value={valores.observacao}
        onChange={(v) => alterar('observacao', v)}
        placeholder="Opcional"
        multiline
      />
    </>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    card: { paddingVertical: 4, marginBottom: theme.espaco.md },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
      gap: theme.espaco.sm,
    },
    textos: { flex: 1 },
    divisor: { height: 1, backgroundColor: cores.borda },
    label: { fontSize: 16, fontWeight: '600', color: cores.texto },
    dica: { fontSize: 12, color: cores.textoClaro, marginTop: 2, lineHeight: 16 },
  });
