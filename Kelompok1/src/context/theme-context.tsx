import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';
type ThemeContextValue = { colorScheme: ThemeMode; setColorScheme: (mode: ThemeMode) => Promise<void> };

const THEME_STORAGE_KEY = 'kasino-theme-preference';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((preference) => {
      if (preference === 'light' || preference === 'dark') {
        setColorSchemeState(preference);
        if (Platform.OS !== 'web') Appearance.setColorScheme(preference);
      }
    }).catch(() => undefined);
  }, []);

  const setColorScheme = async (mode: ThemeMode) => {
    setColorSchemeState(mode);
    if (Platform.OS !== 'web') Appearance.setColorScheme(mode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const value = useMemo(() => ({ colorScheme, setColorScheme }), [colorScheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme harus digunakan di dalam ThemePreferenceProvider.');
  return context;
}
