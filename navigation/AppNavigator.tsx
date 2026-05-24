import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, View } from 'react-native';
import { BarraAbas } from '../components/BarraAbas';
import { LogoSolin } from '../components/LogoSolin';
import { theme } from '../constants/theme';
import { navegarAposLogin } from '../lib/navegacaoPosLogin';
import { Storage } from '../lib/storage';
import AlertasScreen from '../screens/AlertasScreen';
import CadastroPetScreen from '../screens/CadastroPetScreen';
import CheckinScreen from '../screens/CheckinScreen';
import MeuPetScreen from '../screens/MeuPetScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import OrientacaoScreen from '../screens/OrientacaoScreen';
import PasseioScreen from '../screens/PasseioScreen';
import type { RootStackParamList, TabParamList } from './types';
import { navigationRef } from './ref';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/** App aberto pelo QR — mantém sessão ao trocar de app durante a demo. */
const viaQr = process.env.EXPO_PUBLIC_VIA_QR === '1';

function AbasPrincipais() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      tabBar={(props) => <BarraAbas {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="MeuPet" component={MeuPetScreen} />
      <Tab.Screen name="Checkin" component={CheckinScreen} />
      <Tab.Screen name="Passeio" component={PasseioScreen} />
      <Tab.Screen name="Historico" component={HistoricoScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [carregando, setCarregando] = useState(true);
  const jaUsouApp = useRef(false);

  async function irParaLogin() {
    await Storage.encerrarSessao();
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }

  useEffect(() => {
    (async () => {
      await Storage.encerrarSessao();
      setCarregando(false);
    })();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (viaQr) return;
      if (!jaUsouApp.current) return;
      if (estado === 'background') {
        void Storage.encerrarSessao();
      }
      if (estado === 'active') {
        void (async () => {
          if (!(await Storage.isLogado())) await irParaLogin();
        })();
      }
    });
    return () => sub.remove();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loading}>
        <LogoSolin largura={200} />
        <ActivityIndicator size="large" color="#fff" style={styles.loadingSpinner} />
        <Text style={styles.loadingTxt}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: theme.cores.verde },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          contentStyle: { backgroundColor: theme.cores.fundo },
        }}
      >
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <LoginScreen
              {...props}
              onLogado={async () => {
                jaUsouApp.current = true;
                await navegarAposLogin(props.navigation);
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CadastroPet" options={{ headerShown: false }}>
          {(props) => (
            <CadastroPetScreen
              {...props}
              onSalvo={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs', params: { screen: 'Inicio' } }],
                });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MainTabs" options={{ headerShown: false }} component={AbasPrincipais} />

        <Stack.Screen
          name="Orientacao"
          component={OrientacaoScreen}
          options={{ title: 'Orientacao do dia' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.cores.verde,
  },
  loadingSpinner: { marginTop: theme.espaco.lg },
  loadingTxt: { marginTop: 12, color: 'rgba(255,255,255,0.9)' },
});
