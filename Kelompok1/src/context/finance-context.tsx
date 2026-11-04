import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export type Transaction = {
  id: string;
  date: string;
  type: 'Pemasukan' | 'Pengeluaran';
  description: string;
  amount: number;
  source: string;
  category?: string;
  note: string;
  proof: string;
};

export type AccountSettings = { username: string; password: string; name: string; email: string; photo: string };
export type Role = 'admin' | 'user';
export type AnomalyStatus = 'Perlu Ditinjau' | 'Terkonfirmasi' | 'Tidak terbukti anomali';
type AccountRow = AccountSettings & { role: Role };

type FinanceContextValue = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  anomalyStatuses: Record<string, AnomalyStatus>;
  setAnomalyStatus: (transactionId: string, status: AnomalyStatus) => void;
  getAccount: (role: Role) => AccountSettings;
  authenticate: (username: string, password: string) => Role | null;
  updateProfile: (role: Role, name: string, email: string) => void;
  updateProfilePhoto: (role: Role, photo: string) => void;
  updateUsername: (role: Role, username: string) => boolean;
  updatePassword: (role: Role, currentPassword: string, newPassword: string) => boolean;
};

const defaultAccounts: Record<Role, AccountSettings> = {
  admin: { username: '24880100A', password: 'admin', name: 'Rifa', email: 'rifa@kasino.id', photo: '' },
  user: { username: '24880100U', password: 'user', name: 'Pengguna Kasino', email: 'user@kasino.id', photo: '' },
};

const anomalyStatusValues: AnomalyStatus[] = ['Perlu Ditinjau', 'Terkonfirmasi', 'Tidak terbukti anomali'];

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [anomalyStatuses, setAnomalyStatuses] = useState<Record<string, AnomalyStatus>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const [savedTransactions, savedAccounts, savedStatuses] = await Promise.all([
        db.getAllAsync<Transaction>('SELECT id, date, type, description, amount, source, category, note, proof FROM transactions ORDER BY rowid DESC'),
        db.getAllAsync<AccountRow>('SELECT role, username, password, name, email, photo FROM accounts'),
        db.getAllAsync<{ transaction_id: string; status: string }>('SELECT transaction_id, status FROM anomaly_statuses'),
      ]);
      if (!active) return;
      setTransactions(savedTransactions);
      setAccounts((current) => {
        const next = { ...current };
        for (const row of savedAccounts) next[row.role] = { username: row.username, password: row.password, name: row.name, email: row.email, photo: row.photo };
        return next;
      });
      const statuses: Record<string, AnomalyStatus> = {};
      for (const row of savedStatuses) {
        if (anomalyStatusValues.includes(row.status as AnomalyStatus)) statuses[row.transaction_id] = row.status as AnomalyStatus;
      }
      setAnomalyStatuses(statuses);
      setReady(true);
    };
    loadData().catch((error) => {
      console.error('Gagal membaca database SQLite:', error);
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, [db]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const category = transaction.category ?? '';
    setTransactions((current) => [{ ...transaction, category, id }, ...current]);
    void db.runAsync(
      'INSERT INTO transactions (id, date, type, description, amount, source, category, note, proof) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, transaction.date, transaction.type, transaction.description, transaction.amount, transaction.source, category, transaction.note, transaction.proof,
    ).catch((error) => console.error('Gagal menyimpan transaksi ke SQLite:', error));
  }, [db]);

  const setAnomalyStatus = useCallback((transactionId: string, status: AnomalyStatus) => {
    setAnomalyStatuses((current) => ({ ...current, [transactionId]: status }));
    void db.runAsync('INSERT OR REPLACE INTO anomaly_statuses (transaction_id, status) VALUES (?, ?)', transactionId, status)
      .catch((error) => console.error('Gagal menyimpan status anomali ke SQLite:', error));
  }, [db]);

  const value = useMemo<FinanceContextValue>(() => ({
    transactions,
    addTransaction,
    anomalyStatuses,
    setAnomalyStatus,
    getAccount: (role) => accounts[role],
    authenticate: (username, password) => {
      const normalized = username.trim().toLowerCase();
      const role = (Object.keys(accounts) as Role[]).find((key) => accounts[key].username.toLowerCase() === normalized && accounts[key].password === password);
      return role ?? null;
    },
    updateProfile: (role, name, email) => {
      setAccounts((current) => ({ ...current, [role]: { ...current[role], name, email } }));
      void db.runAsync('UPDATE accounts SET name = ?, email = ? WHERE role = ?', name, email, role).catch((error) => console.error('Gagal menyimpan profil ke SQLite:', error));
    },
    updateProfilePhoto: (role, photo) => {
      setAccounts((current) => ({ ...current, [role]: { ...current[role], photo } }));
      void db.runAsync('UPDATE accounts SET photo = ? WHERE role = ?', photo, role).catch((error) => console.error('Gagal menyimpan foto profil ke SQLite:', error));
    },
    updateUsername: (role, username) => {
      const normalized = username.trim();
      if (!normalized || (Object.keys(accounts) as Role[]).some((key) => key !== role && accounts[key].username.toLowerCase() === normalized.toLowerCase())) return false;
      setAccounts((current) => ({ ...current, [role]: { ...current[role], username: normalized } }));
      void db.runAsync('UPDATE accounts SET username = ? WHERE role = ?', normalized, role).catch((error) => console.error('Gagal menyimpan username ke SQLite:', error));
      return true;
    },
    updatePassword: (role, currentPassword, newPassword) => {
      if (accounts[role].password !== currentPassword || !newPassword) return false;
      setAccounts((current) => ({ ...current, [role]: { ...current[role], password: newPassword } }));
      void db.runAsync('UPDATE accounts SET password = ? WHERE role = ?', newPassword, role).catch((error) => console.error('Gagal menyimpan password ke SQLite:', error));
      return true;
    },
  }), [transactions, accounts, anomalyStatuses, addTransaction, setAnomalyStatus, db]);

  return (
    <FinanceContext.Provider value={value}>
      {ready ? children : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator color="#142F70" />
          <Text style={{ color: '#142F70', marginTop: 8 }}>Memuat database...</Text>
        </View>
      )}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance harus digunakan di dalam FinanceProvider.');
  return context;
}
