import type { HumorCheckin } from './storage';

// respostas imediatas sem diagnostico (regra simples pro mvp)
// depois o grupo pode trocar por api de ia
export function gerarOrientacao(humor: HumorCheckin, nomePet: string) {
  const mapa: Record<HumorCheckin, { titulo: string; texto: string; observar: string }> = {
    otimo: {
      titulo: 'Tudo certo por aqui',
      texto: `${nomePet} parece bem hoje. Continue a rotina normal.`,
      observar: 'Mantenha água fresca e horários regulares de alimentação.',
    },
    bom: {
      titulo: 'Dia tranquilo',
      texto: `O check-in de ${nomePet} está ok. Nada de preocupante por enquanto.`,
      observar: 'Observe se o apetite e o sono continuam normais nas próximas horas.',
    },
    regular: {
      titulo: 'Fique de olho',
      texto: `Isso pode indicar alguma alteração leve no comportamento de ${nomePet}.`,
      observar:
        'Observe apetite, sede e vontade de brincar nas próximas 6 a 12 horas. Se piorar, procure a clínica.',
    },
    ruim: {
      titulo: 'Atenção recomendada',
      texto: `O registro de hoje sugere que ${nomePet} não está bem. Isso não é diagnóstico.`,
      observar:
        'Veja se há vômito, falta de apetite ou letargia. Se continuar, agende consulta na Clyvo.',
    },
  };

  return mapa[humor];
}
