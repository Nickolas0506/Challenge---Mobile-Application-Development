import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Card } from '../components/Card';
import { TelaLayout } from '../components/TelaLayout';
import { TituloSecao } from '../components/TituloSecao';
import type { Cores } from '../constants/cores';
import { theme } from '../constants/theme';
import { versaoApp } from '../config/versao';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';
import { usePreferenciaLembrete, useSalvarPreferenciaLembrete } from '../hooks/usePreferenciaLembrete';
import type { AppStackParamList } from '../navigation/types';
import { notificacaoService } from '../services/notificacaoService';
import { LEMBRETE_PADRAO, type PreferenciaTema } from '../services/preferenciasService';

const OPCOES_TEMA: { valor: PreferenciaTema; label: string; icone: keyof typeof Ionicons.glyphMap }[] = [
  { valor: 'sistema', label: 'Igual ao celular', icone: 'phone-portrait-outline' },
  { valor: 'claro', label: 'Claro', icone: 'sunny-outline' },
  { valor: 'escuro', label: 'Escuro', icone: 'moon-outline' },
];

const HORARIOS_LEMBRETE = [8, 12, 18, 20, 22];

type Props = NativeStackScreenProps<AppStackParamList, 'Configuracoes'>;

export default function ConfiguracoesScreen({ navigation }: Props) {
  const { cores, preferencia, definirPreferencia } = useTema();
  const styles = useEstilos(criarEstilos);
  const { data: lembrete = LEMBRETE_PADRAO } = usePreferenciaLembrete();
  const salvarLembrete = useSalvarPreferenciaLembrete();
  const [permitido, setPermitido] = useState<boolean | null>(null);

  useEffect(() => {
    void notificacaoService.temPermissao().then(setPermitido);
  }, []);

  async function permitirNotificacoes() {
    setPermitido(await notificacaoService.pedirPermissao());
  }

  return (
    <TelaLayout>
      <TituloSecao titulo="Notificacoes" dica="Alertas de saude e lembrete de check-in" />
      <Card>
        <View style={styles.linha}>
          <Ionicons
            name={permitido ? 'notifications' : 'notifications-off-outline'}
            size={22}
            color={permitido ? cores.verde : cores.vermelho}
          />
          <Text style={styles.linhaTxt}>
            {permitido === null
              ? 'Verificando permissao...'
              : permitido
                ? 'Notificacoes permitidas neste celular'
                : 'Notificacoes bloqueadas — voce nao sera avisado dos alertas'}
          </Text>
        </View>
        {permitido === false ? (
          <Botao texto="Permitir notificacoes" onPress={permitirNotificacoes} />
        ) : null}

        <View style={[styles.linha, styles.divisor]}>
          <Ionicons name="alarm-outline" size={22} color={cores.verde} />
          <Text style={styles.linhaTxt}>Lembrete diario de check-in</Text>
          <Switch
            value={lembrete.ativo}
            onValueChange={(ativo) => salvarLembrete.mutate({ ...lembrete, ativo })}
            trackColor={{ true: cores.verde }}
          />
        </View>
        {lembrete.ativo ? (
          <>
            <Text style={styles.dica}>
              Avisa no horario escolhido so se o check-in do dia ainda nao foi feito.
            </Text>
            <View style={styles.horarios}>
              {HORARIOS_LEMBRETE.map((hora) => {
                const ativo = lembrete.hora === hora;
                return (
                  <Pressable
                    key={hora}
                    style={[styles.chip, ativo && styles.chipAtivo]}
                    onPress={() => salvarLembrete.mutate({ ...lembrete, hora, minuto: 0 })}
                  >
                    <Text style={[styles.chipTxt, ativo && styles.chipTxtAtivo]}>
                      {String(hora).padStart(2, '0')}:00
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}
      </Card>

      <TituloSecao titulo="Aparencia" dica="Modo claro, escuro ou automatico" />
      <Card>
        {OPCOES_TEMA.map((op, i) => {
          const ativo = preferencia === op.valor;
          return (
            <Pressable
              key={op.valor}
              style={[styles.linha, i > 0 && styles.divisor]}
              onPress={() => definirPreferencia(op.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativo }}
            >
              <Ionicons name={op.icone} size={22} color={cores.verde} />
              <Text style={styles.linhaTxt}>{op.label}</Text>
              <Ionicons
                name={ativo ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={ativo ? cores.verde : cores.textoClaro}
              />
            </Pressable>
          );
        })}
      </Card>

      <TituloSecao titulo="Sobre" />
      <Card>
        <Pressable style={styles.linha} onPress={() => navigation.navigate('Sobre')}>
          <Ionicons name="information-circle-outline" size={22} color={cores.verde} />
          <Text style={styles.linhaTxt}>Sobre o App</Text>
          <Text style={styles.versao}>v{versaoApp.versao} · {versaoApp.commitCurto}</Text>
          <Ionicons name="chevron-forward" size={18} color={cores.textoClaro} />
        </Pressable>
      </Card>
      <View style={styles.rodape} />
    </TelaLayout>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.espaco.md,
      paddingVertical: 14,
    },
    divisor: { borderTopWidth: 1, borderTopColor: cores.borda },
    linhaTxt: { flex: 1, fontSize: 16, fontWeight: '600', color: cores.texto },
    dica: { fontSize: 13, color: cores.textoClaro, lineHeight: 19 },
    horarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 6 },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: theme.raio.pill,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
    chipAtivo: { backgroundColor: cores.verdeClaro, borderColor: cores.verde },
    chipTxt: { fontWeight: '700', color: cores.textoClaro },
    chipTxtAtivo: { color: cores.verdeEscuro },
    versao: { fontSize: 12, color: cores.textoClaro, fontFamily: 'monospace' },
    rodape: { height: theme.espaco.lg },
  });
