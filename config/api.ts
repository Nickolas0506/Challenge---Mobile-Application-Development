import Constants from 'expo-constants';
import { Platform } from 'react-native';

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

/** URL da API HTTP da equipe (json-server). Celular usa o IP da LAN do Expo. */
export function getApiUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (env) return env;

  const lan = hostDaLan();
  if (lan) return `http://${lan}:3001`;

  if (Platform.OS === 'android') return 'http://10.0.2.2:3001';
  return 'http://localhost:3001';
}
