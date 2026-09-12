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
import { useAuth } from '../contexts/AuthContext';
import { validarEmail, validarSenha } from '../lib/validacao';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function enviar() {
    setErro('');
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

    setSalvando(true);
    try {
      await entrar(email.trim().toLowerCase(), senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Nao foi possivel entrar.');
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
            <LogoSolin largura={250} />
          </View>

          <View style={styles.formArea}>
            <Card style={styles.card}>
              <Text style={styles.titulo}>Bem-vindo</Text>
              <Text style={styles.sub}>Entre para acompanhar a rotina do seu pet</Text>

              <Campo
                label="E-mail *"
                value={email}
                onChange={setEmail}
                placeholder="seunome@gmail.com"
                teclado="email-address"
              />
              <Campo label="Senha *" value={senha} onChange={setSenha} placeholder="******" seguro />

              {erro ? <Text style={styles.erro}>{erro}</Text> : null}

              <Botao texto="Entrar" onPress={enviar} carregando={salvando} />

              <Pressable
                style={styles.linkBox}
                onPress={() => navigation.navigate('Cadastro')}
              >
                <Text style={styles.link}>
                  Nao tem conta? <Text style={styles.linkForte}>Cadastre-se</Text>
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
