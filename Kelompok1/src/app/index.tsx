import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const navy = '#173575';
const blue = '#5d719f';

const adminLinks = [
  { title: 'Catat Pemasukan', route: '/admin/tambah_pemasukan', icon: '+' },
  { title: 'Catat Pengeluaran', route: '/admin/read_pengeluaran', icon: '−' },
  { title: 'Daftar Transaksi', route: '/admin/daftar_transaksi', icon: '↗' },
  { title: 'Laporan Keuangan', route: '/admin/laporan_keuangan', icon: '▤' },
];

const userLinks = [
  { title: 'Daftar Transaksi', route: '/user/daftar_transaksi', icon: '↗' },
  { title: 'Laporan Keuangan', route: '/user/laporan_keuangan', icon: '▤' },
];

function LinkCard({ title, route, icon }: { title: string; route: string; icon: string }) {
  return <Pressable onPress={() => router.push(route as never)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.icon}><Text style={styles.iconText}>{icon}</Text></View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.arrow}>›</Text>
  </Pressable>;
}

export default function HomeScreen() {
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}><Text style={styles.brandMark}>Ⅱ·</Text><Text style={styles.brand}>▣  KASINO</Text></View>
      <View style={styles.welcome}><Text style={styles.eyebrow}>MANAJEMEN KAS</Text><Text style={styles.heading}>Keuangan usaha, lebih teratur.</Text><Text style={styles.subtitle}>Pilih menu untuk mengelola dan melihat transaksi.</Text></View>
      <Text style={styles.section}>ADMIN</Text>
      <View style={styles.grid}>{adminLinks.map(link => <LinkCard key={link.title} {...link} />)}</View>
      <Text style={[styles.section, { marginTop: 28 }]}>USER</Text>
      <View style={styles.grid}>{userLinks.map(link => <LinkCard key={link.title} {...link} />)}</View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6fb' },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 32 },
  header: { height: 58, backgroundColor: navy, marginHorizontal: -22, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandMark: { color: '#fff', fontWeight: '700', fontSize: 23 }, brand: { color: '#fff', fontWeight: '700', fontSize: 15 },
  welcome: { paddingTop: 34, paddingBottom: 27 }, eyebrow: { color: blue, letterSpacing: 1.4, fontSize: 12, fontWeight: '700' },
  heading: { color: navy, fontSize: 28, fontWeight: '700', marginTop: 8 }, subtitle: { color: '#697797', fontSize: 15, marginTop: 7 },
  section: { color: navy, fontWeight: '700', letterSpacing: 1, fontSize: 13, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, minHeight: 88, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, flexGrow: 1, flexBasis: 250, borderWidth: 1, borderColor: '#e4e9f3' },
  icon: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9eef9' }, iconText: { fontSize: 22, color: navy, fontWeight: '700' },
  cardTitle: { color: navy, fontWeight: '600', fontSize: 15, flex: 1 }, arrow: { color: blue, fontSize: 26 }, pressed: { opacity: 0.7 },
});
