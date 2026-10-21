
import { DarkTheme, DefaultTheme, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { ThemeProvider } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FinanceProvider } from '@/context/finance-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
