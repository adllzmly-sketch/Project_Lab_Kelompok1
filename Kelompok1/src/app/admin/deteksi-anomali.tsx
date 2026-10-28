import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFinance } from '../../context/finance-context';
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
import Header from '../../components/Header'; // Sesuai dengan struktur proyek sebelumnya
import { useAppTheme } from '../../context/theme-context';

// Ikon Panah Kembali
const BackArrowIcon = ({ dark = false }: { dark?: boolean }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke={dark ? '#f8fafc' : '#102A63'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Ikon Transaksi (Kartu Kiri) menyesuaikan referensi terbaru
const TransactionIcon = () => (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
        {/* Bentuk lembaran uang */}
        <Path
            d="M5 9H19C20.1046 9 21 9.89543 21 11V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V11C3 9.89543 3.89543 9 5 9Z"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Lingkaran tengah */}
        <Circle cx="12" cy="13" r="2" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Panah perputaran siklus */}
        <Path
            d="M7 6L4.5 9L7 12M17 20L19.5 17L17 14"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Ikon Kaca Pembesar Anomali (Kartu Kanan)
const AnomalySearchIcon = () => (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
        <Path
            d="M15.5 15.5L20 20M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M10 5.5L13.5 12.5H6.5L10 5.5Z"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinejoin="round"
        />
        <Path
            d="M10 8V10.5M10 11.5H10.01"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </Svg>
);


type AnomalyTransaction = {
    id: string;
    title: string;
    amount: string;
    date: string;
    status:
        | 'Perlu Ditinjau'
        | 'Terkonfirmasi'
        | 'Tidak terbukti anomali';
    detailReason: string;
    isExpanded?: boolean;
};

type AnomalyStatus = Record<
    string,
    AnomalyTransaction['status']
>;

const STATUS_KEY = '@kasino/anomaly-status';

// Aturan awal: transaksi di atas Rp1.000.000 ditandai
// untuk ditinjau. Sesuaikan dengan kebijakan usaha.
const AMOUNT_THRESHOLD = 1_000_000;

export default function DeteksiAnomaliScreen() {
    const router = useRouter();
    const { transactions } = useFinance();
    const { colorScheme } = useAppTheme();
    const isDarkMode = colorScheme === 'dark';

    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<AnomalyStatus>({});
    const [statusLoaded, setStatusLoaded] = useState(false);

    // Muat status pemeriksaan yang tersimpan.
    useEffect(() => {
        let active = true;

        async function loadStatuses() {
            try {
                const saved = await AsyncStorage.getItem(STATUS_KEY);

                if (active && saved) {
                    const parsed: unknown = JSON.parse(saved);

                    if (
                        parsed !== null &&
                        typeof parsed === 'object' &&
                        !Array.isArray(parsed)
                    ) {
                        setStatuses(parsed as AnomalyStatus);
                    }
                }
            } catch (error) {
                console.error(
                    'Gagal memuat status anomali:',
                    error
                );
            } finally {
                if (active) setStatusLoaded(true);
            }
        }

        void loadStatuses();

        return () => {
            active = false;
        };
    }, []);

    // Simpan status setelah data awal selesai dimuat.
    useEffect(() => {
        if (!statusLoaded) return;

        AsyncStorage.setItem(
            STATUS_KEY,
            JSON.stringify(statuses)
        ).catch((error) => {
            console.error(
                'Gagal menyimpan status anomali:',
                error
            );
        });
    }, [statuses, statusLoaded]);

    // Deteksi nominal besar dan transaksi yang berpotensi duplikat.
    const anomaliList = useMemo<AnomalyTransaction[]>(() => {
        const duplicateKeys = new Set<string>();

        const transactionKey = (item: (typeof transactions)[number]) =>
            [
                item.date.trim(),
                item.type,
                item.amount,
                item.source.trim().toLowerCase(),
            ].join('|');

        const counts = new Map<string, number>();

        for (const item of transactions) {
            const key = transactionKey(item);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        for (const [key, count] of counts) {
            if (count > 1) duplicateKeys.add(key);
        }

        return transactions.flatMap((item) => {
            const reasons: string[] = [];
            const key = transactionKey(item);

            if (item.amount > AMOUNT_THRESHOLD) {
                reasons.push(
                    `Nominal ${item.amount.toLocaleString('id-ID')} melebihi batas Rp${AMOUNT_THRESHOLD.toLocaleString('id-ID')}.`
                );
            }

            if (duplicateKeys.has(key)) {
                reasons.push(
                    'Ada transaksi lain dengan tanggal, jenis, nominal, dan sumber yang sama. Periksa apakah transaksi ini duplikat.'
                );
            }

            // Transaksi normal tidak dimasukkan ke daftar anomali.
            if (reasons.length === 0) return [];

            return [{
                id: item.id,
                title:
                    reasons.length > 1
                        ? 'Beberapa Indikasi Anomali'
                        : duplicateKeys.has(key)
                          ? 'Potensi Transaksi Duplikat'
                          : 'Nominal Tidak Wajar',
                amount: `Rp${item.amount.toLocaleString('id-ID')}`,
                date: item.date,
                status: statuses[item.id] ?? 'Perlu Ditinjau',
                detailReason: reasons.join('\n'),
                isExpanded: expandedIds.includes(item.id),
            }];
        });
    }, [transactions, statuses, expandedIds]);

    const toggleDetail = (id: string) => {
        setExpandedIds((previous) =>
            previous.includes(id)
                ? previous.filter((itemId) => itemId !== id)
                : [...previous, id]
        );
    };

    const handleStatusChange = (id: string) => {
        setStatuses((previous) => {
            const current =
                previous[id] ?? 'Perlu Ditinjau';

            let next: AnomalyTransaction['status'];

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
        <Pressable
            style={styles.cardItem}
            onPress={() => toggleDetail(item.id)}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                    {item.isExpanded ? item.detailReason : item.title}
                </Text>

                <Text style={styles.cardAmount}>
                    {item.amount}
                </Text>

                <Text style={styles.cardDate}>
                    {item.date}
                </Text>
            </View>

            <Pressable
                style={styles.statusButton}
                onPress={() => handleStatusChange(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Ubah status ${item.title}`}
            >
                <Text style={styles.statusButtonText}>
                    {item.status}
                </Text>
            </Pressable>
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <Header />

            <View style={styles.subheader}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <BackArrowIcon dark={isDarkMode} />
                </Pressable>

                <Text style={[styles.pageTitle, isDarkMode && styles.textDark]}>
                    Deteksi Anomali
                </Text>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryCardInnerLayout}>
                        <View style={styles.iconContainer}>
                            <TransactionIcon />
                        </View>

                        <View>
                            <Text style={styles.summaryCardLabel}>
                                Total{'\n'}Transaksi
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

                        <View>
                            <Text style={styles.summaryCardLabel}>
                                Anomali{'\n'}Terdeteksi
                            </Text>
                            <Text style={styles.summaryCardValue}>
                                {anomaliList.length}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.listHeader}>
                <Text style={[styles.listTitle, isDarkMode && styles.textDark]}>
                    Daftar Transaksi yang Perlu Diperiksa
                </Text>
            </View>

            <FlatList
                data={anomaliList}
                keyExtractor={(item) => item.id}
                renderItem={renderAnomalyItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.cardDate}>
                        Tidak ditemukan indikasi anomali
                        berdasarkan aturan saat ini.
                    </Text>
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
    containerDark: { backgroundColor: '#111827' },
    textDark: { color: '#f8fafc' },
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
        fontSize: 18,
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
        backgroundColor: '#5F739A',
        height: 96,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    summaryCardInnerLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 10,
    },
    summaryCardLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
    },
    summaryCardValue: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 6,
        opacity: 0.9,
    },
    listHeader: {
        paddingHorizontal: 20,
        marginTop: 28,
        marginBottom: 12,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#102A63',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    cardItem: {
        backgroundColor: '#5F739A',
        minHeight: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
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
        marginBottom: 6,
    },
    cardAmount: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 4,
    },
    cardDate: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    statusButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
    },
    statusButtonText: {
        color: '#102A63',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
