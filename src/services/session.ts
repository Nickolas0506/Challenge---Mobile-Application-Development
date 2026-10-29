import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_TOKEN = '@solin_token';
const CHAVE_SESSAO = '@solin_sessao_usuario';

let tokenMemoria: string | null = null;

export function obterToken(): string | null {
  return tokenMemoria;
}

export async function guardarSessao(token: string, usuarioJson: string): Promise<void> {
  tokenMemoria = token;
  await AsyncStorage.multiSet([
    [CHAVE_TOKEN, token],
    [CHAVE_SESSAO, usuarioJson],
  ]);
}

export async function carregarSessao(): Promise<{ token: string; usuarioJson: string } | null> {
  const [[, token], [, usuarioJson]] = await AsyncStorage.multiGet([CHAVE_TOKEN, CHAVE_SESSAO]);
  if (!token || !usuarioJson) return null;
  tokenMemoria = token;
  return { token, usuarioJson };
}

export async function limparSessao(): Promise<void> {
  tokenMemoria = null;
  await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_SESSAO]);
}
