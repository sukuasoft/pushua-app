import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

interface OTPInputProps {
    value: string;
    onChangeValue: (value: string) => void;
    length?: number;
    disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    value,
    onChangeValue,
    length = 6,
    disabled = false,
}) => {
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const handleChange = (text: string, index: number) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');

        // Create new value array
        const newValue = value.split('');
        newValue[index] = numericText.slice(-1); // Only take last character
        const newFullValue = newValue.join('');

        onChangeValue(newFullValue.slice(0, length));

        // Auto-focus next field if digit was entered
        if (numericText && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: any,
        index: number
    ) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // If current field is empty, focus previous
                inputRefs.current[index - 1]?.focus();
            } else if (value[index]) {
                // If current field has value, clear it
                const newValue = value.split('');
                newValue[index] = '';
                onChangeValue(newValue.join(''));
            }
        }
    };

    const renderInputs = () => {
        return Array.from({ length }).map((_, index) => (
            <TextInput
                key={`otp-${index}`}
                ref={(ref) => {
                    inputRefs.current[index] = ref;
                }}
                style={[
                    styles.input,
                    focusedIndex === index && styles.inputFocused,
                    disabled && styles.inputDisabled,
                ]}
                value={value[index] || ''}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                editable={!disabled}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputsWrapper}>{renderInputs()}</View>
            {value.length > 0 && value.length < length && (
                <Text style={styles.helperText}>
                    Digite os {length} dígitos
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: Spacing.md,
    },
    inputsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    input: {
        width: 40,
        height: 50,
        borderWidth: 2,
        borderColor: Colors.black,
        borderRadius: BorderRadius.sm,
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.white,
    },
    inputFocused: {
        borderColor: Colors.primary,
        backgroundColor: '#F0FFFC',
    },
    inputDisabled: {
        backgroundColor: Colors.gray,
        opacity: 0.6,
    },
    helperText: {
        marginTop: Spacing.sm,
        fontSize: FontSizes.sm,
        color: Colors.darkGray,
    },
});
