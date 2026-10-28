import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { FinancePage, TransactionRow } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';
import { featureStyles } from '../../../assets/styles/finance-features';

const filters = ['Semua', 'Pemasukan', 'Pengeluaran'];
const PAGE_SIZE = 8;

export default function DaftarTransaksi() {
  const [filter, setFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const { transactions } = useFinance();
  const rows = useMemo(() => filter === 'Semua' ? transactions : transactions.filter(item => item.type === filter), [filter, transactions]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return <FinancePage title="Daftar Transaksi" scrollable={false}>
    <FlatList
      style={featureStyles.list}
      data={pageRows}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TransactionRow item={item} onPress={() => router.push({ pathname: '/admin/detail_transaksi', params: { id: item.id } })} />}
      ListHeaderComponent={<View style={featureStyles.filterRow}>{filters.map(item => <Pressable key={item} onPress={() => { setFilter(item); setPage(1); }} style={[featureStyles.filterButton, filter === item && featureStyles.filterButtonSelected]}><Text style={featureStyles.filterText}>{item}</Text></Pressable>)}</View>}
      ListEmptyComponent={<Text style={featureStyles.listEmpty}>Belum ada transaksi.</Text>}
      ListFooterComponent={rows.length > PAGE_SIZE ? <View style={featureStyles.pagination}>
        <Pressable accessibilityRole="button" disabled={currentPage === 1} onPress={() => setPage(currentPage - 1)} style={[featureStyles.pageButton, currentPage === 1 && featureStyles.pageButtonDisabled]}><Text style={featureStyles.filterText}>Sebelumnya</Text></Pressable>
        <Text style={featureStyles.pageLabel}>Halaman {currentPage} dari {totalPages}</Text>
        <Pressable accessibilityRole="button" disabled={currentPage === totalPages} onPress={() => setPage(currentPage + 1)} style={[featureStyles.pageButton, currentPage === totalPages && featureStyles.pageButtonDisabled]}><Text style={featureStyles.filterText}>Berikutnya</Text></Pressable>
      </View> : null}
      contentContainerStyle={featureStyles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  </FinancePage>;
}
