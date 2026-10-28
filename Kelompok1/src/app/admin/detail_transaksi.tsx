import { Image, Linking, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FinancePage, money } from '../../components/finance-ui';
import { readEvidence } from '../../components/evidence-picker';
import { useFinance } from '../../context/finance-context';
import { featureStyles } from '../../../assets/styles/finance-features';

export default function DetailTransaksi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useFinance();
  const item = transactions.find(row => row.id === id);
  const detail = (label: string, value: string) => <View style={featureStyles.detailField}><Text style={featureStyles.detailLabel}>{label}</Text><Text style={featureStyles.detailValue}>{value}</Text></View>;
  if (!item) return <FinancePage title="Detail Transaksi"><Text style={featureStyles.detailLabel}>Transaksi tidak ditemukan.</Text></FinancePage>;
  const evidence = readEvidence(item.proof);
  const proofIsImage = evidence && (evidence.isDocument ? evidence.mimeType?.startsWith('image/') : true);
  return <FinancePage title="Detail Transaksi">
    {detail('Jenis Transaksi', item.type)}{detail('Tanggal Transaksi', item.date)}{detail(item.type === 'Pemasukan' ? 'Sumber Pemasukan' : 'Jenis Pengeluaran', item.source)}{detail('Nominal', money(item.amount))}{detail('Keterangan', item.note || '-')}
    <View style={featureStyles.detailField}>
      <Text style={featureStyles.detailLabel}>Bukti</Text>
      {proofIsImage && evidence ? <Image source={{ uri: evidence.uri }} resizeMode="contain" style={featureStyles.evidenceImage} /> : evidence?.isDocument ? <Pressable onPress={() => void Linking.openURL(evidence.uri)} style={featureStyles.evidenceOpen}><Text style={featureStyles.evidenceOpenText}>Buka file: {evidence.name}</Text></Pressable> : <Text style={featureStyles.evidenceEmpty}>{item.proof || 'Tidak ada bukti terlampir'}</Text>}
    </View>
  </FinancePage>;
}
