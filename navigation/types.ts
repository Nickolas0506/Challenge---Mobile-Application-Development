import type { NavigatorScreenParams } from '@react-navigation/native';
import type { HumorCheckin } from '../types/models';

export type AuthStackParamList = {
  Login: undefined;
  Cadastro: undefined;
};

export type TabParamList = {
  Inicio: undefined;
  MeuPet: undefined;
  Checkin: undefined;
  Passeio: undefined;
  Historico: undefined;
  Alertas: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Orientacao: { humor: HumorCheckin; pet: string };
  PetForm: { petId?: string } | undefined;
  CheckinEditar: { checkinId: string };
  PasseioEditar: { passeioId: string };
  AlertaForm: { alertaId?: string } | undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;
