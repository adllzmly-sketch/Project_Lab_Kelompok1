import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'kasino.db';

async function columnExists(db: SQLiteDatabase, table: string, column: string) {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  return columns.some((item) => item.name === column);
}

export async function initializeFinanceDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      source TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL,
      proof TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS accounts (
      role TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      photo TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS anomaly_statuses (
      transaction_id TEXT PRIMARY KEY NOT NULL,
      status TEXT NOT NULL
    );
  `);

  // Migrasi untuk database lama (dari versi sebelum kolom kategori ada).
  if (!(await columnExists(db, 'transactions', 'category'))) {
    await db.execAsync("ALTER TABLE transactions ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  }

  const count = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM transactions');
  if (!count?.total) {
    const samples = [
      ['1', '21 Oktober 2026', 'Pemasukan', 'Penjualan produk', 2500000, 'Penjualan', '', 'Pemasukan penjualan hari ini.', ''],
      ['2', '20 Oktober 2026', 'Pengeluaran', 'Pembelian bahan', 750000, 'Operasional', 'Bahan Baku', 'Pembelian bahan baku.', ''],
      ['3', '19 Oktober 2026', 'Pemasukan', 'Pembayaran pelanggan', 1200000, 'Jasa', '', 'Pembayaran layanan.', ''],
    ] as const;
    for (const row of samples) {
      await db.runAsync('INSERT OR IGNORE INTO transactions (id, date, type, description, amount, source, category, note, proof) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', ...row);
    }
  }

  // Akun bawaan mengikuti kredensial login proyek kelompok (admin / user).
  const accountSeeds = [
    ['admin', '24880100A', 'admin', 'Rifa', 'rifa@kasino.id', ''],
    ['user', '24880100U', 'user', 'Pengguna Kasino', 'user@kasino.id', ''],
  ] as const;
  for (const row of accountSeeds) {
    await db.runAsync('INSERT OR IGNORE INTO accounts (role, username, password, name, email, photo) VALUES (?, ?, ?, ?, ?, ?)', ...row);
  }
  await db.runAsync('INSERT OR IGNORE INTO preferences (key, value) VALUES (?, ?)', 'themeMode', 'light');
}
