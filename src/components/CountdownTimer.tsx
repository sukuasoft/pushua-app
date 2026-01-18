import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../constants/theme';

interface CountdownTimerProps {
    initialSeconds: number;
    onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    initialSeconds,
    onExpire,
}) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onExpire?.();
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    onExpire?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft, onExpire]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const isExpired = secondsLeft === 0;

    return (
        <Text
            style={[
                styles.text,
                isExpired && styles.textExpired,
            ]}
        >
            {isExpired
                ? 'Código expirado'
                : `Expira em: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
        fontWeight: '600',
    },
    textExpired: {
        color: Colors.error,
    },
});
