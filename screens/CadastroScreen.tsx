import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { LogoSolin } from '../components/LogoSolin';
import { theme } from '../constants/theme';
import { firebaseConfigurado } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { validarEmail, validarNome, validarSenha } from '../lib/validacao';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Cadastro'>;

export default function CadastroScreen({ navigation }: Props) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function enviar() {
    setErro('');
    const erroNome = validarNome(nome);
    if (erroNome) {
      setErro(erroNome);
      return;
    }
    const erroEmail = validarEmail(email);
    if (erroEmail) {
      setErro(erroEmail);
      return;
    }
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      setErro(erroSenha);
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas nao coincidem.');
      return;
    }

    setSalvando(true);
    try {
      await cadastrar(nome.trim(), email.trim().toLowerCase(), senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Nao foi possivel cadastrar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topo}>
            <LogoSolin largura={200} />
          </View>

          <View style={styles.formArea}>
            <Card style={styles.card}>
              <Text style={styles.titulo}>Criar conta</Text>
              <Text style={styles.sub}>Cadastre-se para proteger a rotina do seu pet</Text>

              {!firebaseConfigurado() ? (
                <Text style={styles.erro}>
                  Configure o Firebase no arquivo .env (veja o README) para o cadastro funcionar.
                </Text>
              ) : null}

              <Campo label="Seu nome *" value={nome} onChange={setNome} placeholder="Seu nome" />
              <Campo
                label="E-mail *"
                value={email}
                onChange={setEmail}
                placeholder="seunome@gmail.com"
                teclado="email-address"
              />
              <Campo label="Senha *" value={senha} onChange={setSenha} placeholder="Minimo 6 caracteres" seguro />
              <Campo
                label="Confirmar senha *"
                value={confirmar}
                onChange={setConfirmar}
                placeholder="Repita a senha"
                seguro
              />

              {erro ? <Text style={styles.erro}>{erro}</Text> : null}

              <Botao texto="Cadastrar" onPress={enviar} carregando={salvando} />

              <Pressable style={styles.linkBox} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>
                  Ja tem conta? <Text style={styles.linkForte}>Entrar</Text>
                </Text>
              </Pressable>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.cores.verde },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: theme.espaco.lg },
  topo: {
    paddingTop: theme.espaco.md,
    paddingBottom: 14,
    paddingHorizontal: theme.espaco.md,
    alignItems: 'center',
  },
  formArea: { paddingHorizontal: theme.espaco.md, paddingTop: 6 },
  card: {
    borderTopLeftRadius: theme.raio.lg,
    borderTopRightRadius: theme.raio.lg,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: theme.cores.texto },
  sub: { fontSize: 14, color: theme.cores.textoClaro, marginBottom: theme.espaco.lg, marginTop: 4 },
  erro: { color: theme.cores.vermelho, marginBottom: theme.espaco.sm, fontWeight: '600' },
  linkBox: { marginTop: theme.espaco.md, paddingVertical: 8, alignItems: 'center' },
  link: { color: theme.cores.textoClaro, fontSize: 14 },
  linkForte: { color: theme.cores.verde, fontWeight: '800' },
});
