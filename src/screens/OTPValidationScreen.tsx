import React, { useState, useCallback } from 'react';
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
import { OTPInput } from '../components/OTPInput';
import { CountdownTimer } from '../components/CountdownTimer';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalCard } from '../components/BrutalCard';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { BrutalInput } from '@/components/BrutalInput';

const OTP_EXPIRY_SECONDS = 600; // 10 minutes

interface OTPValidationScreenProps {
    navigation: any;
    route: any;
}

export const OTPValidationScreen: React.FC<OTPValidationScreenProps> = ({
    navigation,
    route,
}) => {
    const { email } = route.params || {};
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const insets = useSafeAreaInsets();

    const handleExpire = useCallback(() => {
        setOtpExpired(true);
    }, []);

    const isFormValid = otp.length === 6 && password.length >= 6 && !otpExpired;

    const handleResetPassword = async () => {
        if (!isFormValid) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({
                otp,
                newPassword: password,
            });

            Alert.alert('Sucesso', 'Senha redefinida com sucesso', [
                {
                    text: 'Ok',
                    onPress: () => {
                        navigation.navigate('Login');
                    },
                },
            ]);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || 'Erro ao redefinir senha';

            Alert.alert('Erro', errorMessage);

        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0 || !email) {
            return;
        }

        try {
            await authService.forgotPassword({ email });
            Alert.alert('Sucesso', 'Novo código enviado para seu email');
            setResendCooldown(30);
            setOtp('');
            setPassword('');
            setOtpExpired(false);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível reenviar o código');
        }
    };

    // Resend cooldown timer
    React.useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setTimeout(() => {
            setResendCooldown(resendCooldown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendCooldown]);

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
                        <Text style={styles.title}>Validar Código</Text>
                        <Text style={styles.subtitle}>
                            Insira o código de 6 dígitos enviado para{'\n'}
                            <Text style={styles.email}>{email}</Text>
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <BrutalCard>
                            <View style={styles.form}>
                                {/* OTP Timer */}
                                <View style={styles.timerContainer}>
                                    <CountdownTimer
                                        initialSeconds={OTP_EXPIRY_SECONDS}
                                        onExpire={handleExpire}
                                    />
                                </View>

                                {/* OTP Input */}
                                <View>
                                    <Text style={styles.label}>Código OTP</Text>
                                    <OTPInput
                                        value={otp}
                                        onChangeValue={setOtp}
                                        length={6}
                                        disabled={otpExpired}
                                    />
                                </View>

                                {otpExpired && (
                                    <View style={styles.expiredWarning}>
                                        <Text style={styles.expiredText}>
                                            ⚠️ Código expirado. Reenvie o código para continuar.
                                        </Text>
                                    </View>
                                )}

                                {/* Password Input */}
                                <View>

                                    <BrutalInput
                                        label="Senha"
                                        placeholder="••••••••"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Submit Button */}
                                <BrutalButton
                                    title={loading ? 'Redefinindo...' : 'Redefinir Senha'}
                                    onPress={handleResetPassword}
                                    disabled={!isFormValid || loading}
                                    loading={loading}
                                />

                                <View style={styles.divider} />

                                {/* Resend Option */}
                                <View style={styles.resendContainer}>
                                    <Text style={styles.resendText}>Não recebeu o código?</Text>
                                    <Text
                                        style={[
                                            styles.resendLink,
                                            resendCooldown > 0 && styles.resendLinkDisabled,
                                        ]}
                                        onPress={handleResendOTP}
                                        disabled={resendCooldown > 0}
                                    >
                                        {resendCooldown > 0
                                            ? `Reenviar em ${resendCooldown}s`
                                            : 'Reenviar código'}
                                    </Text>
                                </View>
                            </View>
                        </BrutalCard>
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
    email: {
        fontWeight: '600',
        color: Colors.primaryDark,
    },
    content: {
        marginVertical: Spacing.lg,
    },
    form: {
        gap: Spacing.md,
    },
    timerContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: Spacing.sm,
    },
    expiredWarning: {
        backgroundColor: '#FFE5E5',
        borderLeftWidth: 4,
        borderLeftColor: Colors.error,
        padding: Spacing.md,
        borderRadius: 4,
    },
    expiredText: {
        fontSize: FontSizes.sm,
        color: Colors.error,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray,
        marginVertical: Spacing.sm,
    },
    resendContainer: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    resendText: {
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
    },
    resendLink: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: Colors.primaryDark,
    },
    resendLinkDisabled: {
        color: Colors.gray,
    },
    backContainer: {
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    backLink: {
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
        textDecorationLine: 'underline',
    },
});
