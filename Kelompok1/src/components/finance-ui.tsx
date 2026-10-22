import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Transaction } from '../context/finance-context';
import Header from './Header';

export const navy = '#173575';
export const blue = '#5d719f';
export const muted = '#7586ad';
export const pale = '#eef1f7';
export const money = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

const adminMenu = [
  ['⌂', 'Dashboard', '/admin/dashboard'], ['+', 'Catat Pemasukan', '/admin/tambah_pemasukan'],
  ['−', 'Catat Pengeluaran', '/admin/read_pengeluaran'], ['▤', 'Kelola Transaksi', '/admin/daftar_transaksi'],
  ['▥', 'Laporan Keuangan', '/admin/laporan_keuangan'], ['●', 'Profil', '/admin/profil'],
];
const userMenu = [
  ['⌂', 'Dashboard', '/user/dashboard'], ['▤', 'Kelola Transaksi', '/user/daftar_transaksi'],
  ['▥', 'Laporan Keuangan', '/user/laporan_keuangan'], ['●', 'Profil', '/user/profil'],
];

export function FinancePage({ title, children, role, hideLogout = false }: { title: string; children: ReactNode; role?: 'admin' | 'user'; hideLogout?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const sidebarWidth = Math.min(250, Math.max(190, width * 0.72));
  const inferredRole = role ?? (pathname.startsWith('/user') ? 'user' : 'admin');
  const menu = inferredRole === 'admin' ? adminMenu : userMenu;
  return <SafeAreaView edges={['top']} style={s.screen}>
    {inferredRole === 'admin' ? <><StatusBar barStyle="light-content" backgroundColor="#193779" /><Header /></> : <View style={s.topbar}><Pressable accessibilityRole="button" accessibilityLabel="Buka menu" onPress={() => setMenuOpen((open) => !open)} style={s.menuButton}><View style={s.menuGlyph}><View style={[s.menuBar, s.menuBarTall]} /><View style={[s.menuBar, s.menuBarMedium]} /><View style={[s.menuBar, s.menuBarShort]} /></View></Pressable><Text style={s.mark}>K</Text><Text style={s.brandName}>KASINO</Text><View style={{ flex: 1 }} /><Text style={s.topHint}>USER</Text>{!hideLogout && <Pressable onPress={() => router.replace('/')}><Text style={s.logout}>Keluar</Text></Pressable>}</View>}
    <View style={s.body}>
      <ScrollView style={[s.main, inferredRole === 'admin' && s.adminMain]} contentContainerStyle={[s.content, inferredRole === 'admin' && s.adminContent]} keyboardShouldPersistTaps="handled">
        <View style={s.heading}><Pressable onPress={() => router.canGoBack() ? router.back() : router.replace(inferredRole === 'user' ? '/user/dashboard' : '/admin/dashboard')}><Text style={s.back}>‹</Text></Pressable><Text style={s.title}>{title}</Text></View>
        {children}
      </ScrollView>
    </View>
    {inferredRole === 'user' && menuOpen && <View style={s.drawerLayer}>
      <ScrollView style={[s.sidebar, { width: sidebarWidth }]} contentContainerStyle={s.menuList}>
        {menu.map(([icon, label, path]) => <Pressable key={path} onPress={() => { setMenuOpen(false); router.replace(path as never); }} style={[s.menuItem, pathname === path && s.menuSelected]}><Text style={s.menuIcon}>{icon}</Text><Text numberOfLines={2} style={[s.menuText, pathname === path && s.menuTextSelected]}>{label}</Text></Pressable>)}
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="Tutup menu" style={s.backdrop} onPress={() => setMenuOpen(false)} />
    </View>}
  </SafeAreaView>;
}

export function Field({ label, placeholder, multiline, value, onChangeText, keyboardType }: any) {
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput style={[s.input, multiline && s.multiline]} placeholder={placeholder} placeholderTextColor="#e7ebf4" value={value} onChangeText={onChangeText} multiline={multiline} keyboardType={keyboardType} /></View>;
}

export function Action({ label, onPress, outline = false }: { label: string; onPress: () => void; outline?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [s.action, outline ? s.outline : s.filled, pressed && { opacity: 0.75 }]}><Text style={[s.actionText, outline && { color: navy }]}>{label}</Text></Pressable>;
}

export function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
  return <View style={s.card}>{title ? <Text style={s.cardTitle}>{title}</Text> : null}{children}</View>;
}

