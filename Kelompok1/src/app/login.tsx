
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

const NAVY = '#193779';
const RED = '#FF3030';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setEmailError('Format email tidak valid');
      valid = false;
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi');
      valid = false;
    }

    if (!valid) return;

    // Kembali ke beranda asli tanpa mengganti isinya.
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

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
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                style={[
                  styles.input,
                  focused === 'email' && styles.focused,
                  emailError !== '' && styles.errorBorder,
                ]}
                placeholder="Masukkan Email"
                placeholderTextColor="#8B9ABE"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setEmailError('');
                }}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />

              {!!emailError && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle" size={14} />{' '}
                  {emailError}
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Kata Sandi</Text>

              <View
                style={[
                  styles.passwordBox,
                  focused === 'password' && styles.focused,
                  passwordError !== '' && styles.errorBorder,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Masukkan Kata Sandi"
                  placeholderTextColor="#8B9ABE"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setPasswordError('');
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="current-password"
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

              {!!passwordError && (
                <Text style={styles.errorText}>
                  <Ionicons name="alert-circle" size={14} />{' '}
                  {passwordError}
                </Text>
              )}
            </View>

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
    color: NAVY,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
    height: 58,
    paddingRight: 12,
    fontSize: 17,
    color: NAVY,
  },
  focused: {
    borderColor: '#315ED1',
    borderWidth: 2.5,
  },
  errorBorder: {
    borderColor: RED,
  },
  errorText: {
    color: RED,
    fontSize: 12,
    marginTop: 7,
  },
  button: {
    minHeight: 68,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
