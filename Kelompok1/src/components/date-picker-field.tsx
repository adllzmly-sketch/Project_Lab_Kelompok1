import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type DatePickerFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [text, setText] = useState(() => value ? formatInputDate(value) : '');

  const handleChangeText = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 4
      ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
      : digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;

    setText(formatted);
    const parsedDate = parseInputDate(digits);
    onChange(parsedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="numeric"
        value={text}
        onChangeText={handleChangeText}
        placeholder="DD/MM/YYYY"
        placeholderTextColor="#e7ebf4"
        maxLength={10}
        style={styles.input}
      />
    </View>
  );
}

function formatInputDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(4, '0');
  return `${day}/${month}/${year}`;
}

function parseInputDate(digits: string): Date | null {
  if (digits.length !== 8) return null;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (year < 1 || month < 1 || month > 12 || day < 1) return null;

  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { color: '#173575', fontSize: 11, marginBottom: 4 },
  input: { minHeight: 38, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#5d719f', color: '#fff', fontSize: 12 },
});
