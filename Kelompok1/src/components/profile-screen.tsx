import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Action, FinancePage, navy, SectionCard } from './finance-ui';

export function ProfileScreen({ role }: { role: 'admin' | 'user' }) {
  const admin = role === 'admin';
  return <FinancePage title="Profil" role={role}>
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      <View style={{ height: 54, width: 54, borderRadius: 27, backgroundColor: '#d8d8d8', marginBottom: 8 }} />
      <Text style={{ color: navy, fontSize: 11, fontWeight: '700' }}>{admin ? 'Administrator' : 'Pengguna'}</Text>
      <Text style={{ color: '#7586ad', fontSize: 8, marginTop: 3 }}>{admin ? 'admin@kasino.id' : 'user@kasino.id'}</Text>
    </View>
    <SectionCard title="Informasi Akun"><Info label="Nama" value={admin ? 'Administrator Kasino' : 'Pengguna Kasino'} /><Info label="Username" value={admin ? 'admin' : 'user'} /><Info label="Role" value={admin ? 'Admin' : 'User'} /></SectionCard>
    <Pressable style={{ borderColor: '#aeb9cf', borderWidth: 1, borderRadius: 3, padding: 8, marginBottom: 6 }}><Text style={{ color: navy, fontSize: 9 }}>▣   Ubah Profil</Text></Pressable>
    <Pressable style={{ borderColor: '#aeb9cf', borderWidth: 1, borderRadius: 3, padding: 8, marginBottom: 15 }}><Text style={{ color: navy, fontSize: 9 }}>⚙   Pengaturan Akun</Text></Pressable>
    <Action label="Logout" onPress={() => router.replace('/')} />
  </FinancePage>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={{ marginBottom: 8 }}><Text style={{ color: '#e5eaf4', fontSize: 8, marginBottom: 3 }}>{label}</Text><Text style={{ color: '#fff', fontSize: 9 }}>{value}</Text></View>;
}
