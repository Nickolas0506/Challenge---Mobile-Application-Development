import { Image, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { COR_MARCA, type Cores } from '../constants/cores';
import { useEstilos } from '../hooks/useEstilos';

const logo = require('../../assets/logo-solin.png');

const PROPORCAO = 646 / 757;

type Props = {
  largura?: number;
  style?: StyleProp<ViewStyle>;
  imagemStyle?: StyleProp<ImageStyle>;
};

export function LogoSolin({ largura = 250, style, imagemStyle }: Props) {
  const styles = useEstilos(criarEstilos);
  const altura = Math.round(largura * PROPORCAO);

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={logo}
        style={[styles.img, { width: largura, height: altura }, imagemStyle]}
        resizeMode="contain"
        accessibilityLabel="SOLIN — Cuidado presente todos os dias"
      />
    </View>
  );
}

const criarEstilos = (cores: Cores) =>
  StyleSheet.create({
    wrap: { alignItems: 'center', backgroundColor: COR_MARCA },
    img: { maxWidth: '100%', backgroundColor: COR_MARCA },
  });
