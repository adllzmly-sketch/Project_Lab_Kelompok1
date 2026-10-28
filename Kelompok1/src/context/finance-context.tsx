import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

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

const initialTransactions: Transaction[] = [
  { id: '1', date: '21 Oktober 2026', type: 'Pemasukan', description: 'Penjualan produk', amount: 2500000, source: 'Penjualan', note: 'Pemasukan penjualan hari ini.', proof: '' },
  { id: '2', date: '20 Oktober 2026', type: 'Pengeluaran', description: 'Pembelian bahan', amount: 750000, source: 'Operasional', note: 'Pembelian bahan baku.', proof: '' },
  { id: '3', date: '19 Oktober 2026', type: 'Pemasukan', description: 'Pembayaran pelanggan', amount: 1200000, source: 'Jasa', note: 'Pembayaran layanan.', proof: '' },
];

type FinanceContextValue = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      addTransaction: (transaction) => setTransactions((current) => [{ ...transaction, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }, ...current]),
    }),
    [transactions],
  );
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance harus digunakan di dalam FinanceProvider.');
  return context;
}
