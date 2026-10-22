import React, { ComponentProps, ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Image, TextInput, Alert, useWindowDimensions, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { blue, FinancePage, navy } from './finance-ui';

type IconName = ComponentProps<typeof Ionicons>['name'];
type Section = 'akun' | 'tentang';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export function ProfileScreen({ role = 'admin' }: { role?: 'admin' | 'user' }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const admin = role === 'admin';

 
  const defaultNama = admin ? 'Rifa' : 'Pengguna Kasino';
  const defaultUsername = admin ? 'rifa_admin' : 'user';
  const email = admin ? 'rifa@kasino.id' : 'user@kasino.id';
  const roleName = admin ? 'Administrator' : 'User / Anggota';

  const [open, setOpen] = useState<Section | null>(null);
  const toggle = (section: Section) => setOpen((current) => (current === section ? null : section));

  const [nama, setNama] = useState(defaultNama);
  const [username, setUsername] = useState(defaultUsername);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempNama, setTempNama] = useState(defaultNama);
  const [tempUsername, setTempUsername] = useState(defaultUsername);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Izin Ditolak', 'Izin akses galeri dibutuhkan untuk mengubah foto profil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan saat memilih gambar.');
    }
  };

  const handleOpenEdit = () => {
    setTempNama(nama);
    setTempUsername(username);
    setIsEditing(true);
  };

  const handleSaveInfo = () => {
    if (!tempNama.trim() || !tempUsername.trim()) {
      Alert.alert('Peringatan', 'Nama dan Username tidak boleh kosong!');
      return;
    }
    setNama(tempNama);
    setUsername(tempUsername);
    setIsEditing(false);
    Alert.alert('Berhasil', 'Informasi profil berhasil disimpan!');
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.replace('/login');
  };

  return (
    <FinancePage title="Profile" role={role} hideLogout>
      <ScrollView 
        contentContainerStyle={[s.container, isLargeScreen && s.containerLarge]} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
       
        <View style={s.header}>
          <Pressable 
            onPress={handlePickImage} 
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, s.avatarWrap]}
          >
            <View style={s.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Ionicons name="person" size={48} color="#94a3b8" />
              )}
            </View>
            <View style={s.badgeOverlay}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </Pressable>

          <Text style={s.name}>{nama}</Text>
        </View>

       
        <View style={[s.contentWrapper, isLargeScreen && s.contentWrapperLarge]}>
          <MenuCard 
            icon="person-outline" 
            label="Informasi Akun" 
            expanded={open === 'akun'} 
            onPress={() => toggle('akun')}
          >
            {isEditing ? (
              <View style={{ gap: 10, paddingVertical: 4 }}>
                <Text style={s.inputLabel}>Nama Lengkap</Text>
                <TextInput 
                  style={s.input} 
                  value={tempNama} 
                  onChangeText={setTempNama} 
                  placeholder="Masukkan nama" 
                  placeholderTextColor="#94a3b8"
                />

                <Text style={s.inputLabel}>Username</Text>
                <TextInput 
                  style={s.input} 
                  value={tempUsername} 
                  onChangeText={setTempUsername} 
                  placeholder="Masukkan username" 
                  placeholderTextColor="#94a3b8"
                />

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <Pressable onPress={handleSaveInfo} style={s.btnSave}>
                    <Text style={s.btnSaveText}>Simpan</Text>
                  </Pressable>
                  <Pressable onPress={() => setIsEditing(false)} style={s.btnCancel}>
                    <Text style={s.btnCancelText}>Batal</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View>
                <InfoRow label="Nama" value={nama} />
                <InfoRow label="Username" value={username} />
                <InfoRow label="Email" value={email} />
                <InfoRow label="Role" value={roleName} />
                <InfoRow label="Status" value="Aktif" last />
                
                <Pressable onPress={handleOpenEdit} style={s.btnEdit}>
                  <Ionicons name="create-outline" size={14} color={blue} />
                  <Text style={s.btnEditText}>Edit Nama & Username</Text>
                </Pressable>
              </View>
            )}
          </MenuCard>

          <MenuCard 
            icon="information-circle-outline" 
            label="Tentang Aplikasi" 
            expanded={open === 'tentang'} 
            onPress={() => toggle('tentang')}
          >
            <InfoRow label="Nama Aplikasi" value="KASINO" />
            <InfoRow label="Kepanjangan" value="Kas Informasi Organisasi" />
            <InfoRow label="Versi" value={appVersion} />
            <Text style={s.aboutText}>
              Aplikasi pencatatan dan pemantauan kas organisasi. Kamu dapat melihat ringkasan, riwayat transaksi, dan laporan keuangan organisasi dengan mudah dan transparan.
            </Text>
          </MenuCard>

         
          <Pressable 
            accessibilityRole="button" 
            accessibilityLabel="Logout" 
            onPress={() => setShowLogoutModal(true)} 
            style={({ pressed }) => [s.logout, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.logoutText}>Logout</Text>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>

     
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={s.modalIconWrap}>
              <Ionicons name="log-out-outline" size={32} color="#ef4444" />
            </View>
            <Text style={s.modalTitle}>Konfirmasi Keluar</Text>
            <Text style={s.modalSub}>Apakah Anda yakin ingin keluar dari aplikasi?</Text>

            <View style={s.modalActions}>
              <Pressable onPress={() => setShowLogoutModal(false)} style={s.modalBtnCancel}>
                <Text style={s.modalBtnCancelText}>Batal</Text>
              </Pressable>
              <Pressable onPress={confirmLogout} style={s.modalBtnConfirm}>
                <Text style={s.modalBtnConfirmText}>Keluar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </FinancePage>
  );
}

