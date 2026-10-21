import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { blue, FinancePage, money, SectionCard, TransactionRow, navy } from './finance-ui';
import { useFinance } from '../context/finance-context';

export function FinanceDashboard({ role }: { role: 'admin' | 'user' }) {
  const { transactions } = useFinance();
  const income = transactions.filter(x => x.type === 'Pemasukan').reduce((sum, x) => sum + x.amount, 0);
  const expense = transactions.filter(x => x.type === 'Pengeluaran').reduce((sum, x) => sum + x.amount, 0);
  const target = role === 'admin' ? '/admin' : '/user';
  return <FinancePage title="Dashboard" role={role}>
    <Text style={{ color: navy, fontWeight: '700', fontSize: 11 }}>Halo, {role === 'admin' ? 'Admin' : 'Pengguna'}!</Text>
    <Text style={{ color: blue, fontSize: 8, marginTop: 3, marginBottom: 10 }}>Ringkasan keuangan usaha Anda hari ini.</Text>
    <SectionCard title="Saldo Kas"><Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{money(income - expense)}</Text><Text style={{ color: '#e4e9f5', fontSize: 8, marginTop: 4 }}>Saldo saat ini</Text></SectionCard>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <View style={{ flex: 1, backgroundColor: '#edf2ec', padding: 8, borderRadius: 3 }}><Text style={{ color: blue, fontSize: 8 }}>Total Pemasukan</Text><Text style={{ color: '#3e7258', fontSize: 9, fontWeight: '700', marginTop: 4 }}>{money(income)}</Text></View>
      <View style={{ flex: 1, backgroundColor: '#f5eeee', padding: 8, borderRadius: 3 }}><Text style={{ color: blue, fontSize: 8 }}>Total Pengeluaran</Text><Text style={{ color: '#a54e55', fontSize: 9, fontWeight: '700', marginTop: 4 }}>{money(expense)}</Text></View>
    </View>
    {role === 'admin' && <View style={{ flexDirection: 'row', gap: 6, marginTop: 9 }}>
      <QuickAction label="+  Pemasukan" path={`${target}/tambah_pemasukan`} />
      <QuickAction label="−  Pengeluaran" path={`${target}/read_pengeluaran`} />
    </View>}
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, marginBottom: 2 }}><Text style={{ color: navy, fontSize: 9, fontWeight: '700' }}>Transaksi Terbaru</Text><Pressable onPress={() => router.push(`${target}/daftar_transaksi` as never)}><Text style={{ color: navy, fontSize: 8 }}>Lihat semua ›</Text></Pressable></View>
    {transactions.slice(0, 3).map(item => <TransactionRow key={item.id} item={item} onPress={() => router.push({ pathname: `${target}/detail_transaksi` as never, params: { id: item.id } })} />)}
  </FinancePage>;
}

function QuickAction({ label, path }: { label: string; path: string }) {
  return <Pressable onPress={() => router.push(path as never)} style={{ flex: 1, height: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: navy, borderRadius: 3 }}><Text style={{ color: navy, fontSize: 8, fontWeight: '600' }}>{label}</Text></Pressable>;
}
