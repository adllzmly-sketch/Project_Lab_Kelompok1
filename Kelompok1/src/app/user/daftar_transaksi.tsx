import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { blue, FinancePage, TransactionRow } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

const filters = ['Semua', 'Pemasukan', 'Pengeluaran'];

export default function DaftarTransaksi() {
  const [filter, setFilter] = useState('Semua');
  const { transactions } = useFinance();
  const rows = useMemo(() => filter === 'Semua' ? transactions : transactions.filter(item => item.type === filter), [filter, transactions]);
  return <FinancePage title="Daftar Transaksi" role="user" scrollable={false}>
    <FlatList
      style={{ flex: 1 }}
      data={rows}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TransactionRow item={item} onPress={() => router.push({ pathname: '/user/detail_transaksi', params: { id: item.id } })} />}
      ListHeaderComponent={<View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>{filters.map(item => <Pressable key={item} onPress={() => setFilter(item)} style={{ backgroundColor: filter === item ? '#173575' : blue, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: '#fff', fontSize: 12 }}>{item}</Text></Pressable>)}</View>}
      ListEmptyComponent={<Text style={{ color: '#7586ad', fontSize: 12, textAlign: 'center', marginTop: 20 }}>Belum ada transaksi.</Text>}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 12 }}
      keyboardShouldPersistTaps="handled"
    />
  </FinancePage>;
}
