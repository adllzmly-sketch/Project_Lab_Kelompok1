import { useState } from 'react';
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Action, Field, FinancePage, formatNominalInput, navy, blue } from '../../components/finance-ui';
import { useFinance } from '../../context/finance-context';

export default function CatatPengeluaran() {
  const { addTransaction } = useFinance();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');

  const takeProofPhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Kamera tidak tersedia', 'Fitur foto bukti tersedia melalui aplikasi Android.');
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin kamera diperlukan', 'Izinkan aplikasi mengakses kamera untuk mengambil foto bukti.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]) setProof(result.assets[0].uri);
  };

  const resetForm = () => {
    setSource(''); setAmount(''); setDate(null); setNote(''); setProof('');
  };

  return <FinancePage title="Catat Pengeluaran">
    <Field label="Jenis Pengeluaran" placeholder="Input Jenis Pengeluaran" value={source} onChangeText={setSource} />
    <Field label="Nominal" placeholder="Input Nominal Pengeluaran" keyboardType="numeric" value={amount} onChangeText={value => setAmount(formatNominalInput(value))} />
    <Text style={{ color: navy, fontSize: 11, marginBottom: 4 }}>Tanggal Pengeluaran Dana</Text>
    <Pressable accessibilityRole="button" onPress={() => setDatePickerOpen(true)} style={{ minHeight: 34, justifyContent: 'center', backgroundColor: blue, borderRadius: 2, paddingHorizontal: 8, marginBottom: 10 }}>
      <Text style={{ color: date ? '#fff' : '#e7ebf4', fontSize: 12 }}>{date ? formatDate(date) : 'Pilih tanggal'}</Text>
    </Pressable>
    {datePickerOpen && <DateTimePicker value={date ?? new Date()} mode="date" display={Platform.OS === 'android' ? 'calendar' : 'default'} onChange={(_, selectedDate) => {
      if (Platform.OS === 'android') setDatePickerOpen(false);
      if (selectedDate) setDate(selectedDate);
    }} />}
    <Field label="Keterangan" placeholder="Masukan Keterangan .........." multiline value={note} onChangeText={setNote} />
    <Text style={{ color: navy, fontSize: 11, marginBottom: 4 }}>Bukti</Text>
    <Pressable accessibilityRole="button" onPress={takeProofPhoto} style={{ minHeight: 34, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: navy, borderRadius: 3, paddingHorizontal: 8, marginBottom: 8 }}>
      <Text style={{ color: navy, fontSize: 11, fontWeight: '600' }}>{proof ? 'Ambil ulang foto bukti' : 'Ambil foto dengan kamera'}</Text>
    </Pressable>
    {proof ? <View style={{ marginBottom: 8 }}><Image source={{ uri: proof }} resizeMode="cover" style={{ width: 120, height: 90, borderRadius: 3 }} /><Text style={{ color: blue, fontSize: 9, marginTop: 3 }}>Foto bukti siap disimpan</Text></View> : null}
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 }}>
      <Action label="Batal" outline onPress={resetForm} />
      <Action label="Simpan" onPress={() => {
        const value = Number(amount.replace(/\D/g, ''));
        if (!source.trim() || !value || !date) {
          Alert.alert('Data belum lengkap', 'Isi jenis, nominal, dan tanggal pengeluaran.');
          return;
        }
        addTransaction({ type: 'Pengeluaran', source: source.trim(), amount: value, date: formatDate(date), description: note.trim() || source.trim(), note: note.trim(), proof });
        Alert.alert('Berhasil', 'Pengeluaran berhasil dicatat.');
        router.canGoBack() ? router.back() : router.replace('/admin/dashboard');
      }} />
    </View>
  </FinancePage>;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
