import { Image, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FinancePage, money } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

const cardColor = '#5c6d9b';

export default function DetailTransaksi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useFinance();
  const item = transactions.find(row => row.id === id);

  if (!item) {
    return (
      <FinancePage title="Detail Transaksi">
        <Text style={{ color: '#7586ad' }}>Transaksi tidak ditemukan.</Text>
      </FinancePage>
    );
  }

  const proofs: string[] = Array.isArray(item.proof)
    ? item.proof
    : item.proof
    ? String(item.proof).split(',').map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <FinancePage title="Detail Transaksi">
      <View style={{ backgroundColor: cardColor, borderRadius: 22, padding: 21 }}>
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 26,
            marginBottom: 18,
          }}
        >
          <Text style={{ color: '#000', fontSize: 14 }}>{item.type}</Text>
        </View>

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{item.source}</Text>
        <Text style={{ color: '#fff', fontSize: 17, marginTop: 6 }}>{money(item.amount)}</Text>
        <Text style={{ color: '#fff', fontSize: 14, marginTop: 6 }}>{item.date}</Text>

        {item.note ? (
          <Text style={{ color: '#fff', fontSize: 14, marginTop: 6 }}>{item.note}</Text>
        ) : null}

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 28 }}>
          Bukti Transaksi
        </Text>

        {proofs.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 18 }}>
            {proofs.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                resizeMode="cover"
                style={{
                  width: 73,
                  height: 73,
                  backgroundColor: '#fff',
                  marginRight: 18,
                  marginBottom: 12,
                }}
              />
            ))}
          </View>
        ) : (
          <Text style={{ color: '#fff', fontSize: 14, marginTop: 14 }}>
            Tidak ada bukti terlampir
          </Text>
        )}
      </View>
    </FinancePage>
  );
}