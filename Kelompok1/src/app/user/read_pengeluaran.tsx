import { Text } from 'react-native';
import { router } from 'expo-router';
import { FinancePage, TransactionRow } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function RiwayatPengeluaran() {
  const { transactions } = useFinance();
  const expenses = transactions.filter(item => item.type === 'Pengeluaran');
  return <FinancePage title="Riwayat Pengeluaran" role="user">
    {expenses.length ? expenses.map(item => <TransactionRow key={item.id} item={item} onPress={() => router.push({ pathname: '/user/detail_transaksi', params: { id: item.id } })} />) : <Text style={{ color: '#7586ad', fontSize: 12 }}>Belum ada transaksi pengeluaran.</Text>}
  </FinancePage>;
}
