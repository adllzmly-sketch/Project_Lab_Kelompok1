import { Image, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { blue, FinancePage, money } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function DetailTransaksi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useFinance();
  const item = transactions.find(row => row.id === id);
  const detail = (label: string, value: string) => <View style={{ marginBottom: 15 }}><Text style={{ color: '#7586ad', marginBottom: 6 }}>{label}</Text><Text style={{ backgroundColor: blue, color: '#fff', padding: 12 }}>{value}</Text></View>;
  if (!item) return <FinancePage title="Detail Transaksi"><Text style={{ color: '#7586ad' }}>Transaksi tidak ditemukan.</Text></FinancePage>;
  const proofIsImage = /^(file|content|https?|data):/.test(item.proof);
  return <FinancePage title="Detail Transaksi">
    {detail('Jenis Transaksi', item.type)}{detail('Tanggal Transaksi', item.date)}{detail(item.type === 'Pemasukan' ? 'Sumber Pemasukan' : 'Jenis Pengeluaran', item.source)}{detail('Nominal', money(item.amount))}{detail('Keterangan', item.note || '-')}
    <View style={{ marginBottom: 15 }}>
      <Text style={{ color: '#7586ad', marginBottom: 6 }}>Bukti</Text>
      {proofIsImage ? <Image source={{ uri: item.proof }} resizeMode="contain" style={{ width: '100%', height: 240, backgroundColor: '#eef1f7', borderRadius: 3 }} /> : <Text style={{ backgroundColor: blue, color: '#fff', padding: 12 }}>{item.proof || 'Tidak ada bukti terlampir'}</Text>}
    </View>
  </FinancePage>;
}
