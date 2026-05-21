export const OPCOES_ESPECIE = [
  { value: 'gato', label: 'Gato' },
  { value: 'cachorro', label: 'Cachorro' },
  { value: 'passaro', label: 'Passaro' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'coelho', label: 'Coelho' },
  { value: 'peixe', label: 'Peixe' },
  { value: 'tartaruga', label: 'Tartaruga' },
  { value: 'outro', label: 'Outro' },
] as const;

export type ValorEspecie = (typeof OPCOES_ESPECIE)[number]['value'];

const ROTULOS = new Map(OPCOES_ESPECIE.map((o) => [o.value, o.label]));

export function rotuloEspecie(valor: string) {
  return ROTULOS.get(valor as ValorEspecie) ?? valor;
}

export function especieSalvaParaFormulario(especieSalva: string) {
  const porRotulo = OPCOES_ESPECIE.find(
    (o) => o.label.toLowerCase() === especieSalva.trim().toLowerCase()
  );
  if (porRotulo) {
    return { valor: porRotulo.value, outro: '' };
  }
  const porValor = OPCOES_ESPECIE.find((o) => o.value === especieSalva);
  if (porValor && porValor.value !== 'outro') {
    return { valor: porValor.value, outro: '' };
  }
  if (especieSalva.trim()) {
    return { valor: 'outro' as const, outro: especieSalva.trim() };
  }
  return { valor: '', outro: '' };
}

export function especieFormularioParaSalvar(valor: string, outro: string) {
  if (!valor) return '';
  if (valor === 'outro') return outro.trim() || 'Outro';
  return rotuloEspecie(valor);
}
