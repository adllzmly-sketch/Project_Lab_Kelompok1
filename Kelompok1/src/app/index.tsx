import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { navy, blue } from '../components/finance-ui';
import { useFinance } from '../context/finance-context';

export default function LoginScreen() {
  const { authenticate, themeMode } = useFinance();
  const dark = themeMode === 'dark';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = () => {
    const role = authenticate(username, password);
    if (role) router.replace(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    else {
      setError('Username atau password salah.');
    }
  };
  return <View style={[styles.screen, dark && { backgroundColor: '#111827' }]}><View style={[styles.card, dark && { backgroundColor: '#1d293b', borderColor: '#3b4960' }]}>
    <View style={styles.logo}><Text style={[styles.logoMark, dark && { color: '#f3f6fc' }]}>K</Text><Text style={[styles.brand, dark && { color: '#f3f6fc' }]}>KASINO</Text></View>
    <TextInput style={[styles.input, dark && { backgroundColor: '#35476b', color: '#fff' }]} placeholder="Username / Email" placeholderTextColor={dark ? '#d1d9e8' : blue} value={username} onChangeText={value => { setUsername(value); setError(''); }} autoCapitalize="none" autoCorrect={false} />
    <View style={[styles.passwordField, dark && { backgroundColor: '#35476b', borderColor: '#8799bd' }]}>
      <TextInput style={[styles.passwordInput, dark && { color: '#fff' }]} placeholder="Password" placeholderTextColor={dark ? '#d1d9e8' : blue} value={password} onChangeText={value => { setPassword(value); setError(''); }} secureTextEntry={!showPassword} onSubmitEditing={handleLogin} />
      <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onPress={() => setShowPassword(value => !value)} hitSlop={8}>
        <Text style={styles.passwordToggle}>{showPassword ? 'Sembunyikan' : 'Lihat'}</Text>
      </Pressable>
    </View>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <Pressable style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Login</Text></Pressable>

  </View></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f2f4', alignItems: 'center', justifyContent: 'center', padding: 18 },
  card: { width: 250, maxWidth: '100%', backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#e1e4eb', alignItems: 'stretch', boxShadow: '0px 3px 12px rgba(16, 30, 64, 0.08)', elevation: 2 },
  logo: { alignItems: 'center', marginBottom: 26 }, logoMark: { color: navy, fontSize: 26, fontWeight: '900', lineHeight: 29 }, brand: { color: navy, fontSize: 9, fontWeight: '900', letterSpacing: 0.5, marginTop: 2 },
  input: { height: 36, borderWidth: 1, borderColor: '#8799bd', borderRadius: 3, color: navy, fontSize: 11, paddingHorizontal: 9, marginBottom: 7 },
  passwordField: { height: 36, borderWidth: 1, borderColor: '#8799bd', borderRadius: 3, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, marginBottom: 7 },
  passwordInput: { flex: 1, height: '100%', color: navy, fontSize: 11, padding: 0 },
  passwordToggle: { color: blue, fontSize: 10, fontWeight: '600', paddingLeft: 8 },
  error: { color: '#a32632', fontSize: 10, marginBottom: 7 },
  button: { marginTop: 2, height: 36, backgroundColor: navy, alignItems: 'center', justifyContent: 'center', borderRadius: 2 }, buttonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
