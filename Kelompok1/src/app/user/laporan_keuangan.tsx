import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { blue, Field, FinancePage, money } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function LaporanKeuangan() {
  const [date, setDate] = useState('21 Oktober 2026');
  const { transactions } = useFinance();

  const dailyTransactions = transactions.filter(
    (transaction) => transaction.date === date.trim()
  );

  const income = dailyTransactions
    .filter((transaction) => transaction.type === 'Pemasukan')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expense = dailyTransactions
    .filter((transaction) => transaction.type === 'Pengeluaran')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const reportItems = [
    { label: 'Total Pemasukan', value: income },
    { label: 'Total Pengeluaran', value: expense },
    { label: 'Saldo Akhir', value: income - expense },
  ];

  return (
    <FinancePage title="Laporan Keuangan">
      <Field
        label="Tanggal Laporan"
        placeholder="Pilih tanggal laporan"
        value={date}
        onChangeText={setDate}
      />

      {reportItems.map((item) => (
        <View key={item.label} style={styles.reportCard}>
          <View style={styles.iconPlaceholder} />

          <View>
            <Text style={styles.reportLabel}>{item.label}</Text>

            <Text style={styles.reportValue}>
              {money(item.value)}
            </Text>
          </View>
        </View>
      ))}
    </FinancePage>
  );
}

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: blue,
    padding: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
  },

  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
  },

  reportLabel: {
    color: '#DCE3F2',
    fontSize: 12,
  },

  reportValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 5,
  },
});
