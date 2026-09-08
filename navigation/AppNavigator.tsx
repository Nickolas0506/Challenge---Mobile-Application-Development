import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BarraAbas } from '../components/BarraAbas';
import { LogoSolin } from '../components/LogoSolin';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import AlertasScreen from '../screens/AlertasScreen';
import AlertaFormScreen from '../screens/AlertaFormScreen';
import CadastroScreen from '../screens/CadastroScreen';
import CheckinEditarScreen from '../screens/CheckinEditarScreen';
import CheckinScreen from '../screens/CheckinScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import InicioScreen from '../screens/InicioScreen';
import LoginScreen from '../screens/LoginScreen';
import MeuPetScreen from '../screens/MeuPetScreen';
import OrientacaoScreen from '../screens/OrientacaoScreen';
import PasseioEditarScreen from '../screens/PasseioEditarScreen';
import PasseioScreen from '../screens/PasseioScreen';
import PetFormScreen from '../screens/PetFormScreen';
import { navigationRef } from './ref';
import type { AppStackParamList, AuthStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const headerPadrao = {
  headerStyle: { backgroundColor: theme.cores.verde },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 17 },
  contentStyle: { backgroundColor: theme.cores.fundo },
};

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

function RotasPublicas() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={CadastroScreen} />
    </AuthStack.Navigator>
  );
}

function RotasProtegidas() {
  return (
    <AppStack.Navigator screenOptions={{ ...headerPadrao, headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={AbasPrincipais} />
      <AppStack.Screen
        name="Orientacao"
        component={OrientacaoScreen}
        options={{ headerShown: true, title: 'Orientacao do dia' }}
      />
      <AppStack.Screen
        name="PetForm"
        component={PetFormScreen}
        options={{ headerShown: true, title: 'Cadastro do pet' }}
      />
      <AppStack.Screen
        name="CheckinEditar"
        component={CheckinEditarScreen}
        options={{ headerShown: true, title: 'Editar check-in' }}
      />
      <AppStack.Screen
        name="PasseioEditar"
        component={PasseioEditarScreen}
        options={{ headerShown: true, title: 'Editar passeio' }}
      />
      <AppStack.Screen
        name="AlertaForm"
        component={AlertaFormScreen}
        options={{ headerShown: true, title: 'Alerta' }}
      />
    </AppStack.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={styles.loading}>
        <LogoSolin largura={200} />
        <ActivityIndicator size="large" color="#fff" style={styles.loadingSpinner} />
        <Text style={styles.loadingTxt}>Carregando sessao...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {usuario ? <RotasProtegidas /> : <RotasPublicas />}
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
