import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MeuPetScreen from './MeuPetScreen';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPet'> & {
  onSalvo: () => void;
};

export default function CadastroPetScreen({ onSalvo }: Props) {
  return <MeuPetScreen onSalvo={onSalvo} />;
}
