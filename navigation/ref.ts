import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from './types';
import { Storage } from '../lib/storage';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function sairDoApp() {
  await Storage.encerrarSessao();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }
}