function MenuCard({ icon, label, expanded, onPress, children }: { icon: IconName; label: string; expanded: boolean; onPress: () => void; children: ReactNode }) {
  return (
    <View style={s.menuWrap}>
      <Pressable 
        accessibilityRole="button" 
        accessibilityState={{ expanded }} 
        accessibilityLabel={label} 
        onPress={onPress} 
        style={({ pressed }) => [s.menu, pressed && { opacity: 0.85 }]}
      >
        <View style={s.menuIcon}>
          <Ionicons name={icon} size={20} color={navy} />
        </View>
        <Text style={s.menuLabel}>{label}</Text>
        <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={18} color="#fff" />
      </Pressable>
      {expanded && <View style={s.panel}>{children}</View>}
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[s.infoRow, !last && s.infoDivider]}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingBottom: 30, paddingHorizontal: 16, backgroundColor: '#ffffff', flexGrow: 1 },
  containerLarge: { alignItems: 'center' },
  contentWrapper: { width: '100%' },
  contentWrapperLarge: { width: 650, maxWidth: '100%' },

  header: { alignItems: 'center', paddingTop: 16, paddingBottom: 20, minHeight: 140 },
  avatarWrap: { position: 'relative', width: 88, height: 88 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  badgeOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: blue, padding: 6, borderRadius: 12, borderWidth: 2, borderColor: '#fff' },
  name: { color: navy, fontSize: 16, fontWeight: '700', marginTop: 10, lineHeight: 22 },

  menuWrap: { marginBottom: 12 },
  menu: { height: 52, borderRadius: 12, backgroundColor: '#5c7299', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  menuIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '600' },

  panel: { marginTop: 6, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, paddingVertical: 12 },
  infoRow: { paddingVertical: 6 },
  infoDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  infoLabel: { color: '#64748b', fontSize: 10, marginBottom: 2 },
  infoValue: { color: navy, fontSize: 13, fontWeight: '600' },
  aboutText: { color: '#334155', fontSize: 11, lineHeight: 18, paddingVertical: 6 },

  inputLabel: { color: '#64748b', fontSize: 10, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12, color: navy },
  btnSave: { flex: 1, backgroundColor: navy, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnSaveText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  btnCancel: { flex: 1, backgroundColor: '#94a3b8', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnCancelText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  btnEdit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 8, borderWidth: 1, borderColor: blue, borderRadius: 8, backgroundColor: '#fff' },
  btnEditText: { color: blue, fontSize: 11, fontWeight: '600' },

  logout: { marginTop: 24, height: 48, borderRadius: 12, backgroundColor: navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 360, backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 10 },
  modalIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: navy, marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtnCancel: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f5f9', alignItems: 'center' },
  modalBtnCancelText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  modalBtnConfirm: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center' },
  modalBtnConfirmText: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
});
