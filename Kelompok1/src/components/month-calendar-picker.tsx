/**
 * MonthCalendarPicker
 *
 * Menampilkan header bulan yang bisa digeser kiri/kanan untuk pindah bulan.
 * Ketuk label bulan untuk membuka modal kalender grid 12 bulan + pilih tahun.
 */
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

const navy = '#173575';
const blue = '#5d719f';

type Props = {
  month: number; // 0-based
  year: number;
  onChange: (month: number, year: number) => void;
};

export function MonthCalendarPicker({ month, year, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(String(year));
  const [previewYear, setPreviewYear] = useState(year);
  const [previewMonth, setPreviewMonth] = useState(month);

  const prev = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    onChange(m, y);
  };

  const next = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    onChange(m, y);
  };

  const openModal = () => {
    setPreviewYear(year);
    setPreviewMonth(month);
    setDraftYear(String(year));
    setModalOpen(true);
  };

  const confirmModal = () => {
    onChange(previewMonth, previewYear);
    setModalOpen(false);
  };

  const handleYearInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setDraftYear(digits);
    const n = Number(digits);
    if (digits.length === 4 && n >= 1900 && n <= 2100) setPreviewYear(n);
  };

  const handleYearBlur = () => {
    const n = Number(draftYear);
    if (draftYear.length !== 4 || n < 1900 || n > 2100) {
      setDraftYear(String(previewYear));
    }
  };

  return (
    <>
      {/* Header strip */}
      <View style={styles.strip}>
        <Pressable
          onPress={prev}
          accessibilityRole="button"
          accessibilityLabel="Bulan sebelumnya"
          style={styles.arrow}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <Pressable onPress={openModal} style={styles.labelBtn} accessibilityRole="button" accessibilityLabel="Pilih bulan dan tahun">
          <Text style={styles.labelText}>{MONTH_NAMES[month]} {year}</Text>
          <Ionicons name="calendar-outline" size={16} color="#fff" style={{ marginLeft: 6 }} />
        </Pressable>

        <Pressable
          onPress={next}
          accessibilityRole="button"
          accessibilityLabel="Bulan berikutnya"
          style={styles.arrow}
          hitSlop={12}
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Modal kalender */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalOpen(false)} accessibilityRole="button" accessibilityLabel="Tutup" />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Pilih Bulan & Tahun</Text>

            {/* Input tahun */}
            <View style={styles.yearRow}>
              <Pressable
                onPress={() => { const y = previewYear - 1; if (y >= 1900) { setPreviewYear(y); setDraftYear(String(y)); } }}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Tahun sebelumnya"
              >
                <Ionicons name="chevron-back" size={20} color={navy} />
              </Pressable>
              <TextInput
                style={styles.yearInput}
                value={draftYear}
                onChangeText={handleYearInput}
                onBlur={handleYearBlur}
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel="Input tahun"
              />
              <Pressable
                onPress={() => { const y = previewYear + 1; if (y <= 2100) { setPreviewYear(y); setDraftYear(String(y)); } }}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Tahun berikutnya"
              >
                <Ionicons name="chevron-forward" size={20} color={navy} />
              </Pressable>
            </View>

            {/* Grid 12 bulan */}
            <View style={styles.grid}>
              {MONTH_NAMES.map((name, idx) => {
                const selected = idx === previewMonth;
                return (
                  <Pressable
                    key={name}
                    onPress={() => setPreviewMonth(idx)}
                    style={[styles.cell, selected && styles.cellSelected]}
                    accessibilityRole="button"
                    accessibilityLabel={name}
                  >
                    <Text style={[styles.cellText, selected && styles.cellTextSelected]}>
                      {name.slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Tombol aksi */}
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalOpen(false)} style={styles.cancelBtn} accessibilityRole="button">
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>
              <Pressable onPress={confirmModal} style={styles.confirmBtn} accessibilityRole="button">
                <Text style={styles.confirmText}>Pilih</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: navy,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  arrow: { padding: 4 },
  labelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: { color: navy, fontSize: 16, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  yearRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 },
  yearInput: {
    color: navy,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 60,
    borderBottomWidth: 1.5,
    borderBottomColor: blue,
    paddingVertical: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  cell: {
    width: '30%',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef1f7',
    borderRadius: 10,
  },
  cellSelected: { backgroundColor: navy },
  cellText: { color: navy, fontSize: 13 },
  cellTextSelected: { color: '#fff', fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#c0cad8' },
  cancelText: { color: navy, fontSize: 13 },
  confirmBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, backgroundColor: navy },
  confirmText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
