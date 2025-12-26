import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalCard } from '../components/BrutalCard';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export const LoginScreen = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('@');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !domain)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!isLogin && !domain.startsWith('@')) {
      Alert.alert('Erro', 'O domínio deve começar com @');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, domain);
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>PUSHUA</Text> 
          <Text style={styles.tagline}>Push Notifications, Simplified</Text>
        </View>

        <BrutalCard style={styles.card}>
          <Text style={styles.title}>{isLogin ? 'LOGIN' : 'CRIAR CONTA'}</Text>

          <BrutalInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <BrutalInput
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {!isLogin && (
            <BrutalInput
              label="Domínio"
              placeholder="@meuapp"
              value={domain}
              onChangeText={setDomain}
              autoCapitalize="none"
            />
          )}

          <BrutalButton
            title={isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
            onPress={handleSubmit}
            loading={loading}
            size="large"
            style={styles.submitButton}
          />

          <BrutalButton
            title={isLogin ? 'Criar uma conta' : 'Já tenho conta'}
            onPress={() => setIsLogin(!isLogin)}
            variant="outline"
            size="medium"
            style={styles.switchButton}
          />
        </BrutalCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: FontSizes.xxl * 1.5,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
  },
  card: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  switchButton: {
    marginTop: Spacing.md,
  },
});
