import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, View } from 'react-native';
import { BarraAbas } from '../components/BarraAbas';
import { theme } from '../constants/theme';
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AbasPrincipais() {
  return (
    <Tab.Navigator
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
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const jaUsouApp = useRef(false);

  async function irParaLogin() {
    await Storage.encerrarSessao();
    if (navRef.isReady()) {
      navRef.reset({ index: 0, routes: [{ name: 'Login' }] });
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
        <ActivityIndicator size="large" color={theme.cores.verde} />
        <Text style={styles.loadingTxt}>Carregando SOLIN...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navRef}>
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
              onLogado={() => {
                jaUsouApp.current = true;
                props.navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CadastroPet" options={{ headerShown: false }}>
          {(props) => (
            <CadastroPetScreen
              {...props}
              onSalvo={() => {
                props.navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
    backgroundColor: theme.cores.fundo,
  },
  loadingTxt: { marginTop: 12, color: theme.cores.textoClaro },
});
