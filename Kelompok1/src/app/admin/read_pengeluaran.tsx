import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { Action, Field, FinancePage, formatNominalInput } from '../../components/finance-ui';
import { EvidencePicker } from '../../components/evidence-picker';
import { DatePickerField, formatDate } from '../../components/date-picker-field';
import { useFinance } from '../../context/finance-context';
import { featureStyles } from '../../../assets/styles/finance-features';

export default function CatatPengeluaran() {
  const { addTransaction } = useFinance();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateFieldKey, setDateFieldKey] = useState(0);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');
  const canSave = Boolean(source.trim() && amount.trim() && date && note.trim() && proof);

  const resetForm = () => {
    setSource(''); setAmount(''); setDate(null); setDateFieldKey(key => key + 1); setNote(''); setProof('');
  };

  return <FinancePage title="Catat Pengeluaran">
    <Field label="Jenis Pengeluaran" placeholder="Input Jenis Pengeluaran" value={source} onChangeText={setSource} />
    <Field label="Nominal" placeholder="Input Nominal Pengeluaran" keyboardType="numeric" value={amount} onChangeText={(value: string) => setAmount(formatNominalInput(value))} />
    <DatePickerField key={dateFieldKey} label="Tanggal Pengeluaran Dana" value={date} onChange={setDate} />
    <Field label="Keterangan" placeholder="Masukan Keterangan .........." multiline value={note} onChangeText={setNote} />
    <EvidencePicker value={proof} onChange={setProof} />
    <View style={featureStyles.formActions}>
      <Action label="Batal" outline onPress={resetForm} />
      <Action label="Simpan" disabled={!canSave} onPress={() => {
        const value = Number(amount.replace(/\D/g, ''));
        if (!Number.isFinite(value) || value <= 0) {
          Alert.alert('Peringatan', 'Jumlah pengeluaran harus valid.');
          return;
        }
        if (!source.trim() || !date || !note.trim() || !proof) {
          Alert.alert('Data belum lengkap', 'Isi semua kolom dan lampirkan bukti foto pengeluaran.');
          return;
        }
        addTransaction({ type: 'Pengeluaran', source: source.trim(), amount: value, date: formatDate(date), description: note.trim() || source.trim(), note: note.trim(), proof });
        Alert.alert('Berhasil', 'Pengeluaran berhasil dicatat.');
        if (router.canGoBack()) router.back();
        else router.replace('/admin/dashboard' as never);
      }} />
    </View>
  </FinancePage>;
}
