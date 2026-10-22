import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

type EvidencePickerProps = {
  value: string;
  onChange: (uri: string) => void;
};

export function EvidencePicker({ value, onChange }: EvidencePickerProps) {
  const [fileName, setFileName] = useState('');

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin kamera diperlukan', 'Izinkan akses kamera untuk mengambil foto bukti.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      const photo = result.assets?.[0];
      if (!result.canceled && photo) {
        onChange(photo.uri);
        setFileName(photo.fileName || 'Foto kamera');
      }
    } catch {
      Alert.alert('Kamera tidak dapat dibuka', 'Coba lagi atau pilih foto dari galeri.');
    }
  };

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      const photo = result.assets?.[0];
      if (!result.canceled && photo) {
        onChange(photo.uri);
        setFileName(photo.fileName || 'Foto dari galeri');
      }
    } catch {
      Alert.alert('Galeri tidak dapat dibuka', 'Coba pilih bukti melalui menu file.');
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      const file = result.assets?.[0];
      if (!result.canceled && file) {
        onChange(file.uri);
        setFileName(file.name);
      }
    } catch {
      Alert.alert('File tidak dapat dibuka', 'Coba pilih file bukti sekali lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bukti</Text>
      <View style={styles.actions}>
        <EvidenceAction icon="camera-outline" label="Kamera" onPress={takePhoto} />
        <EvidenceAction icon="images-outline" label="Foto" onPress={pickPhoto} />
        <EvidenceAction icon="document-attach-outline" label="File" onPress={pickFile} />
      </View>
      {!!value && (
        <View style={styles.selected}>
          <Ionicons name="checkmark-circle" size={16} color="#193779" />
          <Text style={styles.fileName} numberOfLines={1}>{fileName || value.split('/').pop() || 'Bukti terpilih'}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Hapus bukti" onPress={() => { onChange(''); setFileName(''); }}>
            <Ionicons name="close-circle-outline" size={18} color="#7586ad" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function EvidenceAction({ icon, label, onPress }: { icon: 'camera-outline' | 'images-outline' | 'document-attach-outline'; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <Ionicons name={icon} size={19} color="#193779" />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { color: '#173575', fontSize: 11, marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, backgroundColor: '#eef1f7', borderWidth: 1, borderColor: '#cbd4e5', borderRadius: 5 },
  pressed: { opacity: 0.7 },
  actionText: { color: '#193779', fontSize: 12, fontWeight: '600' },
  selected: { marginTop: 8, minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 7 },
  fileName: { flex: 1, color: '#526487', fontSize: 11 },
});
