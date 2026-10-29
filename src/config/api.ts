import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { versaoApp } from './versao';

function hostDaLan(): string | null {
  const candidatos = [
    Constants.expoConfig?.hostUri,
    Constants.linkingUri,
    (Constants as { debuggerHost?: string }).debuggerHost,
  ];

  for (const valor of candidatos) {
    const match = String(valor ?? '').match(/(\d{1,3}(?:\.\d{1,3}){3})/);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * URL da API Spring Boot.
 * - APK publicado (release): sempre a API em producao no Railway.
 * - Desenvolvimento: EXPO_PUBLIC_API_URL ou o IP da LAN do Expo na porta 8080.
 */
export function getApiUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!__DEV__ && versaoApp.apiUrlProducao) return versaoApp.apiUrlProducao;
  if (env) return env;

  const lan = hostDaLan();
  if (lan) return `http://${lan}:8080`;

  if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
  return 'http://localhost:8080';
}
