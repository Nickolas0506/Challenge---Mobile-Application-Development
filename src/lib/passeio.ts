import type { Passeio, PasseioInput } from '../types/models';

/** Estado do formulario de passeio (criar e editar usam o mesmo). */
export type FormularioPasseio = {
  duracao: string;
  bebeuAgua: boolean;
  urinou: boolean;
  urinaNormal: boolean;
  fezesNormais: boolean;
  comportamentoNormal: boolean;
  observacao: string;
};

export const FORMULARIO_PASSEIO_VAZIO: FormularioPasseio = {
  duracao: '',
  bebeuAgua: true,
  urinou: true,
  urinaNormal: true,
  fezesNormais: true,
  comportamentoNormal: true,
  observacao: '',
};

export function passeioParaFormulario(passeio: Passeio): FormularioPasseio {
  return {
    duracao: passeio.duracaoMin,
    bebeuAgua: passeio.bebeuAgua,
    urinou: passeio.urinou,
    urinaNormal: passeio.urinaNormal,
    fezesNormais: passeio.fezesNormais,
    comportamentoNormal: passeio.comportamentoNormal,
    observacao: passeio.observacao ?? '',
  };
}

export function validarFormularioPasseio(form: FormularioPasseio): string | null {
  const minutos = Number(form.duracao.trim().replace(',', '.'));
  if (!form.duracao.trim()) return 'Informe quantos minutos durou o passeio.';
  if (!Number.isFinite(minutos) || minutos <= 0) return 'A duracao precisa ser um numero maior que zero.';
  if (minutos > 600) return 'A duracao parece alta demais. Confira os minutos.';
  return null;
}

export function formularioParaPasseio(
  form: FormularioPasseio,
  extras: { petId?: string; data: string }
): Omit<PasseioInput, 'userId'> {
  return {
    petId: extras.petId,
    data: extras.data,
    duracaoMin: form.duracao.trim(),
    bebeuAgua: form.bebeuAgua,
    urinou: form.urinou,
    urinaNormal: form.urinou ? form.urinaNormal : false,
    fezesNormais: form.fezesNormais,
    comportamentoNormal: form.comportamentoNormal,
    observacao: form.observacao.trim(),
  };
}

export function resumoUrina(p: { urinou: boolean; urinaNormal: boolean }) {
  if (!p.urinou) return 'Urina: nao urinou';
  return `Urina: ${p.urinaNormal ? 'normal' : 'alterada'}`;
}

export function resumoPasseio(form: FormularioPasseio) {
  const minutos = form.duracao.trim() || '—';
  return [
    `${minutos} min · Agua: ${form.bebeuAgua ? 'sim' : 'nao'} · ${resumoUrina(form)}`,
    `Fezes: ${form.fezesNormais ? 'normais' : 'alteradas'} · Comportamento: ${
      form.comportamentoNormal ? 'normal' : 'alterado'
    }`,
  ];
}
