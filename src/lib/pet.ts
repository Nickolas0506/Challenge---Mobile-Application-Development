import {
  especieFormularioParaSalvar,
  especieSalvaParaFormulario,
  rotuloEspecie,
} from '../constants/especies';
import type { Pet, PetInput } from '../types/models';

export type FormularioPet = {
  nome: string;
  especieValor: string;
  especieOutro: string;
  raca: string;
  peso: string;
  idade: string;
  caracteristicas: string;
  foto?: string;
};

export const FORMULARIO_PET_VAZIO: FormularioPet = {
  nome: '',
  especieValor: '',
  especieOutro: '',
  raca: '',
  peso: '',
  idade: '',
  caracteristicas: '',
  foto: undefined,
};

export function descreverPet(pet: Pick<Pet, 'especie' | 'raca' | 'peso' | 'idade'>) {
  return [pet.especie, pet.raca, pet.peso && pet.peso !== '-' ? `${pet.peso} kg` : null, pet.idade]
    .filter(Boolean)
    .join(' · ');
}

export function petParaFormulario(pet: Pet): FormularioPet {
  const especie = especieSalvaParaFormulario(pet.especie);
  return {
    nome: pet.nome,
    especieValor: especie.valor,
    especieOutro: especie.outro,
    raca: pet.raca === 'SRD' ? '' : pet.raca,
    peso: pet.peso.replace(/\s*kg\s*/i, '').replace('-', ''),
    idade: pet.idade ?? '',
    caracteristicas: pet.caracteristicas ?? '',
    foto: pet.foto,
  };
}

export function validarFormularioPet(form: FormularioPet): string | null {
  if (!form.nome.trim()) return 'Informe o nome do pet.';
  if (!form.especieValor) return 'Selecione a especie.';
  if (form.especieValor === 'outro' && !form.especieOutro.trim()) {
    return 'Informe qual e o animal em "Outro".';
  }
  const peso = form.peso.trim().replace(',', '.');
  if (peso && (!Number.isFinite(Number(peso)) || Number(peso) <= 0)) {
    return 'O peso precisa ser um numero em kg (ex: 4.5).';
  }
  return null;
}

export function formularioParaPet(form: FormularioPet, createdAt?: string): Omit<PetInput, 'userId'> {
  return {
    nome: form.nome.trim(),
    especie: especieFormularioParaSalvar(form.especieValor, form.especieOutro),
    raca: form.raca.trim() || 'SRD',
    peso: form.peso.trim().replace(',', '.') || '-',
    idade: form.idade.trim() || undefined,
    caracteristicas: form.caracteristicas.trim() || undefined,
    foto: form.foto,
    createdAt: createdAt ?? new Date().toISOString(),
  };
}

export function previaPet(form: FormularioPet) {
  const especie =
    form.especieValor === 'outro'
      ? form.especieOutro || 'Outro'
      : form.especieValor
        ? rotuloEspecie(form.especieValor)
        : '';
  return [form.nome, especie, form.raca || 'SRD', form.peso && `${form.peso} kg`, form.idade]
    .filter(Boolean)
    .join(' · ');
}
