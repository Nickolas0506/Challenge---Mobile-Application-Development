import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { LogoSolin } from '../components/LogoSolin';
import { TelaLayout } from '../components/TelaLayout';
import { TituloSecao } from '../components/TituloSecao';
import { getApiUrl } from '../config/api';
import { versaoApp } from '../config/versao';
import type { Cores } from '../constants/cores';
import { EQUIPE } from '../constants/equipe';
import { theme } from '../constants/theme';
import { useTema } from '../contexts/TemaContext';
import { useEstilos } from '../hooks/useEstilos';

function formatarData(iso?: string) {
  return iso ? new Date(iso).toLocaleString('pt-BR') : '-';
}

export default function SobreScreen() {
  const { cores } = useTema();
  const styles = useEstilos(criarEstilos);
  const linkCommit = versaoApp.repositorio ? `${versaoApp.repositorio}/commit/${versaoApp.commit}` : null;

  return (
    <TelaLayout>
      <View style={styles.logo}>
        <LogoSolin largura={150} />
      </View>
      <Text style={styles.nome}>SOLIN</Text>
      <Text style={styles.slogan}>O cuidado que protege o seu pet · Clyvo Vet</Text>

      <TituloSecao titulo="Versao publicada" />
      <Card>
        <Linha rotulo="Versao" valor={`${versaoApp.versao} (build ${versaoApp.versionCode ?? '-'})`} />
        <Text style={styles.rotulo}>Commit de referencia</Text>
        <Text style={styles.hash} selectable>
          {versaoApp.commitCurto}
        </Text>
        <Text style={styles.hashCompleto} selectable>
          {versaoApp.commit}
        </Text>
        {versaoApp.alteracoesPendentes ? (
          <Text style={styles.aviso}>Build de desenvolvimento: havia alteracoes sem commit.</Text>
        ) : null}
        <Linha rotulo="Data do commit" valor={formatarData(versaoApp.commitData)} />
        <Linha rotulo="Data do build" valor={formatarData(versaoApp.dataBuild)} />
        <Linha rotulo="API" valor={getApiUrl()} />
        {linkCommit ? (
          <Pressable style={styles.link} onPress={() => void Linking.openURL(linkCommit)}>
            <Ionicons name="logo-github" size={18} color={cores.verde} />
            <Text style={styles.linkTxt}>Ver este commit no GitHub</Text>
          </Pressable>
        ) : null}
      </Card>

      <TituloSecao titulo="O que o app faz" />
      <Card>
        <Text style={styles.texto}>
          Check-in diario de humor, registro pos-passeio, cadastro dos pets, historico e alertas.
          A API analisa cada registro e gera alertas automaticos (urina alterada, check-in ruim, uso
          excessivo da caixa de areia), que chegam como notificacao no celular.
        </Text>
      </Card>

      <TituloSecao titulo="Equipe" dica="FIAP · Challenge 2026" />
      <Card style={styles.ultimo}>
        {EQUIPE.map((m) => (
          <Linha key={m.rm} rotulo={m.nome} valor={`RM ${m.rm}`} />
        ))}
      </Card>
    </TelaLayout>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  const styles = useEstilos(criarEstilos);
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor} selectable>
        {valor}
      </Text>
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    logo: { alignItems: 'center', borderRadius: theme.raio.lg, overflow: 'hidden', alignSelf: 'center' },
    nome: { fontSize: 26, fontWeight: '800', color: cores.texto, textAlign: 'center', marginTop: theme.espaco.md },
    slogan: { fontSize: 14, color: cores.textoClaro, textAlign: 'center', marginTop: 4 },
    linha: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.espaco.md, paddingVertical: 6 },
    rotulo: { fontSize: 13, color: cores.textoClaro, fontWeight: '600' },
    valor: { flexShrink: 1, fontSize: 14, color: cores.texto, textAlign: 'right' },
    hash: {
      fontSize: 30,
      fontWeight: '800',
      color: cores.verde,
      fontFamily: 'monospace',
      letterSpacing: 2,
      marginTop: 4,
    },
    hashCompleto: { fontSize: 11, color: cores.textoClaro, fontFamily: 'monospace', marginBottom: theme.espaco.sm },
    aviso: { fontSize: 12, color: cores.vermelho, fontWeight: '700', marginBottom: theme.espaco.sm },
    link: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: theme.espaco.sm, paddingVertical: 6 },
    linkTxt: { color: cores.verde, fontWeight: '700' },
    texto: { fontSize: 14, color: cores.texto, lineHeight: 21 },
    ultimo: { marginBottom: theme.espaco.lg },
  });
