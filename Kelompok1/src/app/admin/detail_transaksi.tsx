import { Image, Linking, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FinancePage, money } from '../../components/finance-ui';
import { readEvidence } from '../../components/evidence-picker';
import { useFinance } from '../../context/finance-context';
import { useAppTheme } from '../../context/theme-context';
import { featureStyles } from '../../../assets/styles/finance-features';

export default function DetailTransaksi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useFinance();
  const { colorScheme } = useAppTheme();

  const isDarkMode = colorScheme === 'dark';

  const item = transactions.find((row) => row.id === id);

  const detail = (label: string, value: string) => (
    <View style={featureStyles.detailField}>
      <Text style={featureStyles.detailLabel}>{label}</Text>
      <Text style={featureStyles.detailValue}>{value}</Text>
    </View>
  );

  if (!item) {
    return (
      <FinancePage title="Detail Transaksi">
        <Text style={featureStyles.detailLabel}>Transaksi tidak ditemukan.</Text>
      </FinancePage>
    );
  }

  const evidence = readEvidence(item.proof);

  const proofIsImage = evidence && (evidence.isDocument ? evidence.mimeType?.startsWith('image/') : true);

  return (
    <FinancePage title="Detail Transaksi">
      {detail('Jenis Transaksi', item.type)}

      {detail('Tanggal Transaksi', item.date)}

      {detail(item.type === 'Pemasukan' ? 'Sumber Pemasukan' : 'Jenis Pengeluaran', item.source)}

      {item.type === 'Pengeluaran' && detail('Kategori Pengeluaran', item.category || '-')}

      {detail('Nominal', money(item.amount))}

      {detail('Keterangan', item.note || '-')}

      {/* BUKTI TRANSAKSI */}

      <View style={featureStyles.detailField}>
        <Text style={featureStyles.detailLabel}>Bukti</Text>

        {proofIsImage && evidence ? (
          <Image source={{ uri: evidence.uri }} resizeMode="contain" style={featureStyles.evidenceImage} />
        ) : evidence?.isDocument ? (
          <Pressable onPress={() => void Linking.openURL(evidence.uri)} style={featureStyles.evidenceOpen}>
            <Text style={featureStyles.evidenceOpenText}>Buka file: {evidence.name}</Text>
          </Pressable>
        ) : (
          <Text style={featureStyles.evidenceEmpty}>{item.proof || 'Tidak ada bukti terlampir'}</Text>
        )}
      </View>

      {/* TOMBOL KEMBALI */}

      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Kembali ke halaman sebelumnya"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 7,
          marginTop: 18,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: isDarkMode ? '#FFFFFF' : '#173575',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={15} color={isDarkMode ? '#173575' : '#FFFFFF'} />
        </View>

        <Text
          style={{
            color: isDarkMode ? '#FFFFFF' : '#173575',
            fontSize: 14,
            fontWeight: '700',
          }}
        >
          Kembali
        </Text>
      </Pressable>
    </FinancePage>
  );
}
