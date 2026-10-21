import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import * as Print from 'expo-print';
import { blue, Field, FinancePage, money, navy } from './finance-ui';
import { Transaction, useFinance } from '../context/finance-context';

export function FinanceReport({ role }: { role: 'admin' | 'user' }) {
  const { transactions } = useFinance();
  const [printing, setPrinting] = useState(false);
  const [date, setDate] = useState('21 Oktober 2026');
  const dailyTransactions = useMemo(() => transactions.filter(item => item.date === date.trim()), [transactions, date]);
  const income = dailyTransactions.filter(item => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
  const expense = dailyTransactions.filter(item => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);
  const net = income - expense;

  const downloadPdf = async () => {
    setPrinting(true);
    try {
      await Print.printAsync({ html: buildHtml(date.trim(), dailyTransactions, income, expense, net) });
    } catch {
      if (Platform.OS !== 'web') Alert.alert('Gagal mencetak laporan', 'Pastikan layanan cetak Android tersedia, lalu coba lagi.');
      else if (typeof window !== 'undefined') window.alert('Gagal membuka dialog cetak. Coba lagi.');
    } finally {
      setPrinting(false);
    }
  };

  const downloadButton = <Pressable accessibilityRole="button" accessibilityLabel="Unduh laporan keuangan dalam PDF" disabled={printing} onPress={downloadPdf} style={{ paddingHorizontal: 7, paddingVertical: 6, borderWidth: 1, borderColor: '#b9c8e5', borderRadius: 3, opacity: printing ? 0.6 : 1 }}>
    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{printing ? 'PDF...' : 'Unduh PDF'}</Text>
  </Pressable>;

  return <FinancePage title="Laporan Keuangan" role={role} headerAction={downloadButton}>
    <Field label="Tanggal Laporan" placeholder="Pilih tanggal laporan" value={date} onChangeText={setDate} />
    {[
      ['Total Pemasukan', income],
      ['Total Pengeluaran', expense],
      ['Saldo Akhir', net],
    ].map(([label, value]) => <View key={String(label)} style={{ backgroundColor: blue, padding: 16, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View style={{ width: 20, height: 20, backgroundColor: '#fff' }} />
      <View><Text style={{ color: '#dce3f2', fontSize: 12 }}>{label}</Text><Text style={{ color: '#fff', fontWeight: '700', marginTop: 5 }}>{money(Number(value))}</Text></View>
    </View>)}
  </FinancePage>;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function buildHtml(date: string, transactions: Transaction[], income: number, expense: number, balance: number) {
  const transactionRows = transactions.length
    ? transactions.map((item, index) => `<tr><td class="center">${index + 1}</td><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.description || item.note || '-')}</td><td class="number">${escapeHtml(money(item.amount))}</td></tr>`).join('')
    : '<tr><td colspan="6" class="empty">Tidak ada transaksi pada tanggal ini.</td></tr>';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    @page { size: A4 landscape; margin: 14mm; } * { box-sizing: border-box; }
    body { font-family: Arial,sans-serif; color: #1c2940; font-size: 12px; } h1 { color: #173575; font-size: 21px; margin: 0 0 4px; }
    .date { color: #5d719f; margin-bottom: 18px; } table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #9eacc4; padding: 8px; } th { background: #173575; color: #fff; text-align: center; }
    .summary { margin-bottom: 20px; } .summary th { background: #dce5f4; color: #173575; }
    .summary td { font-size: 14px; font-weight: bold; text-align: center; }
    .center { text-align: center; } .number { text-align: right; white-space: nowrap; }
    tbody tr:nth-child(even) { background: #f2f5fa; } .empty { text-align: center; color: #7586ad; padding: 18px; }
  </style></head><body><h1>Laporan Keuangan</h1><div class="date">Tanggal laporan: ${escapeHtml(date)}</div>
    <table class="summary"><thead><tr><th>Total Pemasukan</th><th>Total Pengeluaran</th><th>Saldo Akhir</th></tr></thead>
      <tbody><tr><td>${escapeHtml(money(income))}</td><td>${escapeHtml(money(expense))}</td><td>${escapeHtml(money(balance))}</td></tr></tbody></table>
    <table><thead><tr><th>No.</th><th>Tanggal</th><th>Jenis Transaksi</th><th>Sumber</th><th>Keterangan</th><th>Nominal</th></tr></thead>
      <tbody>${transactionRows}</tbody></table>
  </body></html>`;
}
