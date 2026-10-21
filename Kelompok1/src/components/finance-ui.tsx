import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Transaction } from '../context/finance-context';

export const navy = '#173575';
export const blue = '#5d719f';
export const muted = '#7586ad';
export const money = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function FinancePage({ title, children }: { title: string; children: ReactNode }) {
  return <View style={s.screen}>
    <View style={s.brand}><Text style={s.brandMark}>Ⅱ·</Text><Text style={s.brandName}>▣  KASINO</Text></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Pressable onPress={() => router.back()} style={s.heading}><Text style={s.back}>‹</Text><Text style={s.title}>{title}</Text></Pressable>
      {children}
    </ScrollView>
  </View>;
}

export function Field({ label, placeholder, multiline, value, onChangeText, keyboardType }: any) {
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput
    style={[s.input, multiline && s.multiline]} placeholder={placeholder} placeholderTextColor="#fff"
    value={value} onChangeText={onChangeText} multiline={multiline} keyboardType={keyboardType}
  /></View>;
}

export function Action({ label, onPress, outline = false }: { label: string; onPress: () => void; outline?: boolean }) {
  return <Pressable onPress={onPress} style={[s.action, outline ? s.outline : s.filled]}><Text style={[s.actionText, outline && { color: navy }]}>{label}</Text></Pressable>;
}

export function TransactionRow({ item, onPress }: { item: Transaction; onPress: () => void }) {
  return <Pressable style={s.row} onPress={onPress}>
    <Text style={s.rowDate}>{item.date}</Text>
    <View style={s.rowMain}><View><Text style={s.rowType}>{item.type}</Text><Text style={s.rowDesc}>{item.description}</Text></View>
      <Text style={s.rowAmount}>{money(item.amount)}  ›</Text></View>
  </Pressable>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' }, brand: { height: 58, backgroundColor: navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 },
  brandMark: { color: '#fff', fontSize: 23, fontWeight: '700' }, brandName: { color: '#fff', fontWeight: '700', fontSize: 15 },
  content: { padding: 22, paddingBottom: 38 }, heading: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 22 }, back: { color: navy, fontSize: 30, lineHeight: 32 }, title: { color: navy, fontSize: 17, fontWeight: '700' },
  field: { marginBottom: 14 }, label: { color: muted, fontSize: 14, marginBottom: 6 }, input: { backgroundColor: blue, color: '#fff', minHeight: 42, paddingHorizontal: 14, fontSize: 15 }, multiline: { minHeight: 84, textAlignVertical: 'top', paddingTop: 10 },
  action: { minWidth: 106, height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, filled: { backgroundColor: navy }, outline: { borderWidth: 1.5, borderColor: navy, backgroundColor: '#fff' }, actionText: { color: '#fff', fontSize: 15 },
  row: { marginTop: 10, borderRadius: 12, overflow: 'hidden' }, rowDate: { color: '#fff', backgroundColor: navy, paddingHorizontal: 13, paddingVertical: 7, fontSize: 12 }, rowMain: { backgroundColor: blue, padding: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, rowType: { color: '#fff', fontWeight: '700', fontSize: 13 }, rowDesc: { color: '#dce3f2', fontSize: 12, marginTop: 3 }, rowAmount: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
