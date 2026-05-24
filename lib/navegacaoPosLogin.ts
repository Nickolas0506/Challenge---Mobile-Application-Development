import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/** Após login: sempre abre a tela Início (resumo, check-in, etc.). */
export async function navegarAposLogin(navigation: Nav) {
  navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs', params: { screen: 'Inicio' } }],
  });
}