export function TransactionRow({ item, onPress }: { item: Transaction; onPress: () => void }) {
  return <Pressable style={({ pressed }) => [s.row, pressed && { opacity: 0.8 }]} onPress={onPress}>
    <Text style={s.rowDate}>{item.date}</Text><View style={s.rowMain}><View style={{ flex: 1 }}><Text style={s.rowType}>{item.type}</Text><Text style={s.rowDesc}>{item.description}</Text></View><Text style={s.rowAmount}>{money(item.amount)}  ›</Text></View>
  </Pressable>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  topbar: { height: 48, backgroundColor: navy, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, menuButton: { width: 28, height: 32, alignItems: 'center', justifyContent: 'center' }, menuGlyph: { flexDirection: 'row', alignItems: 'center', gap: 4 }, menuBar: { width: 3, borderRadius: 2, backgroundColor: '#fff' }, menuBarTall: { height: 22 }, menuBarMedium: { height: 15 }, menuBarShort: { height: 8 },
  mark: { width: 24, height: 24, borderRadius: 6, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', color: navy, backgroundColor: '#fff', fontWeight: '900' },
  brandName: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.4 }, topHint: { color: '#dce3f2', fontSize: 10, marginRight: 8 }, logout: { color: '#fff', fontSize: 11, borderWidth: 1, borderColor: '#9baacc', borderRadius: 3, paddingHorizontal: 8, paddingVertical: 5 },
  body: { flex: 1, flexDirection: 'row' }, drawerLayer: { position: 'absolute', top: 48, left: 0, right: 0, bottom: 0, zIndex: 10, flexDirection: 'row' }, backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }, sidebar: { flexGrow: 0, backgroundColor: blue, elevation: 8 }, menuList: { paddingTop: 7 }, menuItem: { minHeight: 48, paddingHorizontal: 14, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 9 }, menuSelected: { backgroundColor: navy }, menuIcon: { color: '#fff', fontSize: 15, width: 20, textAlign: 'center' }, menuText: { color: '#f0f3fa', fontSize: 13, flex: 1 }, menuTextSelected: { color: '#fff', fontWeight: '700' },
  main: { flex: 1, backgroundColor: '#fff' }, adminMain: { marginTop: 62 }, content: { padding: 12, paddingBottom: 28 }, adminContent: { paddingHorizontal: 22, paddingTop: 23, paddingBottom: 35 }, heading: { height: 30, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }, back: { color: navy, fontSize: 23, lineHeight: 25 }, title: { color: navy, fontSize: 13, fontWeight: '700' },
  field: { marginBottom: 10 }, label: { color: navy, fontSize: 11, marginBottom: 4 }, input: { backgroundColor: blue, color: '#fff', minHeight: 34, paddingHorizontal: 8, fontSize: 12, borderRadius: 2 }, multiline: { minHeight: 56, textAlignVertical: 'top', paddingTop: 7 },
  action: { minWidth: 70, minHeight: 34, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 3 }, filled: { backgroundColor: navy }, outline: { borderWidth: 1, borderColor: navy, backgroundColor: '#fff' }, actionText: { color: '#fff', fontSize: 12 },
  card: { backgroundColor: blue, padding: 10, marginBottom: 9, borderRadius: 3 }, cardTitle: { color: '#e8edf7', fontSize: 11, marginBottom: 5 },
  row: { marginTop: 7, borderRadius: 3, overflow: 'hidden' }, rowDate: { color: '#fff', backgroundColor: navy, paddingHorizontal: 8, paddingVertical: 5, fontSize: 10 }, rowMain: { backgroundColor: blue, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, rowType: { color: '#fff', fontWeight: '700', fontSize: 11 }, rowDesc: { color: '#dce3f2', fontSize: 10, marginTop: 3 }, rowAmount: { color: '#fff', fontWeight: '600', fontSize: 10 },
});
