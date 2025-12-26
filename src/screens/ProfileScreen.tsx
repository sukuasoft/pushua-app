import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { BrutalCard, BrutalCardHeader } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleCopyApiKey = () => {
    Alert.alert('API Key', user?.apiKey || '', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👤</Text>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gerencie sua conta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrutalCard>
          <BrutalCardHeader title="Informações da Conta" />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Domínio:</Text>
            <BrutalBadge text={user?.domain || ''} variant="success" />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.valueSmall} numberOfLines={1}>
              {user?.id}
            </Text>
          </View>
        </BrutalCard>

        <BrutalCard style={styles.apiCard}>
          <BrutalCardHeader 
            title="API Key" 
            subtitle="Use esta chave para autenticar suas requisições"
          />

          <View style={styles.apiKeyBox}>
            <Text style={styles.apiKeyText} numberOfLines={1}>
              {user?.apiKey}
            </Text>
          </View>

          <BrutalButton
            title="COPIAR API KEY"
            onPress={handleCopyApiKey}
            variant="secondary"
            size="medium"
          />
        </BrutalCard>

        <BrutalCard style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>📬 Sobre o Pushua</Text>
          <Text style={styles.aboutText}>
            Pushua é uma plataforma simples e eficiente para envio de notificações push.
          </Text>
          <Text style={styles.aboutText}>
            Versão: 1.0.0
          </Text>
        </BrutalCard>

        <BrutalButton
          title="SAIR"
          onPress={handleLogout}
          variant="outline"
          size="large"
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderBottomWidth: 3,
    borderBottomColor: Colors.black,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.black,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.black,
  },
  value: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  valueSmall: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.darkGray,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.sm,
  },
  apiCard: {
    marginTop: Spacing.lg,
  },
  apiKeyBox: {
    backgroundColor: Colors.gray,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  apiKeyText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  aboutCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  aboutTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  aboutText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
