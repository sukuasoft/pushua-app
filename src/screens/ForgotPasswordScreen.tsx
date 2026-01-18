import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../services/auth.service';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalCard } from '../components/BrutalCard';
import { Colors, Spacing, FontSizes } from '../constants/theme';

interface ForgotPasswordScreenProps {
    navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
    navigation,
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const validateEmail = (emailToValidate: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailToValidate);
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Erro', 'Por favor, insira seu email');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Erro', 'Email inválido');
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword({ email });

            navigation.navigate('OTPValidation', { email });
        } catch (error: any) {
            // Same message for both cases (security)
            Alert.alert(
                'Erro',
                error.response?.data?.message || 'Ocorreu um erro. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };




    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.white,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            <StatusBar style="dark" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Recuperar Senha</Text>
                        <Text style={styles.subtitle}>
                            Digite seu email para receber um código de recuperação
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <BrutalCard>
                            <View style={styles.form}>
                                <BrutalInput
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />

                                <BrutalButton
                                    title={loading ? 'Enviando...' : 'Enviar Código'}
                                    onPress={handleForgotPassword}
                                    disabled={
                                        loading || !validateEmail(email)
                                    }
                                    loading={loading}
                                />

                                <View style={styles.divider} />

                                <Text style={styles.helperText}>
                                    Você receberá um email com um código
                                </Text>

                            </View>
                        </BrutalCard>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Lembrou sua senha?{' '}
                        </Text>
                        <Text
                            style={[styles.footerLink, { color: Colors.primaryDark }]}
                            onPress={() => navigation.goBack()}
                        >
                            Voltar
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.lg,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.md,
        color: Colors.darkGray,
        lineHeight: 24,
    },
    content: {
        marginVertical: Spacing.lg,
    },
    form: {
        gap: Spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray,
        marginVertical: Spacing.sm,
    },
    helperText: {
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
        textAlign: 'center',
    },
    cooldownText: {
        fontSize: FontSizes.sm,
        color: Colors.warning,
        textAlign: 'center',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    footerText: {
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
    },
    footerLink: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
    },
});
