import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { TituloSecao } from '../components/TituloSecao';
import type { Cores } from '../constants/cores';
import { theme } from '../constants/theme';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import type { AppStackParamList } from '../navigation/types';
import type { PreferenciaTema } from '../services/preferenciasService';

const OPCOES_TEMA: { valor: PreferenciaTema; label: string; icone: keyof typeof Ionicons.glyphMap }[] = [
  { valor: 'sistema', label: 'Igual ao celular', icone: 'phone-portrait-outline' },
  { valor: 'claro', label: 'Claro', icone: 'sunny-outline' },
  { valor: 'escuro', label: 'Escuro', icone: 'moon-outline' },
];

type Props = NativeStackScreenProps<AppStackParamList, 'Configuracoes'>;

export default function ConfiguracoesScreen(_props: Props) {
  const { cores, preferencia, definirPreferencia } = useTema();
  const styles = useEstilos(criarEstilos);

  return (
    <TelaLayout>
      <TituloSecao titulo="Aparencia" dica="Modo claro, escuro ou automatico" />
      <Card>
        {OPCOES_TEMA.map((op, i) => {
          const ativo = preferencia === op.valor;
          return (
            <Pressable
              key={op.valor}
              style={[styles.opcao, i > 0 && styles.divisor]}
              onPress={() => definirPreferencia(op.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativo }}
            >
              <Ionicons name={op.icone} size={22} color={cores.verde} />
              <Text style={styles.opcaoTxt}>{op.label}</Text>
              <Ionicons
                name={ativo ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={ativo ? cores.verde : cores.textoClaro}
              />
            </Pressable>
          );
        })}
      </Card>
      <View style={styles.rodape} />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.espaco.md,
      paddingVertical: 14,
    },
    divisor: { borderTopWidth: 1, borderTopColor: cores.borda },
    opcaoTxt: { flex: 1, fontSize: 16, fontWeight: '600', color: cores.texto },
    rodape: { height: theme.espaco.lg },
  });
