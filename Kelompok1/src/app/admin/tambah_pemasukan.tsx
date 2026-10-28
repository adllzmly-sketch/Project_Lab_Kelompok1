import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { Action, Field, FinancePage, formatNominalInput } from '../../components/finance-ui';
import { EvidencePicker } from '../../components/evidence-picker';
import { DatePickerField, formatDate } from '../../components/date-picker-field';
import { useFinance } from '../../context/finance-context';
import { featureStyles } from '../../../assets/styles/finance-features';

const MAX_INCOME_LIMIT = 1_000_000_000;

export default function TambahPemasukan() {
  const { addTransaction } = useFinance();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateFieldKey, setDateFieldKey] = useState(0);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');

  const numericValue = Number(amount.replace(/\D/g, ''));
  const isZeroNominal = amount.trim() !== '' && numericValue === 0;
  const isOverLimit = numericValue > MAX_INCOME_LIMIT;

  const nominalError = isZeroNominal
    ? 'jumllah nominal harus valid jangan korup min'
    : isOverLimit
    ? 'darimana duitnya? siapakah icik bos kita itu'
    : '';

  const canSave = Boolean(source.trim() && amount.trim() && !isZeroNominal && !isOverLimit && date && proof);

  const resetForm = () => {
    setSource(''); setAmount(''); setDate(null); setDateFieldKey(key => key + 1); setNote(''); setProof('');
  };

  return <FinancePage title="Catat Pemasukan">
    <Field label="Sumber Pemasukan" placeholder="Input Sumber Dana" value={source} onChangeText={setSource} />
    <Field
      label="Nominal"
      placeholder="Input Nominal Pemasukan"
      keyboardType="numeric"
      value={amount}
      onChangeText={(value: string) => setAmount(formatNominalInput(value))}
      error={nominalError}
    />
    <DatePickerField key={dateFieldKey} label="Tanggal Pemasukan Dana" value={date} onChange={setDate} />
    <Field label="Keterangan" placeholder="Masukan Keterangan .........." multiline value={note} onChangeText={setNote} />
    <EvidencePicker value={proof} onChange={setProof} />
    <View style={featureStyles.formActions}>
      <Action label="Batal" outline onPress={resetForm} />
      <Action label="Simpan" disabled={!canSave} onPress={() => {
        const value = Number(amount.replace(/\D/g, ''));
        if (value <= 0) {
          Alert.alert('Peringatan', 'jumllah nominal harus valid jangan korup min');
          return;
        }
        if (value > MAX_INCOME_LIMIT) {
          Alert.alert('Peringatan', 'darimana duitnya? siapakah icik bos kita itu');
          return;
        }
        if (!source.trim() || !value || !date || !proof) {
          Alert.alert('Data belum lengkap', 'Isi sumber, nominal, tanggal, dan lampirkan bukti foto pemasukan.');
          return;
        }
        addTransaction({ type: 'Pemasukan', source: source.trim(), amount: value, date: formatDate(date), description: note.trim() || source.trim(), note: note.trim(), proof });
        Alert.alert('Berhasil', 'Pemasukan berhasil dicatat.');
        if (router.canGoBack()) router.back();
        else router.replace('/admin/dashboard' as never);
      }} />
    </View>
  </FinancePage>;
}
