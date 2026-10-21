import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FinanceProvider } from '@/context/finance-context';
import { initializeFinanceDatabase } from '@/context/finance-database';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="kasino.db" onInit={initializeFinanceDatabase}>
        <FinanceProvider>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="user" />
            <Stack.Screen name="explore" />
          </Stack>
        </FinanceProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
