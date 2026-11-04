import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/Header';
import { useAppTheme } from '@/context/theme-context';
import { useFinance } from '@/context/finance-context';
import { money } from '@/components/finance-ui';

// WARNA 

const NAVY = '#142F70';
const MUTED = 'rgba(20, 47, 112, 0.7)';
const GREEN = '#00FF40';
const RED = '#F70005';

// Grafik

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const CHART_MAX_HEIGHT = 100;

function monthOf(date: string) {
  const index = MONTHS.findIndex((month) => date.toLowerCase().includes(month.toLowerCase()));
  const year = Number(date.match(/\d{4}/)?.[0] ?? 0);
  return index < 0 ? null : { key: year * 12 + index, label: MONTHS[index].slice(0, 3) };
}

export default function HomeScreen() {

  const [showBalance, setShowBalance] = useState(true);
  const { colorScheme } = useAppTheme();
  const { transactions, getAccount } = useFinance();
  const account = getAccount('admin');

  const income = transactions.filter((item) => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);

  // Dua bulan terakhir yang memiliki transaksi, dihitung dari data SQLite.
  const chartData = useMemo(() => {
    const totals = new Map<number, { month: string; income: number; expense: number }>();
    for (const item of transactions) {
      const month = monthOf(item.date);
      if (!month) continue;
      const entry = totals.get(month.key) ?? { month: month.label, income: 0, expense: 0 };
      if (item.type === 'Pemasukan') entry.income += item.amount;
      else entry.expense += item.amount;
      totals.set(month.key, entry);
    }
    const recent = [...totals.entries()].sort((a, b) => a[0] - b[0]).slice(-2).map(([, value]) => value);
    const max = Math.max(1, ...recent.flatMap((item) => [item.income, item.expense]));
    return recent.map((item) => ({
      month: item.month,
      income: Math.max(2, Math.round((item.income / max) * CHART_MAX_HEIGHT)),
      expense: Math.max(2, Math.round((item.expense / max) * CHART_MAX_HEIGHT)),
    }));
  }, [transactions]);
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkBackground]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      <Header />

      <ScrollView style={[styles.scroll, isDarkMode && styles.darkBackground]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.greeting}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={38} color="#FFFFFF" />
          </View>

          <View style={styles.greetingInfo}>
            <Text style={[styles.hello, isDarkMode && styles.darkText]}>Halo {account.name}</Text>

            <Text style={styles.role}>Administrator</Text>
          </View>
        </View>
         
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo Kas</Text>

            <Pressable onPress={() => setShowBalance(!showBalance)} accessibilityRole="button" accessibilityLabel={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'} hitSlop={12}>
              <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.balanceAmount}>{showBalance ? money(income - expense) : 'Rp. •••••••••'}</Text>

          <Text style={styles.balanceCaption}>Saldo keseluruhan organisasi</Text>
        </View>

        <View style={styles.summaryRow}>
          {/* PEMASUKAN */}

          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.summaryTitleRow}>
              <Text style={styles.incomeTitle}>Pemasukan</Text>

              <Ionicons name="trending-up-outline" size={22} color={GREEN} />
            </View>

            <Text style={styles.incomeAmount}>{money(income)}</Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard, isDarkMode && styles.darkCard]}>
            <View style={styles.summaryTitleRow}>
              <Text style={[styles.expenseTitle, isDarkMode && styles.darkText]}>Pengeluaran</Text>

              <Ionicons name="trending-down-outline" size={22} color={RED} />
            </View>

            <Text style={[styles.expenseAmount, isDarkMode && styles.darkText]}>{money(expense)}</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Grafik Pemasukan & Pengeluaran</Text>

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

          <View style={styles.chart}>
            {chartData.map((item) => (
              <View key={item.month} style={styles.barGroup}>
                <View style={styles.bars}>

                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      {
                        height: item.income,
                      },
                    ]}
                  />

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

                <Text style={[styles.monthLabel, isDarkMode && styles.darkText]}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.anomalyCard, isDarkMode && styles.darkCard, pressed && styles.anomalyPressed]}
          onPress={() => router.push('/admin/deteksi-anomali')}
          accessibilityRole="button"
          accessibilityLabel="Buka deteksi anomali"
        >
          <Ionicons name="alert-circle-outline" size={25} color={NAVY} />

          <View style={styles.anomalyInfo}>
            <Text style={[styles.anomalyTitle, isDarkMode && styles.darkText]}>Anomali Terdeteksi</Text>

            <Text style={styles.anomalySubtitle}>Periksa transaksi tidak wajar</Text>
          </View>

          <Ionicons name="chevron-forward" size={21} color={NAVY} />
        </Pressable>


        <Text style={styles.footer}>KASINO · Kas Informasi Organisasi</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkBackground: { backgroundColor: '#111827' },
  darkCard: { backgroundColor: '#202b3e' },
  darkText: { color: '#f8fafc' },

   
  scroll: {
    flex: 1,

  
    marginTop: 62,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 35,
  },

 
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
