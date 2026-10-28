import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { featureStyles as s } from '../../assets/styles/finance-features';

type StoredDocument = { kind: 'document'; uri: string; name: string; mimeType?: string };
export type Evidence = { uri: string; name?: string; mimeType?: string; isDocument: boolean };

export function readEvidence(value: string): Evidence | null {
  if (!value) return null;
  try {
    const stored = JSON.parse(value) as StoredDocument;
    if (stored.kind === 'document' && stored.uri) return { uri: stored.uri, name: stored.name, mimeType: stored.mimeType, isDocument: true };
  } catch { /* Existing camera/gallery records store a plain URI. */ }
  return { uri: value, isDocument: false };
}

export function EvidencePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin foto diperlukan', 'Izinkan akses foto untuk memilih bukti dari galeri.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };
  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Kamera tidak tersedia', 'Gunakan aplikasi Android untuk mengambil foto bukti.');
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin kamera diperlukan', 'Izinkan akses kamera untuk mengambil foto bukti.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };
  const evidence = readEvidence(value);

  return <View style={s.evidenceContainer}>
    <Text style={s.evidenceLabel}>Bukti Foto (wajib)</Text>
    <View style={s.evidenceButtons}>
      <EvidenceButton label="Ambil Foto" onPress={takePhoto} />
      <EvidenceButton label="Pilih Foto" onPress={pickImage} />
    </View>
    {evidence ? <View style={s.evidencePreviewRow}>
      <Image source={{ uri: evidence.uri }} resizeMode="cover" style={s.evidencePreviewImage} />
      <View style={s.evidenceInfo}><Text numberOfLines={2} style={s.evidenceName}>Foto bukti siap disimpan</Text><Pressable onPress={() => onChange('')}><Text style={s.evidenceRemove}>Hapus bukti</Text></Pressable></View>
    </View> : null}
  </View>;
}

function EvidenceButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.evidenceButton}><Text style={s.evidenceButtonText}>{label}</Text></Pressable>;
}
