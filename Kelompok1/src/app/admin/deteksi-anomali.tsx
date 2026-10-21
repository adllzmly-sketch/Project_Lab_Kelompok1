import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import Header from '../../components/Header'; // Memanggil komponen header yang dipisah

// Ikon Panah Kembali
const BackArrowIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#102A63"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Tipe Data Dummy
type AnomalyTransaction = {
    id: string;
    title: string;
    amount: string;
    date: string;
    status: 'Perlu Ditinjau' | 'Menunggu validasi' | 'Terkonfirmasi' | 'Tidak terbukti anomali';
    detailReason?: string;
    isExpanded?: boolean;
};

export default function DeteksiAnomaliScreen() {
    const router = useRouter();

    const [totalTransaksi] = useState<string>('Angka'); // Mengikuti referensi "Angka"

    // Data simulasi anomali
    const [anomaliList, setAnomaliList] = useState<AnomalyTransaction[]>([
        {
            id: '1',
            title: 'Nominal Tidak Wajar',
            amount: 'Rp. Jumlah Nominal',
            date: 'Tanggal Transaksi',
            status: 'Perlu Ditinjau',
            detailReason: 'Selisih Rp10.000 antara hasil perhitungan dan total pembanding', // Alasan simulasi sesuai instruksi
            isExpanded: false,
        },
    ]);

    // Fungsi 1: Menampilkan Detail dan Alasan Deteksi
    const toggleDetail = (id: string) => {
        setAnomaliList((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
            )
        );
    };

    // Fungsi 2: Simulasi Validasi & Konfirmasi Transaksi
    const handleStatusChange = (id: string) => {
        setAnomaliList((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    let nextStatus: AnomalyTransaction['status'] = item.status;
                    if (item.status === 'Perlu Ditinjau') nextStatus = 'Menunggu validasi';
                    else if (item.status === 'Menunggu validasi') nextStatus = 'Terkonfirmasi';
                    else if (item.status === 'Terkonfirmasi') nextStatus = 'Tidak terbukti anomali';
                    else nextStatus = 'Perlu Ditinjau';
                    return { ...item, status: nextStatus };
                }
                return item;
            })
        );
    };

    const renderAnomalyItem = ({ item }: { item: AnomalyTransaction }) => (
        // Menekan kartu akan membuka detail alasan (simulasi fungsionalitas UI)
        <Pressable style={styles.cardItem} onPress={() => toggleDetail(item.id)}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                    {item.isExpanded ? item.detailReason : item.title}
                </Text>
                <Text style={styles.cardAmount}>{item.amount}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>

            {/* Menekan status (tombol oval) akan mengubah siklus status */}
            <Pressable
                style={styles.statusButton}
                onPress={() => handleStatusChange(item.id)}
            >
                <Text style={styles.statusButtonText}>{item.status}</Text>
            </Pressable>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Header Diekstrak */}
            <Header />

            {/* 2. Subheader Navigasi */}
            <View style={styles.subheader}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <BackArrowIcon />
                </Pressable>
                <Text style={styles.pageTitle}>Deteksi Anomali</Text>
            </View>

            {/* 3. Kartu Ringkasan */}
            <View style={styles.summaryContainer}>
                {/* Total Transaksi */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryCardLabel}>Total{'\n'}Transaksi</Text>
                    <Text style={styles.summaryCardValue}>{totalTransaksi}</Text>
                </View>

                {/* Anomali Terdeteksi */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryCardRightLayout}>
                        <View style={styles.whiteSquare} />
                        <View>
                            <Text style={styles.summaryCardLabelLeft}>Anomali{'\n'}Terdeteksi</Text>
                            <Text style={styles.summaryCardValueLeft}>Angka</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 4. Judul Daftar Anomali */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Deteksi Anomali</Text>
            </View>

            {/* 5. Daftar Transaksi */}
            <FlatList
                data={anomaliList}
                keyExtractor={(item) => item.id}
                renderItem={renderAnomalyItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    summaryCardLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '400',
        lineHeight: 18,
    },
    summaryCardValue: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 6,
        opacity: 0.9,
    },
    summaryCardRightLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteSquare: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        marginRight: 12,
    },
    summaryCardLabelLeft: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
    },
    summaryCardValueLeft: {
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
        marginBottom: 6,
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