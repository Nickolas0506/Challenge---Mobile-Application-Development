import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import AvisoPlataformaWeb from './components/AvisoPlataformaWeb';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  if (Platform.OS === 'web') {
    return <AvisoPlataformaWeb />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
