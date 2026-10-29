import 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/config/queryClient';
import { AuthProvider } from './src/contexts/AuthContext';
import { TemaProvider, useTema } from './src/contexts/TemaContext';
import AppNavigator from './src/navigation/AppNavigator';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  const root = document.getElementById('root');
  if (root) {
    root.style.height = '100%';
    root.style.display = 'flex';
  }
}

function BarraStatus() {
  const { escuro } = useTema();
  return <StatusBar style={escuro ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaProvider style={styles.root}>
        <QueryClientProvider client={queryClient}>
          <TemaProvider>
            <AuthProvider>
              <BarraStatus />
              <AppNavigator />
            </AuthProvider>
          </TemaProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: Platform.OS === 'web' ? ('100vh' as unknown as number) : undefined,
  },
});
