// paletas do app solin (modo claro e escuro)
export type Cores = {
  verde: string;
  verdeEscuro: string;
  verdeClaro: string;
  laranja: string;
  fundo: string;
  superficie: string;
  texto: string;
  textoClaro: string;
  borda: string;
  vermelho: string;
  erroFundo: string;
  avisoFundo: string;
  sucessoFundo: string;
  sobreposicao: string;
};

/** Verde da marca: fundo do logo e da tela de login nos dois temas. */
export const COR_MARCA = '#2E7D6B';

export const coresClaro: Cores = {
  verde: '#2E7D6B',
  verdeEscuro: '#1F5A4D',
  verdeClaro: '#E8F5F1',
  laranja: '#F4A261',
  fundo: '#F5F7F6',
  superficie: '#FFFFFF',
  texto: '#1A2E2A',
  textoClaro: '#5C6F6A',
  borda: '#D4E4DF',
  vermelho: '#E76F51',
  erroFundo: '#FFF0EB',
  avisoFundo: '#FFF4E6',
  sucessoFundo: '#E8F6F3',
  sobreposicao: 'rgba(0,0,0,0.45)',
};

export const coresEscuro: Cores = {
  verde: '#3FA38B',
  verdeEscuro: '#A3E3D2',
  verdeClaro: '#17352E',
  laranja: '#F4A261',
  fundo: '#0E1513',
  superficie: '#18221F',
  texto: '#E4EEEB',
  textoClaro: '#9AAEA8',
  borda: '#2B3B37',
  vermelho: '#F08A70',
  erroFundo: '#3A211B',
  avisoFundo: '#382A18',
  sucessoFundo: '#17352E',
  sobreposicao: 'rgba(0,0,0,0.65)',
};
