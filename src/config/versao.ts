import Constants from 'expo-constants';

type ExtraApp = {
  commit?: string;
  commitCurto?: string;
  commitData?: string;
  alteracoesPendentes?: boolean;
  dataBuild?: string;
  apiUrlProducao?: string;
  repositorio?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraApp;

/** Identificacao da versao gravada no build pelo app.config.js. */
export const versaoApp = {
  versao: Constants.expoConfig?.version ?? '-',
  versionCode: Constants.expoConfig?.android?.versionCode,
  commit: extra.commit ?? 'desconhecido',
  commitCurto: extra.commitCurto ?? 'desconhecido',
  commitData: extra.commitData,
  alteracoesPendentes: !!extra.alteracoesPendentes,
  dataBuild: extra.dataBuild,
  repositorio: extra.repositorio,
  apiUrlProducao: extra.apiUrlProducao,
};
