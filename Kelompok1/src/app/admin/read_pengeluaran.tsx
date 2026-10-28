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
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateFieldKey, setDateFieldKey] = useState(0);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState('');
  const [proofError, setProofError] = useState('');

  const numericValue = Number(amount.replace(/\D/g, ''));
  const isZeroNominal = amount.trim() !== '' && numericValue === 0;

  const nominalError = isZeroNominal ? 'jumllah nominal harus valid jangan korup min' : '';

  const resetForm = () => {
    setSource('');
    setCategory('');
    setAmount('');
    setDate(null);
    setDateFieldKey((key) => key + 1);
    setNote('');
    setProof('');
    setProofError('');
  };

  return (
    <FinancePage title="Catat Pengeluaran">
      <Field label="Jenis Pengeluaran" placeholder="Input Jenis Pengeluaran" value={source} onChangeText={setSource} />

      <Field label="Kategori Pengeluaran" placeholder="Input Kategori Pengeluaran" value={category} onChangeText={setCategory} />

      <Field label="Nominal" placeholder="Input Nominal Pengeluaran" keyboardType="numeric" value={amount} onChangeText={(value: string) => setAmount(formatNominalInput(value))} error={nominalError} />

      <DatePickerField key={dateFieldKey} label="Tanggal Pengeluaran Dana" value={date} onChange={setDate} />

      <Field label="Keterangan" placeholder="Masukan Keterangan .........." multiline value={note} onChangeText={setNote} />

      <EvidencePicker
        value={proof}
        onChange={(value) => {
          setProof(value);

          if (value) {
            setProofError('');
          }
        }}
        error={proofError}
      />

      <View style={featureStyles.formActions}>
        <Action label="Batal" outline onPress={resetForm} />

        <Action
          label="Simpan"
          onPress={() => {
            const value = Number(amount.replace(/\D/g, ''));

            if (!Number.isFinite(value) || value <= 0) {
              Alert.alert('Peringatan', 'jumllah nominal harus valid jangan korup min');
              return;
            }

            if (!source.trim() || !category.trim() || !date || !note.trim()) {
              Alert.alert('Data belum lengkap', 'Isi semua kolom terlebih dahulu.');
              return;
            }

            if (!proof.trim()) {
              setProofError('Bukti foto pengeluaran wajib dilampirkan.');
              return;
            }

            addTransaction({
              type: 'Pengeluaran',
              source: source.trim(),
              category: category.trim(),
              amount: value,
              date: formatDate(date),
              description: note.trim() || source.trim(),
              note: note.trim(),
              proof,
            });

            Alert.alert('Berhasil', 'Pengeluaran berhasil dicatat.');

            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/admin/dashboard' as never);
            }
          }}
        />
      </View>
    </FinancePage>
  );
}
