import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { blue, FinancePage, money, SectionCard, TransactionRow, navy } from './finance-ui';
import { useFinance } from '../context/finance-context';
import { useAppTheme } from '../context/theme-context';

const NAVY = '#142F70';
const MUTED = 'rgba(20, 47, 112, 0.7)';
const GREEN = '#00FF40';
const RED = '#F70005';

export function FinanceDashboard({ role }: { role: 'admin' | 'user' }) {
  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';

  const { transactions } = useFinance();

  const [showBalance, setShowBalance] = useState(true);

  const income = transactions.filter((x) => x.type === 'Pemasukan').reduce((sum, x) => sum + x.amount, 0);

  const expense = transactions.filter((x) => x.type === 'Pengeluaran').reduce((sum, x) => sum + x.amount, 0);

  const target = role === 'admin' ? '/admin' : '/user';

  return (
    <FinancePage title="Dashboard" role={role}>
      {/* ================================================
          TAMPILAN ATAS KHUSUS USER
      ================================================ */}

      {role === 'user' ? (
        <>
          {/* SAPAAN */}

          <View style={styles.greeting}>
            <View style={[styles.avatar, isDarkMode && styles.avatarDark]}>
              <Ionicons name="person" size={38} color="#FFFFFF" />
            </View>

            <View style={styles.greetingInfo}>
              <Text style={[styles.hello, isDarkMode && styles.helloDark]}>Halo Pengguna</Text>

              <Text style={[styles.role, isDarkMode && styles.roleDark]}>Pengguna</Text>
            </View>
          </View>

          {/* SALDO KAS */}

          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Saldo Kas</Text>

              <Pressable onPress={() => setShowBalance(!showBalance)} accessibilityRole="button" accessibilityLabel={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'} hitSlop={12}>
                <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text style={styles.balanceAmount}>{showBalance ? money(income - expense) : 'Rp •••••••••'}</Text>

            <Text style={styles.balanceCaption}>Saldo keseluruhan organisasi</Text>
          </View>

          {/* PEMASUKAN & PENGELUARAN */}

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <View style={styles.summaryTitleRow}>
                <Text style={styles.incomeTitle}>Pemasukan</Text>

                <Ionicons name="trending-up-outline" size={22} color={GREEN} />
              </View>

              <Text style={styles.incomeAmount}>{money(income)}</Text>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard, isDarkMode && styles.expenseCardDark]}>
              <View style={styles.summaryTitleRow}>
                <Text style={[styles.expenseTitle, isDarkMode && styles.expenseTitleDark]}>Pengeluaran</Text>

                <Ionicons name="trending-down-outline" size={22} color={RED} />
              </View>

              <Text style={[styles.expenseAmount, isDarkMode && styles.expenseAmountDark]}>{money(expense)}</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* ================================================
              TAMPILAN ADMIN
          ================================================ */}

          <Text
            style={{
              color: isDarkMode ? '#f8fafc' : navy,
              fontWeight: '700',
              fontSize: 11,
            }}
          >
            Halo, Admin!
          </Text>

          <Text
            style={{
              color: isDarkMode ? '#aebbd2' : blue,
              fontSize: 8,
              marginTop: 3,
              marginBottom: 10,
            }}
          >
            Ringkasan keuangan usaha Anda hari ini.
          </Text>

          <SectionCard title="Saldo Kas">
            <Text
              style={{
                color: '#fff',
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              {money(income - expense)}
            </Text>

            <Text
              style={{
                color: '#e4e9f5',
                fontSize: 8,
                marginTop: 4,
              }}
            >
              Saldo saat ini
            </Text>
          </SectionCard>

          <View
            style={{
              flexDirection: 'row',
              gap: 6,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: isDarkMode ? '#202b3e' : '#edf2ec',
                padding: 8,
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? '#c1ccdd' : blue,
                  fontSize: 8,
                }}
              >
                Total Pemasukan
              </Text>

              <Text
                style={{
                  color: '#3e7258',
                  fontSize: 9,
                  fontWeight: '700',
                  marginTop: 4,
                }}
              >
                {money(income)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: isDarkMode ? '#202b3e' : '#f5eeee',
                padding: 8,
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? '#c1ccdd' : blue,
                  fontSize: 8,
                }}
              >
                Total Pengeluaran
              </Text>

              <Text
                style={{
                  color: '#a54e55',
                  fontSize: 9,
                  fontWeight: '700',
                  marginTop: 4,
                }}
              >
                {money(expense)}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              marginTop: 9,
            }}
          >
            <QuickAction label="+  Pemasukan" path={`${target}/tambah_pemasukan`} />

            <QuickAction label="−  Pengeluaran" path={`${target}/read_pengeluaran`} />
          </View>
        </>
      )}

      {/* ================================================
          TRANSAKSI TERBARU
      ================================================ */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 13,
          marginBottom: 2,
        }}
      >
        <Text
          style={{
            color: isDarkMode ? '#f8fafc' : navy,
            fontSize: 9,
            fontWeight: '700',
          }}
        >
          Transaksi Terbaru
        </Text>

        <Pressable onPress={() => router.push(`${target}/daftar_transaksi` as never)}>
          <Text
            style={{
              color: isDarkMode ? '#f8fafc' : navy,
              fontSize: 8,
            }}
          >
            Lihat semua ›
          </Text>
        </Pressable>
      </View>

      {transactions.slice(0, 3).map((item) => (
        <TransactionRow
          key={item.id}
          item={item}
          onPress={() =>
            router.push({
              pathname: `${target}/detail_transaksi` as never,
              params: {
                id: item.id,
              },
            })
          }
        />
      ))}
    </FinancePage>
  );
}

function QuickAction({ label, path }: { label: string; path: string }) {
  const { colorScheme } = useAppTheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Pressable
      onPress={() => router.push(path as never)}
      style={{
        flex: 1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: isDarkMode ? '#aebbd2' : navy,
        borderRadius: 3,
      }}
    >
      <Text
        style={{
          color: isDarkMode ? '#f8fafc' : navy,
          fontSize: 8,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* =====================================================
   STYLE KHUSUS DASHBOARD USER
===================================================== */

const styles = StyleSheet.create({
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

  avatarDark: {
    backgroundColor: '#566176',
  },

  greetingInfo: {
    gap: 4,
  },

  hello: {
    fontSize: 18,
    color: NAVY,
    fontWeight: '600',
  },

  helloDark: {
    color: '#F8FAFC',
  },

  role: {
    color: '#8A94A8',
    fontSize: 12,
  },

  roleDark: {
    color: '#AEBBD2',
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

  expenseCardDark: {
    backgroundColor: '#202B3E',
    borderColor: '#AEBBD2',
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

  expenseTitleDark: {
    color: '#F8FAFC',
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

  expenseAmountDark: {
    color: '#F8FAFC',
  },
});
