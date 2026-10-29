import { cores } from './cores';

export const theme = {
  cores,
  espaco: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  raio: {
    sm: 10,
    md: 16,
    lg: 24,
    pill: 999,
  },
  sombra: {
    card: {
      shadowColor: '#1A2E2A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
  fonte: {
    titulo: { fontSize: 26, fontWeight: '800' as const, color: cores.texto },
    subtitulo: { fontSize: 15, color: cores.textoClaro, lineHeight: 22 },
    secao: { fontSize: 13, fontWeight: '700' as const, color: cores.textoClaro, letterSpacing: 0.5 },
    cardTitulo: { fontSize: 17, fontWeight: '700' as const, color: cores.texto },
  },
};
