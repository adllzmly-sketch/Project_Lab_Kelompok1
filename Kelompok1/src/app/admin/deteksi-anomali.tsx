import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';
import { useFinance } from '../../context/finance-context';
import { useAppTheme } from '../../context/theme-context';

type AnomalyStatus =
  | 'Perlu Ditinjau'
  | 'Terkonfirmasi'
  | 'Tidak terbukti anomali';

type AnomalyTransaction = {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: AnomalyStatus;
  detailReason: string;
  isExpanded: boolean;
};

type SavedStatuses = Record<string, AnomalyStatus>;

const STATUS_KEY = '@kasino/anomaly-status';
const AMOUNT_THRESHOLD = 1_000_000;

const BackArrowIcon = ({ dark = false }: { dark?: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={dark ? '#F8FAFC' : '#102A63'}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TransactionIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 9H19C20.1046 9 21 9.89543 21 11V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V11C3 9.89543 3.89543 9 5 9Z"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={13} r={2} stroke="#FFFFFF" strokeWidth={1.5} />
    <Path
      d="M7 6L4.5 9L7 12M17 20L19.5 17L17 14"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AnomalySearchIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 15.5L20 20M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 5.5L13.5 12.5H6.5L10 5.5Z"
      stroke="#FFFFFF"
      strokeWidth={1}
      strokeLinejoin="round"
    />
    <Path
      d="M10 8V10.5M10 11.5H10.01"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default function DeteksiAnomaliScreen() {
  const router = useRouter();
  const { transactions } = useFinance();
  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<SavedStatuses>({});
  const [statusLoaded, setStatusLoaded] = useState(false);

  // Memuat status pemeriksaan yang tersimpan.
  useEffect(() => {
    let active = true;

    const loadStatuses = async () => {
      try {
        const saved = await AsyncStorage.getItem(STATUS_KEY);

        if (saved && active) {
          const parsed: unknown = JSON.parse(saved);

          if (
            parsed !== null &&
            typeof parsed === 'object' &&
            !Array.isArray(parsed)
          ) {
            setStatuses(parsed as SavedStatuses);
          }
        }
      } catch (error) {
        console.error('Gagal memuat status anomali:', error);
      } finally {
        if (active) {
          setStatusLoaded(true);
        }
      }
    };

    void loadStatuses();

    return () => {
      active = false;
    };
  }, []);

  // Menyimpan status setiap kali status pemeriksaan berubah.
  useEffect(() => {
    if (!statusLoaded) return;

    AsyncStorage.setItem(STATUS_KEY, JSON.stringify(statuses)).catch(
      (error) => {
        console.error('Gagal menyimpan status anomali:', error);
      },
    );
  }, [statuses, statusLoaded]);

  // Mendeteksi nominal besar dan transaksi yang berpotensi duplikat.
  const anomalyList = useMemo<AnomalyTransaction[]>(() => {
    const transactionKey = (
      item: (typeof transactions)[number],
    ) =>
      [
        item.date.trim(),
        item.type,
        item.amount,
        item.source.trim().toLowerCase(),
      ].join('|');

    const counts = new Map<string, number>();

    for (const transaction of transactions) {
      const key = transactionKey(transaction);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const duplicateKeys = new Set<string>();

    for (const [key, count] of counts.entries()) {
      if (count > 1) {
        duplicateKeys.add(key);
      }
    }

    return transactions.flatMap((transaction) => {
      const reasons: string[] = [];
      const key = transactionKey(transaction);
      const isDuplicate = duplicateKeys.has(key);

      if (transaction.amount > AMOUNT_THRESHOLD) {
        reasons.push(
          `Nominal Rp${transaction.amount.toLocaleString(
            'id-ID',
          )} melebihi batas Rp${AMOUNT_THRESHOLD.toLocaleString(
            'id-ID',
          )}.`,
        );
      }

      if (isDuplicate) {
        reasons.push(
          'Ada transaksi lain dengan tanggal, jenis, nominal, dan sumber yang sama. Periksa apakah transaksi ini duplikat.',
        );
      }

      // Transaksi normal tidak ditampilkan sebagai anomali.
      if (reasons.length === 0) {
        return [];
      }

      return [
        {
          id: transaction.id,
          title:
            reasons.length > 1
              ? 'Beberapa Indikasi Anomali'
              : isDuplicate
                ? 'Potensi Transaksi Duplikat'
                : 'Nominal Tidak Wajar',
          amount: `Rp${transaction.amount.toLocaleString('id-ID')}`,
          date: transaction.date,
          status: statuses[transaction.id] ?? 'Perlu Ditinjau',
          detailReason: reasons.join('\n'),
          isExpanded: expandedIds.includes(transaction.id),
        },
      ];
    });
  }, [transactions, statuses, expandedIds]);

  const toggleDetail = (id: string) => {
    setExpandedIds((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id],
    );
  };

  const handleStatusChange = (id: string) => {
    setStatuses((previous) => {
      const current = previous[id] ?? 'Perlu Ditinjau';

      let next: AnomalyStatus;

      if (current === 'Perlu Ditinjau') {
        next = 'Terkonfirmasi';
      } else if (current === 'Terkonfirmasi') {
        next = 'Tidak terbukti anomali';
      } else {
        next = 'Perlu Ditinjau';
      }

      return {
        ...previous,
        [id]: next,
      };
    });
  };

  const renderAnomalyItem = ({
    item,
  }: {
    item: AnomalyTransaction;
  }) => (
    <View
      style={[
        styles.cardItem,
        isDarkMode && styles.cardItemDark,
      ]}
    >
      <Pressable
        style={styles.cardContent}
        onPress={() => toggleDetail(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Lihat alasan anomali ${item.title}`}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>

        <Text style={styles.cardAmount}>{item.amount}</Text>

        <Text style={styles.cardDate}>{item.date}</Text>

        {item.isExpanded && (
          <Text style={styles.cardReason}>{item.detailReason}</Text>
        )}

        <Text style={styles.detailHint}>
          {item.isExpanded ? 'Tutup detail ▲' : 'Lihat detail ▼'}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.statusButton,
          item.status === 'Terkonfirmasi' &&
            styles.statusConfirmed,
          item.status === 'Tidak terbukti anomali' &&
            styles.statusRejected,
        ]}
        onPress={() => handleStatusChange(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Ubah status ${item.title}`}
      >
        <Text style={styles.statusButtonText}>{item.status}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode && styles.containerDark,
      ]}
    >
      <Header />

      <View style={styles.subheader}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <BackArrowIcon dark={isDarkMode} />
        </Pressable>

        <Text
          style={[
            styles.pageTitle,
            isDarkMode && styles.textDark,
          ]}
        >
          Deteksi Anomali
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardInnerLayout}>
            <View style={styles.iconContainer}>
              <TransactionIcon />
            </View>

            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryCardLabel}>
                Total
                {'\n'}
                Transaksi
              </Text>

              <Text style={styles.summaryCardValue}>
                {transactions.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryCardInnerLayout}>
            <View style={styles.iconContainer}>
              <AnomalySearchIcon />
            </View>

            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryCardLabel}>
                Anomali
                {'\n'}
                Terdeteksi
              </Text>

              <Text style={styles.summaryCardValue}>
                {anomalyList.length}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text
          style={[
            styles.listTitle,
            isDarkMode && styles.textDark,
          ]}
        >
          Daftar Transaksi yang Perlu Diperiksa
        </Text>

        <Text
          style={[
            styles.listSubtitle,
            isDarkMode && styles.subtitleDark,
          ]}
        >
          Tekan transaksi untuk melihat alasan anomali.
        </Text>
      </View>

      <FlatList
        data={anomalyList}
        keyExtractor={(item) => item.id}
        renderItem={renderAnomalyItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyContainer,
              isDarkMode && styles.emptyContainerDark,
            ]}
          >
            <Text
              style={[
                styles.emptyTitle,
                isDarkMode && styles.textDark,
              ]}
            >
              Tidak ada anomali terdeteksi
            </Text>

            <Text
              style={[
                styles.emptyText,
                isDarkMode && styles.subtitleDark,
              ]}
            >
              Tidak ditemukan indikasi anomali berdasarkan aturan
              pemeriksaan saat ini.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  textDark: {
    color: '#F8FAFC',
  },
  subtitleDark: {
    color: '#CBD5E1',
  },
  subheader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#102A63',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: '#5F739A',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  summaryCardInnerLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  summaryTextContainer: {
    flexShrink: 1,
  },
  summaryCardLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  summaryCardValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },
  listHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#102A63',
  },
  listSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexGrow: 1,
  },
  cardItem: {
    backgroundColor: '#5F739A',
    borderRadius: 12,
    minHeight: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
  },
  cardItemDark: {
    backgroundColor: '#334155',
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  cardAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    color: '#E2E8F0',
    fontSize: 13,
  },
  cardReason: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  detailHint: {
    color: '#E2E8F0',
    fontSize: 11,
    marginTop: 8,
  },
  statusButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 98,
    maxWidth: 120,
  },
  statusConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  statusRejected: {
    backgroundColor: '#F1F5F9',
  },
  statusButtonText: {
    color: '#102A63',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 24,
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyContainerDark: {
    backgroundColor: '#1F2937',
  },
  emptyTitle: {
    color: '#102A63',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
});