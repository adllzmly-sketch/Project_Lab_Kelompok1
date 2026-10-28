import { useMemo, useState } from 'react';
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Print from 'expo-print';
import { FinancePage, money } from './finance-ui';
import { Transaction, useFinance } from '../context/finance-context';
import { useAppTheme } from '../context/theme-context';
import { featureStyles as s } from '../../assets/styles/finance-features';

export function FinanceReport({ role }: { role: 'admin' | 'user' }) {
  const { transactions } = useFinance();
  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';
  const [printing, setPrinting] = useState(false);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [yearDraft, setYearDraft] = useState(() => String(new Date().getFullYear()));
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const period = useMemo(() => new Date(year, month, 1), [year, month]);
  const periodLabel = formatPeriod(period);
  const openingBalance = useMemo(() => transactions.reduce((balance, item) => {
    const transactionDate = parseTransactionDate(item.date);
    const beforePeriod = transactionDate && (transactionDate.getFullYear() < period.getFullYear() || (transactionDate.getFullYear() === period.getFullYear() && transactionDate.getMonth() < period.getMonth()));
    if (!beforePeriod) return balance;
    return balance + (item.type === 'Pemasukan' ? item.amount : -item.amount);
  }, 0), [transactions, period]);
  const monthlyTransactions = useMemo(() => transactions.filter(item => {
    const transactionDate = parseTransactionDate(item.date);
    return transactionDate?.getFullYear() === period.getFullYear() && transactionDate.getMonth() === period.getMonth();
  }), [transactions, period]);
  const income = monthlyTransactions.filter(item => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
  const expense = monthlyTransactions.filter(item => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);
  const net = openingBalance + income - expense;

  const downloadPdf = async () => {
    setPrinting(true);
    try {
      await Print.printAsync({ html: buildHtml(periodLabel, monthlyTransactions, income, expense, openingBalance, net) });
    } catch {
      if (Platform.OS !== 'web') Alert.alert('Gagal mencetak laporan', 'Pastikan layanan cetak Android tersedia, lalu coba lagi.');
      else if (typeof window !== 'undefined') window.alert('Gagal membuka dialog cetak. Coba lagi.');
    } finally {
      setPrinting(false);
    }
  };

  const downloadButton = <Pressable accessibilityRole="button" accessibilityLabel="Unduh laporan keuangan dalam PDF" disabled={printing} onPress={downloadPdf} style={[s.reportDownload, isDarkMode && s.reportDownloadDark, printing && s.reportDownloadDisabled]}>
    <Text style={[s.reportDownloadText, isDarkMode && s.reportDownloadTextDark]}>{printing ? 'PDF...' : 'Unduh PDF'}</Text>
  </Pressable>;

  return <FinancePage title="Laporan Keuangan" role={role} headerAction={downloadButton}>
    <View style={s.reportFilters}>
      <View style={s.reportFilterField}>
        <Text style={s.reportPeriodLabel}>Bulan</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Pilih bulan laporan" onPress={() => setMonthPickerOpen(true)} style={s.reportPeriodButton}>
          <Text style={s.reportPeriodValue}>{monthNames[month].replace(/^./, letter => letter.toLocaleUpperCase('id-ID'))}</Text>
        </Pressable>
      </View>
      <View style={s.reportFilterField}>
        <Text style={s.reportPeriodLabel}>Tahun</Text>
        <TextInput accessibilityLabel="Tahun laporan" value={yearDraft} onChangeText={value => {
          const digits = value.replace(/\D/g, '').slice(0, 4);
          setYearDraft(digits);
          if (digits.length === 4 && Number(digits) >= 1900 && Number(digits) <= 2100) setYear(Number(digits));
        }} onBlur={() => {
          if (yearDraft.length !== 4 || Number(yearDraft) < 1900 || Number(yearDraft) > 2100) setYearDraft(String(year));
        }} keyboardType="number-pad" maxLength={4} style={s.reportYearInput} />
      </View>
    </View>
    <Modal visible={monthPickerOpen} transparent animationType="fade" onRequestClose={() => setMonthPickerOpen(false)}>
      <View style={s.monthModalOverlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup pilihan bulan" style={StyleSheet.absoluteFill} onPress={() => setMonthPickerOpen(false)} />
        <View style={s.monthModal}>
          <Text style={s.monthModalTitle}>Pilih Bulan</Text>
          <View style={s.monthGrid}>{monthNames.map((name, index) => <Pressable key={name} onPress={() => { setMonth(index); setMonthPickerOpen(false); }} style={[s.monthOption, month === index && s.monthOptionSelected]}><Text style={[s.monthOptionText, month === index && s.monthOptionTextSelected]}>{name.replace(/^./, letter => letter.toLocaleUpperCase('id-ID'))}</Text></Pressable>)}</View>
        </View>
      </View>
    </Modal>
    {[
      ['Total Pemasukan', income],
      ['Total Pengeluaran', expense],
      ['Saldo Awal (Bulan Sebelumnya)', openingBalance],
      ['Saldo Akhir', net],
    ].map(([label, value]) => <View key={String(label)} style={s.reportSummary}>
      <View style={s.reportSummaryIcon} />
      <View><Text style={s.reportSummaryLabel}>{label}</Text><Text style={s.reportSummaryValue}>{money(Number(value))}</Text></View>
    </View>)}
  </FinancePage>;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];

function parseTransactionDate(value: string) {
  const match = value.trim().toLocaleLowerCase('id-ID').match(/^(\d{1,2})\s+([\p{L}]+)\s+(\d{4})$/u);
  if (!match) return null;
  const month = monthNames.indexOf(match[2]);
  if (month < 0) return null;
  return new Date(Number(match[3]), month, Number(match[1]));
}

function formatPeriod(date: Date) {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function buildHtml(date: string, transactions: Transaction[], income: number, expense: number, openingBalance: number, balance: number) {
  const transactionRows = transactions.length
    ? transactions.map((item, index) => `<tr><td class="center">${index + 1}</td><td>${escapeHtml(item.date)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.description || item.note || '-')}</td><td class="number">${escapeHtml(money(item.amount))}</td></tr>`).join('')
    : '<tr><td colspan="6" class="empty">Tidak ada transaksi pada bulan ini.</td></tr>';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    @page { size: A4 landscape; margin: 14mm; } * { box-sizing: border-box; }
    body { font-family: Arial,sans-serif; color: #1c2940; font-size: 12px; } h1 { color: #173575; font-size: 21px; margin: 0 0 4px; }
    .date { color: #5d719f; margin-bottom: 18px; } table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #9eacc4; padding: 8px; } th { background: #173575; color: #fff; text-align: center; }
    .summary { margin-bottom: 20px; } .summary th { background: #dce5f4; color: #173575; }
    .summary td { font-size: 14px; font-weight: bold; text-align: center; }
    .center { text-align: center; } .number { text-align: right; white-space: nowrap; }
    tbody tr:nth-child(even) { background: #f2f5fa; } .empty { text-align: center; color: #7586ad; padding: 18px; }
  </style></head><body><h1>Laporan Keuangan</h1><div class="date">Periode: ${escapeHtml(date)}</div>
    <table class="summary"><thead><tr><th>Total Pemasukan</th><th>Total Pengeluaran</th><th>Saldo Awal</th><th>Saldo Akhir</th></tr></thead>
      <tbody><tr><td>${escapeHtml(money(income))}</td><td>${escapeHtml(money(expense))}</td><td>${escapeHtml(money(openingBalance))}</td><td>${escapeHtml(money(balance))}</td></tr></tbody></table>
    <table><thead><tr><th>No.</th><th>Tanggal</th><th>Jenis Transaksi</th><th>Sumber</th><th>Keterangan</th><th>Nominal</th></tr></thead>
      <tbody>${transactionRows}</tbody></table>
  </body></html>`;
}
