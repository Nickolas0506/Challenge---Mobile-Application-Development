import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { LogoSolin } from '../components/LogoSolin';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import { Storage } from '../lib/storage';
import { validarEmailGmail } from '../lib/validacao';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLogado: () => void;
};

export default function LoginScreen({ onLogado }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function entrar() {
    if (!nome.trim() || !senha.trim()) {
      Alert.alert('Preencha os campos', 'Nome e senha sao obrigatorios.');
      return;
    }
    const erroEmail = validarEmailGmail(email);
    if (erroEmail) {
      Alert.alert('E-mail invalido', erroEmail);
      return;
    }
    setSalvando(true);
    try {
      await Storage.setTutor({ nome: nome.trim(), email: email.trim().toLowerCase() });
      await Storage.setLogado(true);
      onLogado();
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
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topo}>
            <LogoSolin largura={250} />
          </View>

          <View style={styles.formArea}>
            <Card style={styles.card}>
              <Text style={styles.titulo}>Bem-vindo</Text>
              <Text style={styles.sub}>Entre para acompanhar a rotina do seu pet</Text>

              <Campo label="Seu nome" value={nome} onChange={setNome} placeholder="Seu nome" />
              <Campo
                label="E-mail *"
                value={email}
                onChange={setEmail}
                placeholder="seunome@gmail.com"
                teclado="email-address"
              />
              <Text style={styles.emailDica}>Obrigatorio: @ e gmail.com</Text>
              <Campo label="Senha" value={senha} onChange={setSenha} placeholder="******" seguro />

              {(nome || email) ? (
                <View style={styles.preview}>
                  <Text style={styles.previewTxt}>
                    Entrando como <Text style={{ fontWeight: '700' }}>{nome || '...'}</Text>
                  </Text>
                </View>
              ) : null}

              <Botao texto="Entrar" onPress={entrar} carregando={salvando} />
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
  formArea: {
    paddingHorizontal: theme.espaco.md,
    paddingTop: 6,
  },
  card: {
    borderTopLeftRadius: theme.raio.lg,
    borderTopRightRadius: theme.raio.lg,
  },
  emailDica: {
    fontSize: 12,
    color: theme.cores.textoClaro,
    marginTop: -8,
    marginBottom: theme.espaco.md,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: theme.cores.texto },
  sub: { fontSize: 14, color: theme.cores.textoClaro, marginBottom: theme.espaco.lg, marginTop: 4 },
  preview: {
    backgroundColor: theme.cores.verdeClaro,
    padding: 10,
    borderRadius: theme.raio.sm,
    marginBottom: theme.espaco.sm,
  },
  previewTxt: { fontSize: 13, color: theme.cores.texto },
});
