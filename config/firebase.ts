import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

/** Persistência local da sessão (Firebase Auth) via AsyncStorage. */
function persistenciaNativa(): Persistence {
  return class {
    static type: Persistence['type'] = 'LOCAL';
    readonly type: Persistence['type'] = 'LOCAL';

    async _isAvailable() {
      try {
        await AsyncStorage.setItem('__solin_auth_test', '1');
        await AsyncStorage.removeItem('__solin_auth_test');
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: unknown) {
      return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    async _get(key: string) {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    }

    _remove(key: string) {
      return AsyncStorage.removeItem(key);
    }

    _addListener() {}
    _removeListener() {}
  } as unknown as Persistence;
}

function criarAuth(app: FirebaseApp): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, { persistence: persistenciaNativa() });
  } catch {
    return getAuth(app);
  }
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = criarAuth(app);

export { app, auth };
export { firebaseConfig };

export function firebaseConfigurado() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}
