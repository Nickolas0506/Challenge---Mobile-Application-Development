import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MeuPetScreen from './MeuPetScreen';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPet'> & {
  onSalvo: () => void;
};

export default function CadastroPetScreen({ navigation, onSalvo }: Props) {
  const irParaAba = (aba: 'Inicio' | 'Historico') => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: aba } }],
    });
  };

  return (
    <MeuPetScreen
      onSalvo={onSalvo}
      onVoltarInicio={() => irParaAba('Inicio')}
      onIrInicio={() => irParaAba('Inicio')}
      onIrHistorico={() => irParaAba('Historico')}
    />
  );
}
