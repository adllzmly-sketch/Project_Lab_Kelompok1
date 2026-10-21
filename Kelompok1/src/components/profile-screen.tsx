import { Alert, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Action, FinancePage, navy, SectionCard } from './finance-ui';
import { useFinance } from '../context/finance-context';

export function ProfileScreen({ role }: { role: 'admin' | 'user' }) {
  const { getAccount, updateProfilePhoto, themeMode } = useFinance();
  const account = getAccount(role);
  const dark = themeMode === 'dark';
  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin galeri diperlukan', 'Izinkan akses galeri untuk memilih foto profil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) updateProfilePhoto(role, result.assets[0].uri);
  };
  return <FinancePage title="Profil" role={role}>
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Pilih foto profil" onPress={choosePhoto} style={{ height: 72, width: 72, borderRadius: 36, backgroundColor: '#d8d8d8', marginBottom: 8, overflow: 'hidden' }}>
        {account.photo ? <Image source={{ uri: account.photo }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
      </Pressable>
      <Pressable onPress={choosePhoto}><Text style={{ color: dark ? '#bdc8da' : '#7586ad', fontSize: 9, marginBottom: 7 }}>Pilih foto profil</Text></Pressable>
      <Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 11, fontWeight: '700' }}>{account.name}</Text>
      <Text style={{ color: dark ? '#bdc8da' : '#7586ad', fontSize: 8, marginTop: 3 }}>{account.email}</Text>
    </View>
    <SectionCard title="Informasi Akun"><Info label="Nama" value={account.name} /><Info label="Username" value={account.username} /><Info label="Role" value={role === 'admin' ? 'Admin' : 'User'} /></SectionCard>
    <Pressable accessibilityRole="button" onPress={() => router.push(`/${role}/pengaturan_akun` as never)} style={{ borderColor: '#aeb9cf', borderWidth: 1, borderRadius: 3, padding: 10, marginBottom: 15 }}><Text style={{ color: dark ? '#f3f6fc' : navy, fontSize: 11, fontWeight: '600' }}>⚙   Pengaturan Akun</Text></Pressable>
    <Action label="Logout" onPress={() => router.replace('/')} />
  </FinancePage>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={{ marginBottom: 8 }}><Text style={{ color: '#e5eaf4', fontSize: 8, marginBottom: 3 }}>{label}</Text><Text style={{ color: '#fff', fontSize: 9 }}>{value}</Text></View>;
}
