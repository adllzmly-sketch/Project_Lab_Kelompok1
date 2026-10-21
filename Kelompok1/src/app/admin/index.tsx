import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/Header';

/* =====================================================
   WARNA
===================================================== */

const NAVY = '#193779';
const MUTED = '#8B9ABE';
const GREEN = '#39F15B';
const RED = '#FF3030';

/* =====================================================
   DATA GRAFIK
===================================================== */

const chartData = [
  {
    month: 'Okt',
    income: 65,
    expense: 45,
  },
  {
    month: 'Nov',
    income: 80,
    expense: 65,
  },
];

/* =====================================================
   HOME SCREEN
===================================================== */

export default function HomeScreen() {
  /* ============================
     STATE SALDO
  ============================ */

  const [showBalance, setShowBalance] = useState(true);

  /* =====================================================
     TAMPILAN
  ===================================================== */

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      {/* =================================================
          HEADER + DRAWER REUSABLE
      ================================================= */}

      <Header />

      {/* =================================================
          KONTEN DASHBOARD
      ================================================= */}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* =========================
            SAPAAN
        ========================= */}

        <View style={styles.greeting}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={38} color="#FFFFFF" />
          </View>

          <View style={styles.greetingInfo}>
            <Text style={styles.hello}>Halo Rifa</Text>

            <Text style={styles.role}>Administrator</Text>
          </View>
        </View>

        {/* =========================
            SALDO KAS
        ========================= */}

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo Kas</Text>

            {/* BUTTON LIHAT / SEMBUNYIKAN SALDO */}

            <Pressable onPress={() => setShowBalance(!showBalance)} accessibilityRole="button" accessibilityLabel={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'} hitSlop={12}>
              <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.balanceAmount}>{showBalance ? 'Rp. 10.000.000' : 'Rp. •••••••••'}</Text>

          <Text style={styles.balanceCaption}>Saldo keseluruhan organisasi</Text>
        </View>

        {/* =================================================
            RINGKASAN PEMASUKAN & PENGELUARAN
        ================================================= */}

        <View style={styles.summaryRow}>
          {/* PEMASUKAN */}

          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.summaryTitleRow}>
              <Text style={styles.incomeTitle}>Pemasukan</Text>

              <Ionicons name="trending-up-outline" size={22} color={GREEN} />
            </View>

            <Text style={styles.incomeAmount}>Rp.200.000</Text>
          </View>

          {/* PENGELUARAN */}

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.summaryTitleRow}>
              <Text style={styles.expenseTitle}>Pengeluaran</Text>

              <Ionicons name="trending-down-outline" size={22} color={RED} />
            </View>

            <Text style={styles.expenseAmount}>Rp.200.000</Text>
          </View>
        </View>

        {/* =================================================
            GRAFIK
        ================================================= */}

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Grafik Pemasukan & Pengeluaran</Text>

          {/* LEGEND */}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: NAVY,
                  },
                ]}
              />

              <Text style={styles.legendText}>Pemasukan</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: MUTED,
                  },
                ]}
              />

              <Text style={styles.legendText}>Pengeluaran</Text>
            </View>
          </View>

          {/* BAR CHART */}

          <View style={styles.chart}>
            {chartData.map((item) => (
              <View key={item.month} style={styles.barGroup}>
                <View style={styles.bars}>
                  {/* BAR PEMASUKAN */}

                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      {
                        height: item.income,
                      },
                    ]}
                  />

                  {/* BAR PENGELUARAN */}

                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      {
                        height: item.expense,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.monthLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* =================================================
            CARD DETEKSI ANOMALI
        ================================================= */}

        <Pressable style={({ pressed }) => [styles.anomalyCard, pressed && styles.anomalyPressed]} onPress={() => console.log('Deteksi Anomali diklik')} accessibilityRole="button" accessibilityLabel="Buka deteksi anomali">
          <Ionicons name="alert-circle-outline" size={25} color={NAVY} />

          <View style={styles.anomalyInfo}>
            <Text style={styles.anomalyTitle}>Anomali Terdeteksi</Text>

            <Text style={styles.anomalySubtitle}>Periksa transaksi tidak wajar</Text>
          </View>

          <Ionicons name="chevron-forward" size={21} color={NAVY} />
        </Pressable>

        {/* =========================
            FOOTER
        ========================= */}

        <Text style={styles.footer}>KASINO · Kas Informasi Organisasi</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================================================
   STYLE
===================================================== */

const styles = StyleSheet.create({
  /* =================================================
     SAFE AREA
  ================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* =================================================
     SCROLL
  ================================================= */

  scroll: {
    flex: 1,

    /*
      Memberikan ruang karena Header
      menggunakan position absolute.
    */

    marginTop: 62,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 35,
  },

  /* =================================================
     SAPAAN
  ================================================= */

  greeting: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 16,

    marginBottom: 23,
  },

  avatar: {
    width: 70,
    height: 70,

    borderRadius: 35,

    backgroundColor: '#D9DDE5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  greetingInfo: {
    gap: 4,
  },

  hello: {
    fontSize: 18,

    color: NAVY,

    fontWeight: '600',
  },

  role: {
    color: '#8A94A8',

    fontSize: 12,
  },

  /* =================================================
     SALDO
  ================================================= */

  balanceCard: {
    backgroundColor: NAVY,

    borderRadius: 13,

    paddingHorizontal: 19,
    paddingVertical: 16,

    marginBottom: 19,
  },

  balanceHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '600',
  },

  balanceAmount: {
    color: '#FFFFFF',

    fontSize: 27,

    fontWeight: '800',

    marginTop: 5,
  },

  balanceCaption: {
    color: '#D4DDF0',

    fontSize: 10,

    marginTop: 5,
  },

  /* =================================================
     RINGKASAN
  ================================================= */

  summaryRow: {
    flexDirection: 'row',

    gap: 10,

    marginBottom: 22,
  },

  summaryCard: {
    flex: 1,

    minWidth: 0,

    borderRadius: 13,

    paddingHorizontal: 11,
    paddingVertical: 13,

    borderWidth: 1.5,
  },

  incomeCard: {
    backgroundColor: MUTED,
    borderColor: MUTED,
  },

  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderColor: NAVY,
  },

  summaryTitleRow: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    gap: 3,
  },

  incomeTitle: {
    color: '#FFFFFF',

    fontSize: 12,

    fontWeight: '500',
  },

  expenseTitle: {
    color: NAVY,

    fontSize: 12,

    fontWeight: '500',
  },

  incomeAmount: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '700',

    marginTop: 5,
  },

  expenseAmount: {
    color: NAVY,

    fontSize: 14,

    fontWeight: '700',

    marginTop: 5,
  },

  /* =================================================
     GRAFIK
  ================================================= */

  chartSection: {
    marginBottom: 30,
  },

  sectionTitle: {
    color: NAVY,

    fontSize: 14,

    fontWeight: '700',

    marginBottom: 11,
  },

  legend: {
    gap: 7,

    marginBottom: 14,
  },

  legendItem: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  legendDot: {
    width: 17,
    height: 17,

    borderRadius: 9,
  },

  legendText: {
    color: '#64728E',

    fontSize: 11,
  },

  chart: {
    height: 135,

    flexDirection: 'row',

    alignItems: 'flex-end',

    gap: 28,

    paddingLeft: 17,
  },

  barGroup: {
    alignItems: 'center',

    gap: 7,
  },

  bars: {
    height: 112,

    flexDirection: 'row',

    alignItems: 'flex-end',

    gap: 5,
  },

  bar: {
    width: 13,

    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },

  incomeBar: {
    backgroundColor: NAVY,
  },

  expenseBar: {
    backgroundColor: MUTED,
  },

  monthLabel: {
    color: NAVY,

    fontSize: 11,

    fontWeight: '600',
  },

  /* =================================================
     ANOMALI
  ================================================= */

  anomalyCard: {
    minHeight: 76,

    borderWidth: 2,

    borderColor: NAVY,

    borderRadius: 13,

    paddingHorizontal: 13,
    paddingVertical: 12,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    backgroundColor: '#FFFFFF',
  },

  anomalyPressed: {
    backgroundColor: '#F0F3FA',
  },

  anomalyInfo: {
    flex: 1,

    gap: 4,
  },

  anomalyTitle: {
    color: NAVY,

    fontSize: 13,

    fontWeight: '700',
  },

  anomalySubtitle: {
    color: '#7C88A2',

    fontSize: 10,
  },

  footer: {
    color: '#A0A8B8',

    fontSize: 10,

    textAlign: 'center',

    marginTop: 24,
  },
});
