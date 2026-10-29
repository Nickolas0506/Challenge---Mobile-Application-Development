import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Alerta } from '../types/models';

/** O que a notificacao carrega para o app saber para onde levar o tutor ao tocar. */
export type DadosNotificacao =
  | { destino: 'alerta'; alertaId: string }
  | { destino: 'checkin' };

const CANAL_ALERTAS = 'alertas-saude';
const CANAL_LEMBRETES = 'lembretes-rotina';
const PREFIXO_LEMBRETE = 'lembrete-checkin-';
const DIAS_AGENDADOS = 7;

let configurado = false;

export const notificacaoService = {
  /** Mostra a notificacao mesmo com o app aberto e cria os canais do Android. */
  async configurar() {
    if (configurado) return;
    configurado = true;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL_ALERTAS, {
        name: 'Alertas de saude do pet',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
      await Notifications.setNotificationChannelAsync(CANAL_LEMBRETES, {
        name: 'Lembrete diario de check-in',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  },

  async temPermissao() {
    const { granted } = await Notifications.getPermissionsAsync();
    return granted;
  },

  async pedirPermissao() {
    if (await this.temPermissao()) return true;
    const { granted } = await Notifications.requestPermissionsAsync();
    return granted;
  },

  /** Notificacao imediata para um alerta que a API acabou de gerar. */
  async notificarAlerta(alerta: Alerta) {
    const dados: DadosNotificacao = { destino: 'alerta', alertaId: alerta.id };
    await Notifications.scheduleNotificationAsync({
      identifier: `alerta-${alerta.id}`,
      content: { title: alerta.titulo, body: alerta.mensagem, data: dados },
      trigger: Platform.OS === 'android' ? { channelId: CANAL_ALERTAS } : null,
    });
  },

  /**
   * Agenda o lembrete de check-in para os proximos dias no horario escolhido.
   * Se o check-in de hoje ja foi feito, o lembrete de hoje nao e agendado.
   */
  async agendarLembretesCheckin(hora: number, minuto: number, checkinFeitoHoje: boolean, nomePet: string) {
    await this.cancelarLembretesCheckin();
    const agora = new Date();
    const dados: DadosNotificacao = { destino: 'checkin' };

    for (let dia = 0; dia < DIAS_AGENDADOS; dia++) {
      const quando = new Date(agora);
      quando.setDate(agora.getDate() + dia);
      quando.setHours(hora, minuto, 0, 0);
      if (quando <= agora) continue;
      if (dia === 0 && checkinFeitoHoje) continue;

      await Notifications.scheduleNotificationAsync({
        identifier: `${PREFIXO_LEMBRETE}${dia}`,
        content: {
          title: `Como ${nomePet} esta hoje?`,
          body: 'Falta o check-in do dia. Leva 10 segundos e mantem a sequencia.',
          data: dados,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: quando,
          channelId: CANAL_LEMBRETES,
        },
      });
    }
  },

  async cancelarLembretesCheckin() {
    const agendadas = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      agendadas
        .filter((n) => n.identifier.startsWith(PREFIXO_LEMBRETE))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    );
  },

  /** Chama `aoTocar` quando o tutor toca numa notificacao (inclusive se ela abriu o app). */
  ouvirToques(aoTocar: (dados: DadosNotificacao) => void) {
    const tratar = (resposta: Notifications.NotificationResponse | null) => {
      const dados = resposta?.notification.request.content.data as DadosNotificacao | undefined;
      if (dados?.destino) {
        aoTocar(dados);
        Notifications.clearLastNotificationResponse();
      }
    };
    tratar(Notifications.getLastNotificationResponse());
    const assinatura = Notifications.addNotificationResponseReceivedListener(tratar);
    return () => assinatura.remove();
  },
};
