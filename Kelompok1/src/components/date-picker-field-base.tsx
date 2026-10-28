import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DatePickerFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(
    () => (value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date())
  );

  const firstWeekday = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const openCalendar = () => {
    setDisplayMonth(value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date());
    setCalendarOpen(true);
  };

  const chooseDay = (day: number) => {
    const selected = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day, 12);
    onChange(selected);
    setCalendarOpen(false);
  };

  const changeMonth = (offset: number) => {
    setDisplayMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const formattedDisplay = value ? formatDate(value) : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Field hanya bisa ditekan untuk membuka kalender */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${formattedDisplay || 'Pilih tanggal dari kalender'}`}
        onPress={openCalendar}
        style={({ pressed }) => [styles.datePickerButton, pressed && styles.datePickerButtonPressed]}
      >
        <Text style={[styles.dateText, !formattedDisplay && styles.placeholderText]}>
          {formattedDisplay || 'Pilih tanggal dari kalender...'}
        </Text>
        <View style={styles.calendarIconWrapper}>
          <Ionicons name="calendar-outline" size={18} color="#ffffff" />
        </View>
      </Pressable>

      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tutup kalender"
            style={StyleSheet.absoluteFill}
            onPress={() => setCalendarOpen(false)}
          />
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bulan sebelumnya"
                onPress={() => changeMonth(-1)}
                style={styles.monthNavigation}
              >
                <Text style={styles.navigationText}>‹</Text>
              </Pressable>
              <Text style={styles.monthTitle}>
                {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bulan berikutnya"
                onPress={() => changeMonth(1)}
                style={styles.monthNavigation}
              >
                <Text style={styles.navigationText}>›</Text>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {weekdays.map(day => (
                <Text key={day} style={styles.weekday}>{day}</Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {dayCells.map((day, index) => {
                if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
                const selected =
                  value?.getFullYear() === displayMonth.getFullYear() &&
                  value.getMonth() === displayMonth.getMonth() &&
                  value.getDate() === day;

                return (
                  <Pressable
                    key={day}
                    accessibilityRole="button"
                    accessibilityLabel={`${day} ${monthNames[displayMonth.getMonth()]} ${displayMonth.getFullYear()}`}
                    onPress={() => chooseDay(day)}
                    style={[styles.dayCell, selected && styles.selectedDay]}
                  >
                    <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => setCalendarOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  label: { color: '#173575', fontSize: 11, marginBottom: 4 },
  datePickerButton: {
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: '#5d719f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 6,
  },
  datePickerButtonPressed: {
    opacity: 0.85,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 12,
    flex: 1,
  },
  placeholderText: {
    color: '#e7ebf4',
    fontStyle: 'italic',
  },
  calendarIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#173575',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 360,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthNavigation: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef1f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationText: {
    color: '#173575',
    fontSize: 23,
    lineHeight: 25,
  },
  monthTitle: {
    color: '#173575',
    fontSize: 15,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    width: '14.2857%',
    textAlign: 'center',
    color: '#7586ad',
    fontSize: 10,
    fontWeight: '700',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#173575',
  },
  dayText: {
    color: '#24324b',
    fontSize: 12,
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  closeButton: {
    minHeight: 38,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#eef1f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#173575',
    fontSize: 12,
    fontWeight: '600',
  },
});
