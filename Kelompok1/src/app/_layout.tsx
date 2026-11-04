
import { DarkTheme, DefaultTheme, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAppTheme, ThemePreferenceProvider } from '@/context/theme-context';

import { ThemeProvider } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SQLiteProvider } from 'expo-sqlite';
import { FinanceProvider } from '@/context/finance-context';
import { DATABASE_NAME, initializeFinanceDatabase } from '@/context/finance-database';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeFinanceDatabase}>
      <ThemePreferenceProvider><ThemedRootLayout /></ThemePreferenceProvider>
    </SQLiteProvider>
  );
}

function ThemedRootLayout() {
  const { colorScheme } = useAppTheme();

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <FinanceProvider>
        <AnimatedSplashOverlay />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="index" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="user" />
          <Stack.Screen name="explore" />
        </Stack>
      </FinanceProvider>
    </ThemeProvider>
  );
}
