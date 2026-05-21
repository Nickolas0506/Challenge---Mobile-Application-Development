import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Storage } from './storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/** Após login: cadastro do pet na primeira vez; abas se já existir pet. */
export async function navegarAposLogin(navigation: Nav) {
  const pet = await Storage.getPet();
  const destino = pet ? 'MainTabs' : 'CadastroPet';
  navigation.reset({ index: 0, routes: [{ name: destino }] });
}
