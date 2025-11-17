import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

interface BrutalBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'primary';
  onPress?: () => void;
}

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({
  text,
  variant = 'primary',
  onPress,
}) => {
  const variantColors = {
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    primary: Colors.primary,
  };

  const badgeStyle = {
    backgroundColor: variantColors[variant],
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const content = (
    <View style={badgeStyle}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.xs,
    fontWeight: '900',
    color: Colors.black,
  },
});
