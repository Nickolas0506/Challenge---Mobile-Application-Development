import type { Alerta, Checkin, EventoIot, Passeio, Pet } from './storage';
import { Storage } from './storage';

export function criarEventosIotIniciais(): EventoIot[] {
  const agora = Date.now();
  return [
    {
      id: 'iot-1',
      data: new Date(agora - 2 * 3600000).toISOString(),
      tipo: 'uso_normal',
      mensagem: 'Uso registrado na caixa de areia (sensor PIR)',
    },
    {
      id: 'iot-2',
      data: new Date(agora - 8 * 3600000).toISOString(),
      tipo: 'uso_normal',
      mensagem: 'Uso registrado na caixa de areia (sensor PIR)',
    },
    {
      id: 'iot-3',
      data: new Date(agora - 14 * 3600000).toISOString(),
      tipo: 'sem_uso',
      mensagem: 'Nenhum uso detectado nas ultimas 12h — verificar rotina urinaria',
    },
  ];
}

export function criarAlertasIniciais(nomePet: string): Alerta[] {
  return [
    {
      id: 'a1',
      titulo: 'Check-in de hoje',
      mensagem: `Voce ainda nao registrou como ${nomePet} esta hoje. Leva 1 toque!`,
      tipo: 'checkin',
      lido: false,
      data: new Date().toISOString(),
    },
    {
      id: 'a2',
      titulo: 'Sensor urinario',
      mensagem: 'Possivel alteracao na rotina urinaria detectada pelo sensor PIR.',
      tipo: 'iot',
      lido: false,
      data: new Date().toISOString(),
    },
    {
      id: 'a3',
      titulo: 'Vacina V10',
      mensagem: 'Lembrete: reforco de vacina em 7 dias na clinica parceira Clyvo.',
      tipo: 'vacina',
      lido: true,
      data: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

function criarCheckinsDemo(): Checkin[] {
  const agora = Date.now();
  return [
    {
      id: 'c-demo-1',
      data: new Date(agora - 86400000).toISOString(),
      humor: 'bom',
      observacao: 'Comeu bem e brincou no parque.',
    },
    {
      id: 'c-demo-2',
      data: new Date(agora - 172800000).toISOString(),
      humor: 'otimo',
      observacao: 'Muito animada, sono tranquilo.',
    },
    {
      id: 'c-demo-3',
      data: new Date(agora - 259200000).toISOString(),
      humor: 'regular',
      observacao: 'Apetite um pouco reduzido.',
    },
  ];
}

function criarPasseiosDemo(): Passeio[] {
  const agora = Date.now();
  return [
    {
      id: 'p-demo-1',
      data: new Date(agora - 43200000).toISOString(),
      duracaoMin: '25',
      bebeuAgua: true,
      urinou: true,
      urinaNormal: true,
      fezesNormais: true,
      comportamentoNormal: true,
      observacao: 'Passeio no quarteirao, muito agitada.',
    },
    {
      id: 'p-demo-2',
      data: new Date(agora - 129600000).toISOString(),
      duracaoMin: '15',
      bebeuAgua: true,
      urinou: true,
      urinaNormal: true,
      fezesNormais: true,
      comportamentoNormal: true,
      observacao: 'Caminhada leve depois da chuva.',
    },
  ];
}

// carrega pet + historico + alertas para simular app completo apos login
export async function carregarDadosDemonstracao(nomeTutor: string) {
  const pet: Pet = {
    id: 'pet-demo-luna',
    nome: 'Luna',
    especie: 'Gato',
    raca: 'SRD',
    peso: '4.5',
    idade: '2 anos',
    caracteristicas: 'Castrada, vacinas em dia, come racao umida',
  };

  await Storage.setPet(pet);
  await Storage.setCheckins(criarCheckinsDemo());
  await Storage.setPasseios(criarPasseiosDemo());
  await Storage.setEventosIot(criarEventosIotIniciais());
  await Storage.setAlertas(criarAlertasIniciais(pet.nome));

  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  await Storage.setStreak({ dias: 3, ultimaData: ontem.toISOString().split('T')[0] });
}
