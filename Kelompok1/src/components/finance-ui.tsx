import { ReactNode } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Transaction } from '../context/finance-context';
import { useAppTheme } from '../context/theme-context';
import Header from './Header';

export const navy = '#173575';
export const blue = '#5d719f';
export const muted = '#7586ad';
export const pale = '#eef1f7';

export const money = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export const formatNominalInput = (value: string) => value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function FinancePage({
  title,
  children,
  role,
  hideLogout = false,
  scrollable = true,
  headerAction,
}: {
  title: string;
  children: ReactNode;
  role?: 'admin' | 'user';
  hideLogout?: boolean;
  scrollable?: boolean;
  headerAction?: ReactNode;
}) {
  const pathname = usePathname();

  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';

  const inferredRole = role ?? (pathname.startsWith('/user') ? 'user' : 'admin');

  return (
    <SafeAreaView edges={['top']} style={[s.screen, isDarkMode && s.screenDark]}>
      <StatusBar barStyle="light-content" backgroundColor="#193779" />

      <Header role={inferredRole} />

      <View style={s.body}>
        <ScrollView scrollEnabled={scrollable} style={[s.main, isDarkMode && s.mainDark, s.headerMain]} contentContainerStyle={[s.content, inferredRole === 'admin' && s.adminContent]} keyboardShouldPersistTaps="handled">
          {title !== 'Dashboard' && (
            <View style={s.heading}>
              <Text style={[s.title, isDarkMode && s.titleDark]}>{title}</Text>
            </View>
          )}

          {headerAction ? (
            <View
              style={{
                alignItems: 'flex-end',
                marginBottom: 8,
              }}
            >
              {headerAction}
            </View>
          ) : null}

          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export function Field({ label, placeholder, multiline, value, onChangeText, keyboardType, error }: any) {
  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={s.field}>
      <Text style={[s.label, isDarkMode && s.labelDark]}>{label}</Text>

      <TextInput style={[s.input, multiline && s.multiline]} placeholder={placeholder} placeholderTextColor="#e7ebf4" value={value} onChangeText={onChangeText} multiline={multiline} keyboardType={keyboardType} />

      {error ? (
        <Text
          style={{
            color: '#ef4444',
            fontSize: 11,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function Action({ label, onPress, outline = false, disabled = false }: { label: string; onPress: () => void; outline?: boolean; disabled?: boolean }) {
  return (
    <Pressable accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.action, outline ? s.outline : s.filled, disabled && !outline && s.actionDisabled, pressed && { opacity: 0.75 }]}>
      <Text style={[s.actionText, outline && { color: navy }, disabled && !outline && s.actionTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

export function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={s.card}>
      {title ? <Text style={s.cardTitle}>{title}</Text> : null}

      {children}
    </View>
  );
}

export function TransactionRow({ item, onPress }: { item: Transaction; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [s.row, pressed && { opacity: 0.8 }]} onPress={onPress}>
      <Text style={s.rowDate}>{item.date}</Text>

      <View style={s.rowMain}>
        <View style={{ flex: 1 }}>
          <Text style={s.rowType}>{item.type}</Text>

          <Text style={s.rowDesc}>{item.description}</Text>
        </View>

        <Text style={s.rowAmount}>{money(item.amount)} ›</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  screenDark: {
    backgroundColor: '#111827',
  },

  body: {
    flex: 1,
    flexDirection: 'row',
  },

  main: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainDark: {
    backgroundColor: '#111827',
  },

  headerMain: {
    marginTop: 62,
  },

  content: {
    padding: 12,
    paddingBottom: 28,
  },

  adminContent: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 35,
  },

  heading: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  title: {
    color: navy,
    fontSize: 18,
    fontWeight: '700',
  },

  titleDark: {
    color: '#f8fafc',
  },

  field: {
    marginBottom: 10,
  },

  label: {
    color: navy,
    fontSize: 11,
    marginBottom: 4,
  },

  labelDark: {
    color: '#dbe5f5',
  },

  input: {
    backgroundColor: blue,
    color: '#fff',
    minHeight: 34,
    paddingHorizontal: 10,
    fontSize: 12,
    borderRadius: 12,
  },

  multiline: {
    minHeight: 56,
    textAlignVertical: 'top',
    paddingTop: 7,
  },

  action: {
    minWidth: 70,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  filled: {
    backgroundColor: navy,
  },

  outline: {
    borderWidth: 1,
    borderColor: navy,
    backgroundColor: '#fff',
  },

  actionDisabled: {
    backgroundColor: '#aeb4bf',
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
  },

  actionTextDisabled: {
    color: '#f5f5f5',
  },

  card: {
    backgroundColor: blue,
    padding: 10,
    marginBottom: 9,
    borderRadius: 12,
  },

  cardTitle: {
    color: '#e8edf7',
    fontSize: 11,
    marginBottom: 5,
  },

  row: {
    marginTop: 7,
    borderRadius: 12,
    overflow: 'hidden',
  },

  rowDate: {
    color: '#fff',
    backgroundColor: navy,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 10,
  },

  rowMain: {
    backgroundColor: blue,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowType: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },

  rowDesc: {
    color: '#dce3f2',
    fontSize: 10,
    marginTop: 3,
  },

  rowAmount: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
});
