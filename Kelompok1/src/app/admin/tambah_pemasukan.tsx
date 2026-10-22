import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { Action, Field, FinancePage } from '../../components/finance-ui';
import { EvidencePicker } from '../../components/evidence-picker';
import { useFinance } from '../../context/finance-context';

export default function TambahPemasukan() {
  const { addTransaction } = useFinance();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');

  const resetForm = () => { setSource(''); setAmount(''); setDate(''); setNote(''); setProof(''); };

  return <FinancePage title="Catat Pemasukan">
    <Field label="Sumber Pemasukan" placeholder="Input Sumber Dana" value={source} onChangeText={setSource} />
    <Field label="Nominal" placeholder="Input Nominal Pemasukan" keyboardType="numeric" value={amount} onChangeText={setAmount} />
    <Field label="Tanggal Pemasukan Dana" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
    <Field label="Keterangan" placeholder="Masukan Keterangan .........." multiline value={note} onChangeText={setNote} />
    <EvidencePicker value={proof} onChange={setProof} />
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 24 }}>
      <Action label="Batal" outline onPress={resetForm} />
      <Action label="Simpan" onPress={() => {
        const value = Number(amount.replace(/\D/g, ''));
        if (!source.trim() || !value || !date.trim()) {
          Alert.alert('Data belum lengkap', 'Isi sumber, nominal, dan tanggal pemasukan.');
          return;
        }
        addTransaction({ type: 'Pemasukan', source: source.trim(), amount: value, date: date.trim(), description: note.trim() || source.trim(), note: note.trim(), proof: proof.trim() });
        Alert.alert('Berhasil', 'Pemasukan berhasil dicatat.');
        if (router.canGoBack()) router.back(); else router.replace('/admin/dashboard' as never);
      }} />
    </View>
  </FinancePage>;
}
