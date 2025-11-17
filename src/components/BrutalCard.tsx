import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

interface BrutalCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadowSize?: 'small' | 'medium' | 'large';
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
  children,
  style,
  shadowSize = 'medium',
}) => {
  const shadowSizes = {
    small: { width: 3, height: 3 },
    medium: { width: 4, height: 4 },
    large: { width: 6, height: 6 },
  };

  const cardStyle: ViewStyle = {
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.black,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: shadowSizes[shadowSize],
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};

interface BrutalCardHeaderProps {
  title: string;
  subtitle?: string;
}

export const BrutalCardHeader: React.FC<BrutalCardHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.darkGray,
  },
});
