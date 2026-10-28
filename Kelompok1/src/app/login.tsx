
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

<<<<<<< HEAD
const NAVY = '#142F70';
const BLUE = 'rgba(20, 47, 112, 0.7)';
const GREEN = '#00FF40';
const RED = '#F70005';
=======
const NAVY = '#193779';
const RED = '#dc2626';
const accounts = {
  '24880100A': { password: 'admin', route: '/admin' },
  '24880100U': { password: 'user', route: '/user/dashboard' },
} as const;
>>>>>>> 934c258 (update)

export default function LoginScreen() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [nimError, setNimError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateNim = (value: string) => {
    if (!value.trim()) return 'NIM wajib diisi';
    if (!/^\d+$/.test(value.trim())) return 'NIM harus berupa angka';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Kata sandi wajib diisi';
    if (value.length < 8) {
      return 'Kata sandi minimal 8 karakter';
    }
    return '';
  };

  const handleLogin = () => {
<<<<<<< HEAD
    const nimValidation = validateNim(nim);
    const passwordValidation = validatePassword(password);

    setNimError(nimValidation);
    setPasswordError(passwordValidation);

    if (nimValidation || passwordValidation) return;

    // Belum terhubung ke autentikasi backend.
    router.replace('/');
=======
    const normalizedNim = nim.trim().toUpperCase();
    setNimError('');
    setPasswordError('');

    let isValid = true;
    if (!normalizedNim) {
      setNimError('NIM wajib diisi.');
      isValid = false;
    } else if (!/^\d{8}[AU]$/.test(normalizedNim)) {
      setNimError('Format NIM tidak valid.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi.');
      isValid = false;
    }

    if (!isValid) return;

    const account = accounts[normalizedNim as keyof typeof accounts];
    if (!account) {
      setNimError('NIM atau kata sandi tidak sesuai.');
      return;
    }

    if (password !== account.password) {
      setPasswordError('NIM atau kata sandi tidak sesuai.');
      return;
    }

    router.replace(account.route);
>>>>>>> 934c258 (update)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Ionicons name="wallet" size={92} color={NAVY} />
            <Text style={styles.logoText}>KASINO</Text>
          </View>

          <View style={styles.form}>
            {/* Input NIM */}
            <View style={styles.field}>
              <Text style={styles.label}>NIM</Text>

              <TextInput
                style={[
                  styles.input,
                  focused === 'nim' && styles.focused,
<<<<<<< HEAD
                  nimError !== '' && styles.errorBorder,
                ]}
                placeholder="Masukkan NIM"
                placeholderTextColor="#D6DFF5"
                value={nim}
                onChangeText={(value) => {
                  setNim(value);
                  setNimError(validateNim(value));
                }}
                onFocus={() => setFocused('nim')}
                onBlur={() => setFocused('')}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {!!nimError && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle" size={14} color={RED} />{' '}
                  {nimError}
                </Text>
              )}
=======
                  !!nimError && styles.errorBorder,
                ]}
                placeholder="Masukkan NIM"
                placeholderTextColor="#8B9ABE"
                value={nim}
                onChangeText={(value) => { setNim(value.toUpperCase()); setNimError(''); }}
                onFocus={() => setFocused('nim')}
                onBlur={() => setFocused('')}
                keyboardType="default"
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
              />
              {!!nimError && <Text style={styles.errorText}>{nimError}</Text>}
>>>>>>> 934c258 (update)
            </View>

            {/* Input Kata Sandi */}
            <View style={styles.field}>
              <Text style={styles.label}>Kata Sandi</Text>

              <View
                style={[
                  styles.passwordBox,
                  focused === 'password' && styles.focused,
                  !!passwordError && styles.errorBorder,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Masukkan Kata Sandi"
                  placeholderTextColor="#D6DFF5"
                  value={password}
<<<<<<< HEAD
                  onChangeText={(value) => {
                    setPassword(value);
                    setPasswordError(validatePassword(value));
                  }}
=======
                  onChangeText={(value) => { setPassword(value); setPasswordError(''); }}
>>>>>>> 934c258 (update)
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                >
                  <Ionicons
                    name={
                      showPassword ? 'eye-outline' : 'eye-off-outline'
                    }
                    size={23}
                    color={NAVY}
                  />
                </Pressable>
              </View>
<<<<<<< HEAD

              {!!passwordError && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle" size={14} color={RED} />{' '}
                  {passwordError}
                </Text>
              )}
=======
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
>>>>>>> 934c258 (update)
            </View>

            {/* Tombol Masuk */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Masuk</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '8.3%',
    paddingVertical: 35,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 90,
  },
  logoText: {
    color: NAVY,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 24,
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 26,
  },
  label: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 9,
  },
  input: {
    height: 62,
    borderWidth: 2,
    borderColor: NAVY,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 17,
    color: '#FFFFFF',
    backgroundColor: BLUE,
  },
  passwordBox: {
    minHeight: 62,
    borderWidth: 2,
    borderColor: NAVY,
    borderRadius: 12,
    paddingLeft: 18,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
    height: 58,
    paddingRight: 12,
    fontSize: 17,
    color: '#FFFFFF',
  },
  focused: {
    borderColor: NAVY,
    borderWidth: 2.5,
  },
  errorBorder: { borderColor: RED },
  errorText: { color: RED, fontSize: 12, marginTop: 7 },
  button: {
    minHeight: 68,
    backgroundColor: NAVY,
    borderWidth: 1,
    borderColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
});
