import { Text, View } from 'react-native';
import { useState } from 'react';
import { blue, Field, FinancePage, money } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function LaporanKeuangan() {
  const [date, setDate] = useState('21 Oktober 2026');
  const { transactions } = useFinance();
  const dailyTransactions = transactions.filter(x => x.date === date.trim());
  const income = dailyTransactions.filter(x => x.type === 'Pemasukan').reduce((sum, x) => sum + x.amount, 0);
  const expense = dailyTransactions.filter(x => x.type === 'Pengeluaran').reduce((sum, x) => sum + x.amount, 0);
  return <FinancePage title="Laporan Keuangan">
    <Field label="Tanggal Laporan" placeholder="Pilih tanggal laporan" value={date} onChangeText={setDate} />
    {[['Total Pemasukan', income], ['Total Pengeluaran', expense], ['Saldo Akhir', income - expense]].map(([label, value]) => <View key={String(label)} style={{ backgroundColor: blue, padding: 16, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 14 }}><View style={{ width: 20, height: 20, backgroundColor: '#fff' }} /><View><Text style={{ color: '#dce3f2', fontSize: 12 }}>{label}</Text><Text style={{ color: '#fff', fontWeight: '700', marginTop: 5 }}>{money(Number(value))}</Text></View></View>)}
  </FinancePage>;
}
