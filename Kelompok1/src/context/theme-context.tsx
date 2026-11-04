import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

type ThemeMode = 'light' | 'dark';
type ThemeContextValue = { colorScheme: ThemeMode; setColorScheme: (mode: ThemeMode) => Promise<void> };

const THEME_KEY = 'themeMode';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const systemScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    let active = true;
    db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', THEME_KEY)
      .then((row) => {
        if (!active) return;
        if (row?.value === 'light' || row?.value === 'dark') {
          setColorSchemeState(row.value);
          if (Platform.OS !== 'web') Appearance.setColorScheme(row.value);
        }
      })
      .catch((error) => console.error('Gagal membaca tema dari SQLite:', error));
    return () => { active = false; };
  }, [db]);

  const setColorScheme = async (mode: ThemeMode) => {
    setColorSchemeState(mode);
    if (Platform.OS !== 'web') Appearance.setColorScheme(mode);
    await db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', THEME_KEY, mode);
  };

  const value = useMemo(() => ({ colorScheme, setColorScheme }), [colorScheme]); // eslint-disable-line react-hooks/exhaustive-deps
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme harus digunakan di dalam ThemePreferenceProvider.');
  return context;
}
