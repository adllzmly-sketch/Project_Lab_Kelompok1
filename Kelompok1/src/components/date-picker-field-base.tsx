import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type DatePickerFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [text, setText] = useState(() => value ? formatInputDate(value) : '');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
  const firstWeekday = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayCells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  const handleChangeText = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 4
      ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
      : digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
    setText(formatted);
    onChange(parseInputDate(digits));
  };

  const chooseDay = (day: number) => {
    const selected = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day, 12);
    setText(formatInputDate(selected));
    onChange(selected);
    setCalendarOpen(false);
  };

  const changeMonth = (offset: number) => {
    setDisplayMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
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
      <Pressable accessibilityRole="button" accessibilityLabel="Buka kalender" onPress={() => {
        setDisplayMonth(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
        setCalendarOpen(true);
      }} style={styles.calendarButton}>
        <Text style={styles.calendarGlyph}>▦</Text>
      </Pressable>
    </View>
    <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
      <View style={styles.modalOverlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Tutup kalender" style={StyleSheet.absoluteFill} onPress={() => setCalendarOpen(false)} />
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable accessibilityRole="button" accessibilityLabel="Bulan sebelumnya" onPress={() => changeMonth(-1)} style={styles.monthNavigation}><Text style={styles.navigationText}>‹</Text></Pressable>
            <Text style={styles.monthTitle}>{monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Bulan berikutnya" onPress={() => changeMonth(1)} style={styles.monthNavigation}><Text style={styles.navigationText}>›</Text></Pressable>
          </View>
          <View style={styles.weekdayRow}>{weekdays.map(day => <Text key={day} style={styles.weekday}>{day}</Text>)}</View>
          <View style={styles.dayGrid}>{dayCells.map((day, index) => {
            if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
            const selected = value?.getFullYear() === displayMonth.getFullYear() && value.getMonth() === displayMonth.getMonth() && value.getDate() === day;
            return <Pressable key={day} accessibilityRole="button" accessibilityLabel={`${day} ${monthNames[displayMonth.getMonth()]} ${displayMonth.getFullYear()}`} onPress={() => chooseDay(day)} style={[styles.dayCell, selected && styles.selectedDay]}>
              <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
            </Pressable>;
          })}</View>
          <Pressable accessibilityRole="button" onPress={() => setCalendarOpen(false)} style={styles.closeButton}><Text style={styles.closeButtonText}>Tutup</Text></Pressable>
        </View>
      </View>
    </Modal>
  </View>;
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
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { color: '#173575', fontSize: 11, marginBottom: 4 },
  inputRow: { flexDirection: 'row', gap: 7 },
  input: { flex: 1, minHeight: 38, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#5d719f', color: '#fff', fontSize: 12 },
  calendarButton: { width: 42, minHeight: 38, borderRadius: 10, backgroundColor: '#173575', alignItems: 'center', justifyContent: 'center' },
  calendarGlyph: { color: '#fff', fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  calendarCard: { width: '100%', maxWidth: 360, padding: 16, backgroundColor: '#fff', borderRadius: 14, elevation: 8 },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  monthNavigation: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eef1f7', alignItems: 'center', justifyContent: 'center' },
  navigationText: { color: '#173575', fontSize: 23, lineHeight: 25 },
  monthTitle: { color: '#173575', fontSize: 15, fontWeight: '700' },
  weekdayRow: { flexDirection: 'row', marginBottom: 6 },
  weekday: { width: '14.2857%', textAlign: 'center', color: '#7586ad', fontSize: 10, fontWeight: '700' },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  selectedDay: { backgroundColor: '#173575' },
  dayText: { color: '#24324b', fontSize: 12 },
  selectedDayText: { color: '#fff', fontWeight: '700' },
  closeButton: { minHeight: 38, marginTop: 12, borderRadius: 10, backgroundColor: '#eef1f7', alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: '#173575', fontSize: 12, fontWeight: '600' },
});
