import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import { carregarDadosDemonstracao } from '../lib/dadosIniciais';
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

  async function entrarDemo() {
    setSalvando(true);
    try {
      await Storage.setTutor({ nome: 'Nickolas', email: 'nickolas@gmail.com' });
      await Storage.setLogado(true);
      await carregarDadosDemonstracao('Nickolas');
      onLogado();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topo}>
              <Text style={styles.marca}>SOLIN</Text>
              <Text style={styles.slogan}>O cuidado que protege o seu pet</Text>
            </View>

            <View style={styles.formArea}>
              <Card>
                <Text style={styles.titulo}>Bem-vindo</Text>
                <Text style={styles.sub}>Entre para acompanhar a rotina do seu pet</Text>

                <Campo label="Seu nome" value={nome} onChange={setNome} placeholder="Ex: Nickolas" />
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
                <Botao texto="Testar com dados de exemplo" onPress={entrarDemo} secundario />
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.cores.verde },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  emailDica: {
    fontSize: 12,
    color: theme.cores.textoClaro,
    marginTop: -8,
    marginBottom: theme.espaco.md,
  },
  topo: {
    paddingTop: theme.espaco.xl,
    paddingHorizontal: theme.espaco.lg,
    alignItems: 'center',
  },
  marca: { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: 3 },
  slogan: { fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 8, textAlign: 'center' },
  formArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.espaco.md,
    paddingBottom: theme.espaco.lg,
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
