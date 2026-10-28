import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { blue, FinancePage, TransactionRow } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function DaftarTransaksi() {
  const [filter, setFilter] = useState('Semua');
  const { transactions } = useFinance();
  const rows = useMemo(() => filter === 'Semua' ? transactions : transactions.filter(x => x.type === filter), [filter, transactions]);
  return <FinancePage title="Daftar Transaksi">
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
      {['Semua', 'Pemasukan', 'Pengeluaran'].map(item => <Pressable key={item} onPress={() => setFilter(item)} style={{ backgroundColor: filter === item ? '#173575' : blue, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: '#fff', fontSize: 12 }}>{item}</Text></Pressable>)}
    </View>
    {rows.map(item => <TransactionRow key={item.id} item={item} onPress={() => router.push({ pathname: '/user/detail_transaksi', params: { id: item.id } })} />)}
  </FinancePage>;
}