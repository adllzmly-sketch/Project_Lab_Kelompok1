import { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { Action, Field, FinancePage, navy } from './finance-ui';
import { useFinance } from '../context/finance-context';

export function AccountSettingsScreen({ role }: { role: 'admin' | 'user' }) {
  const { getAccount, updateProfile, updateUsername, updatePassword, themeMode, setThemeMode } = useFinance();
  const account = getAccount(role);
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [username, setUsername] = useState(account.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dark = themeMode === 'dark';
  const textColor = dark ? '#f3f6fc' : navy;

  return <FinancePage title="Pengaturan Akun" role={role}>
    <Text style={{ color: textColor, fontWeight: '700', fontSize: 12, marginBottom: 8 }}>Ubah Profil</Text>
    <Field label="Nama" placeholder="Nama lengkap" value={name} onChangeText={setName} />
    <Field label="Email" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
    <Action label="Simpan Profil" onPress={() => {
      if (!name.trim() || !email.trim()) return Alert.alert('Data belum lengkap', 'Isi nama dan email.');
      updateProfile(role, name.trim(), email.trim());
      Alert.alert('Berhasil', 'Profil berhasil diperbarui.');
    }} />

    <View style={{ height: 1, backgroundColor: dark ? '#3a465a' : '#dfe5ef', marginVertical: 16 }} />
    <Text style={{ color: textColor, fontWeight: '700', fontSize: 12, marginBottom: 8 }}>Ubah Username</Text>
    <Field label="Username baru" placeholder="Username baru" value={username} onChangeText={setUsername} />
    <Action label="Simpan Username" outline onPress={() => {
      if (updateUsername(role, username)) Alert.alert('Berhasil', 'Username berhasil diperbarui.');
      else Alert.alert('Username tidak tersedia', 'Masukkan username yang belum digunakan.');
    }} />

    <View style={{ height: 1, backgroundColor: dark ? '#3a465a' : '#dfe5ef', marginVertical: 16 }} />
    <Text style={{ color: textColor, fontWeight: '700', fontSize: 12, marginBottom: 8 }}>Ubah Password</Text>
    <Field label="Password saat ini" placeholder="Password saat ini" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
    <Field label="Password baru" placeholder="Password baru" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
    <Field label="Ulangi password baru" placeholder="Ulangi password baru" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
    <Action label="Simpan Password" outline onPress={() => {
      if (!newPassword || newPassword !== confirmPassword) return Alert.alert('Password tidak cocok', 'Pastikan password baru dan konfirmasi sama.');
      if (!updatePassword(role, currentPassword, newPassword)) return Alert.alert('Password saat ini salah', 'Periksa kembali password saat ini.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      Alert.alert('Berhasil', 'Password berhasil diperbarui.');
    }} />

    <View style={{ height: 1, backgroundColor: dark ? '#3a465a' : '#dfe5ef', marginVertical: 16 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View><Text style={{ color: textColor, fontWeight: '700', fontSize: 12 }}>Tema Aplikasi</Text><Text style={{ color: dark ? '#bdc8da' : '#7586ad', fontSize: 10, marginTop: 3 }}>{dark ? 'Mode gelap' : 'Mode terang'}</Text></View>
      <Switch accessibilityLabel="Aktifkan mode gelap" value={dark} onValueChange={enabled => setThemeMode(enabled ? 'dark' : 'light')} trackColor={{ false: '#aeb9cf', true: '#5d719f' }} thumbColor={dark ? '#fff' : '#f4f4f4'} />
    </View>
  </FinancePage>;
}
