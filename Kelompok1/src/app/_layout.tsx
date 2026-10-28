
import { DarkTheme, DefaultTheme, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAppTheme, ThemePreferenceProvider } from '@/context/theme-context';

import { ThemeProvider } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FinanceProvider } from '@/context/finance-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return <ThemePreferenceProvider><ThemedRootLayout /></ThemePreferenceProvider>;
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
