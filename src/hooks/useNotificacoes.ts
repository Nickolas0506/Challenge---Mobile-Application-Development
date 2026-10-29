import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { alertasParaNotificar } from '../lib/alertas';
import { fezCheckinHoje } from '../lib/rotina';
import { navigationRef, quandoNavegacaoPronta } from '../navigation/ref';
import { notificacaoService, type DadosNotificacao } from '../services/notificacaoService';
import { preferenciasService } from '../services/preferenciasService';
import { useAlertas, useMarcarAlertaLido } from './useAlertas';
import { useCheckins } from './useCheckins';
import { usePets } from './usePets';
import { usePreferenciaLembrete } from './usePreferenciaLembrete';

/**
 * Liga as notificacoes locais ao fluxo do app (montado so com o tutor logado):
 * 1. alerta novo gerado pela API -> notificacao imediata;
 * 2. lembrete diario de check-in, cancelado no dia em que o check-in ja foi feito;
 * 3. toque na notificacao -> abre a tela certa (e marca o alerta como lido).
 */
export function useNotificacoes() {
  const { usuario } = useAuth();
  const { data: alertas } = useAlertas();
  const { data: checkins } = useCheckins();
  const { data: pets } = usePets();
  const { data: lembrete } = usePreferenciaLembrete();
  const marcarLido = useMarcarAlertaLido();
  const userId = usuario?.uid;

  useEffect(() => {
    void notificacaoService.configurar().then(() => notificacaoService.pedirPermissao());
  }, []);

  useEffect(() => {
    if (!userId || !alertas) return;
    void (async () => {
      const jaNotificados = await preferenciasService.lerAlertasNotificados(userId);
      for (const alerta of alertasParaNotificar(alertas, jaNotificados)) {
        await notificacaoService.notificarAlerta(alerta);
      }
      const base = jaNotificados ?? new Set<string>();
      alertas.forEach((a) => base.add(a.id));
      await preferenciasService.salvarAlertasNotificados(userId, base);
    })();
  }, [alertas, userId]);

  const nomePet = pets?.[0]?.nome ?? 'seu pet';
  useEffect(() => {
    if (!lembrete || !checkins) return;
    if (!lembrete.ativo) {
      void notificacaoService.cancelarLembretesCheckin();
      return;
    }
    void notificacaoService.agendarLembretesCheckin(
      lembrete.hora,
      lembrete.minuto,
      fezCheckinHoje(checkins),
      nomePet
    );
  }, [lembrete, checkins, nomePet]);

  const { mutate: marcarComoLido } = marcarLido;
  useEffect(
    () =>
      notificacaoService.ouvirToques((dados: DadosNotificacao) => {
        quandoNavegacaoPronta(() => {
          if (dados.destino === 'alerta') {
            marcarComoLido(dados.alertaId);
            navigationRef.navigate('MainTabs', {
              screen: 'Alertas',
              params: { destaqueId: dados.alertaId },
            });
          } else {
            navigationRef.navigate('MainTabs', { screen: 'Checkin' });
          }
        });
      }),
    [marcarComoLido]
  );
}
