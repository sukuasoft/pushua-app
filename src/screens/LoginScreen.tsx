import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalCard } from '../components/BrutalCard';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

export const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('@');
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

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

  useEffect(() => {
    setEmail('');
    setPassword('');
    setDomain('@');
  }, [isLogin]);


  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.white,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ImageBackground style={{
              width: 50,
              height: 50,
            }
            } source={require('../../assets/icon.png')} />

            <ImageBackground style={styles.icon} source={require('../../assets/pushua-white.png')} />
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
              size="medium"
              style={styles.submitButton}
            />

            {isLogin && (
              <Text
                style={styles.forgotPasswordLink}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Esqueci minha senha
              </Text>
            )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 160,
    height: 30,
  },
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.white,

    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.black,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 30,
    padding: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  tagline: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
  },
  card: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  forgotPasswordLink: {
    textAlign: 'center',
    marginTop: Spacing.md,
    color: Colors.primaryDark,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  switchButton: {
    marginTop: Spacing.md,
  },
});
