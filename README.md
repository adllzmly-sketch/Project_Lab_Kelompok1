# KASINO - Kas Informasi Organisasi

## Deskripsi Aplikasi

KASINO (Kas Informasi Organisasi) merupakan aplikasi yang dirancang untuk membantu pengelolaan keuangan kas organisasi mahasiswa secara lebih terstruktur dan transparan. Aplikasi ini menyediakan fitur pencatatan pemasukan dan pengeluaran, pengelolaan transaksi, laporan keuangan, serta deteksi anomali transaksi berbasis Rule-Based AI.

KASINO memiliki dua jenis pengguna, yaitu Admin/Bendahara dan User/Anggota. Admin dapat mengelola transaksi dan keuangan organisasi, sedangkan User dapat melihat informasi keuangan sebagai bentuk transparansi pengelolaan kas.

## Daftar Screen dan Fitur UI

### 1. Login
Halaman Login digunakan sebagai halaman awal untuk masuk ke dalam aplikasi menggunakan akun yang telah tersedia.

Fitur UI:
- Input email
- Input password
- Tombol tampil/sembunyikan password
- Tombol Masuk

<img width="1080" height="1920" alt="image" src="https://github.com/user-attachments/assets/90525b65-f4e7-48e9-afc7-51c0c2bf9c0c" />

### 2. Dashboard Admin
Dashboard Admin menampilkan ringkasan kondisi keuangan organisasi sehingga admin dapat melihat informasi utama secara cepat.

Fitur UI:
- Saldo kas
- Total pemasukan
- Total pengeluaran
- Total transaksi
- Grafik keuangan
- Informasi deteksi anomali
- Drawer menu navigasi

<img width="1080" height="1920" alt="image" src="https://github.com/user-attachments/assets/1d62ae7a-d32e-4641-8597-ac5b50f53d4a" />

### 3. Tambah Pemasukan
Halaman ini digunakan untuk mencatat data pemasukan kas organisasi.

Fitur UI:
- Input sumber pemasukan
- Input nominal
- Input tanggal
- Input keterangan
- Bukti transaksi
- Tombol Simpan dan Batal

<img width="1080" height="1920" alt="image" src="https://github.com/user-attachments/assets/b81d838e-0523-4715-bd60-f552467f73f9" />

### 4. Pengeluaran
Halaman ini digunakan untuk mencatat pengeluaran kas organisasi.

Fitur UI:
- Input jenis pengeluaran
- Input nominal
- Input tanggal pengeluaran
- Input keterangan
- Bukti transaksi
- Tombol Simpan dan Batal

<img width="1080" height="1920" alt="image" src="https://github.com/user-attachments/assets/5364ab0e-3200-40a0-8b00-bf004c73a72c" />

### 5. Laporan Keuangan
Halaman Laporan Keuangan digunakan untuk melihat ringkasan keuangan organisasi berdasarkan periode tertentu.

Fitur UI:
- Total pemasukan
- Total pengeluaran
- Saldo akhir
- Periode laporan
- Grafik/ringkasan keuangan

<img width="2160" height="3840" alt="image" src="https://github.com/user-attachments/assets/6caf601c-d86c-4baf-a932-8488c5ff757c" />

### 6. Deteksi Anomali
Halaman Deteksi Anomali menampilkan transaksi yang terindikasi tidak wajar berdasarkan aturan yang telah ditentukan.

Fitur UI:
- Daftar transaksi terindikasi anomali
- Informasi nominal transaksi
- Alasan transaksi terdeteksi
- Status pemeriksaan transaksi

<img width="2160" height="3840" alt="image" src="https://github.com/user-attachments/assets/a5f3315d-ad56-4bd4-bb3c-bc760e829cb3" />

### 7. Profile
Halaman Profile menampilkan informasi akun pengguna serta menyediakan fitur untuk keluar dari aplikasi.

Fitur UI:
- Informasi akun
- Data pengguna
- Tombol Logout

<img width="2160" height="3840" alt="image" src="https://github.com/user-attachments/assets/31042e85-a199-4dda-988c-2ef855b1e252" />

## Cara Menjalankan Proyek

1. Clone repository:

    git clone https://github.com/adllzmly-sketch/Project_Lab_Kelompok1.git

2. Masuk ke folder aplikasi:

    cd Project_Lab_Kelompok1/Kelompok1

3. Install dependency:

    npm install

4. Jalankan aplikasi:

    npx expo start

5. Setelah Expo berjalan, aplikasi dapat dibuka melalui Expo Go, emulator, atau web sesuai environment yang digunakan.
