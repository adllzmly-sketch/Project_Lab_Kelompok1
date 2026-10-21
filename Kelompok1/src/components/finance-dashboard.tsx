import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { blue, FinancePage, money, TransactionRow, navy } from './finance-ui';
import { useFinance } from '../context/finance-context';

export function FinanceDashboard({ role }: { role: 'admin' | 'user' }) {
  const { transactions, themeMode, getAccount } = useFinance();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const dark = themeMode === 'dark';
  const account = getAccount(role);
  const income = transactions.filter(item => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter(item => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);
  const target = role === 'admin' ? '/admin' : '/user';
  const chartMonths = getChartMonths(transactions);

  return <FinancePage title="Dashboard" role={role} showHeading={false}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 2 }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: dark ? '#35415a' : '#dedede', overflow: 'hidden' }}>
        {account.photo ? <Image source={{ uri: account.photo }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
      </View>
      <Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 12 }}>Halo, {account.name}</Text>
    </View>
    <View style={{ backgroundColor: navy, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 7, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#fff', fontSize: 10 }}>Saldo Kas</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={balanceVisible ? 'Sembunyikan saldo' : 'Tampilkan saldo'} onPress={() => setBalanceVisible(value => !value)}><Text style={{ color: '#fff', fontSize: 16 }}>{balanceVisible ? '◎' : '◉'}</Text></Pressable>
      </View>
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, marginTop: 2 }}>{balanceVisible ? money(income - expense) : 'Rp •••••••••'}</Text>
      <Text style={{ color: '#e4e9f5', fontSize: 8, marginTop: 3 }}>Saldo keseluruhan organisasi</Text>
    </View>
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 7 }}>
      <View style={{ flex: 1, backgroundColor: '#8a9bbd', padding: 11, borderRadius: 7 }}><Text style={{ color: '#fff', fontSize: 9 }}>Pemasukan</Text><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 3 }}>{money(income)}</Text></View>
      <View style={{ flex: 1, backgroundColor: dark ? '#1d293b' : '#fff', padding: 11, borderWidth: 1, borderColor: navy, borderRadius: 7 }}><Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 9 }}>Pengeluaran</Text><Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 10, fontWeight: '700', marginTop: 3 }}>{money(expense)}</Text></View>
    </View>
    {role === 'admin' && <FinanceChart months={chartMonths} dark={dark} />}
    <View style={{ borderWidth: 1.5, borderColor: navy, borderRadius: 7, minHeight: 42, alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 12 }}><Text style={{ color: dark ? '#f3f6fc' : '#222', fontSize: 11 }}>Anomali Terdeteksi</Text></View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
      <Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 10, fontWeight: '700' }}>Transaksi Terbaru</Text>
      <Pressable onPress={() => router.push(`${target}/daftar_transaksi` as never)}><Text style={{ color: dark ? '#dce3f2' : navy, fontSize: 9 }}>Lihat semua ›</Text></Pressable>
    </View>
    {transactions.slice(0, 3).map(item => <TransactionRow key={item.id} item={item} onPress={() => router.push({ pathname: `${target}/detail_transaksi` as never, params: { id: item.id } })} />)}
  </FinancePage>;
}

type ChartMonth = { label: string; income: number; expense: number };

function getChartMonths(transactions: ReturnType<typeof useFinance>['transactions']): ChartMonth[] {
  const now = new Date();
  const months: ChartMonth[] = [1, 0].map(offset => {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return { label: date.toLocaleDateString('id-ID', { month: 'short' }), income: 0, expense: 0 };
  });
  const monthIndexes = new Map(months.map((month, index) => [month.label.toLowerCase().replace('.', ''), index]));
  const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
  for (const transaction of transactions) {
    const dateParts = transaction.date.toLowerCase().split(' ');
    const monthNumber = monthNames.indexOf(dateParts[1]);
    if (monthNumber < 0) continue;
    const label = new Date(Number(dateParts[2]), monthNumber, 1).toLocaleDateString('id-ID', { month: 'short' }).toLowerCase().replace('.', '');
    const month = months[monthIndexes.get(label) ?? -1];
    if (!month) continue;
    if (transaction.type === 'Pemasukan') month.income += transaction.amount;
    else month.expense += transaction.amount;
  }
  return months;
}

function FinanceChart({ months, dark }: { months: ChartMonth[]; dark: boolean }) {
  const max = Math.max(1, ...months.flatMap(month => [month.income, month.expense]));
  return <View style={{ marginTop: 3, marginBottom: 7 }}>
    <Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 10, fontWeight: '700', marginBottom: 6 }}>Grafik Pemasukan &amp; Pengeluaran</Text>
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
      <ChartLegend color={navy} label="Pemasukan" dark={dark} />
      <ChartLegend color="#8a9bbd" label="Pengeluaran" dark={dark} />
    </View>
    <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 25, borderBottomWidth: 1, borderBottomColor: '#dce3ef' }}>
      {months.map(month => <View key={month.label} style={{ height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ height: 62, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <View style={{ width: 9, height: Math.max(3, month.income / max * 60), backgroundColor: '#8a9bbd' }} />
          <View style={{ width: 9, height: Math.max(3, month.expense / max * 60), backgroundColor: navy }} />
        </View>
        <Text style={{ color: dark ? '#dce3f2' : navy, fontSize: 8, marginTop: 3 }}>{month.label}</Text>
      </View>)}
    </View>
  </View>;
}

function ChartLegend({ color, label, dark }: { color: string; label: string; dark: boolean }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><View style={{ width: 8, height: 8, borderRadius: 5, backgroundColor: color }} /><Text style={{ color: dark ? '#bdc8da' : blue, fontSize: 8 }}>{label}</Text></View>;
}
