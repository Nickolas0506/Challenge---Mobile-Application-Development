import type { NavigatorScreenParams } from '@react-navigation/native';
import type { HumorCheckin } from '../lib/storage';

export type RootStackParamList = {
  Login: undefined;
  CadastroPet: undefined;
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Orientacao: { humor: HumorCheckin; pet: string };
};

export type TabParamList = {
  Inicio: undefined;
  MeuPet: undefined;
  Checkin: undefined;
  Passeio: undefined;
  Historico: undefined;
  Alertas: undefined;
};
