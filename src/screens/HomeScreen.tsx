import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { subscriptionService, Subscription } from '../services/subscription.service';
import { BrutalCard, BrutalCardHeader } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export const HomeScreen = () => {
  const { user } = useAuth();
  const { expoPushToken } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as subscrições');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir esta subscrição?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionService.delete(id);
              Alert.alert('Sucesso', 'Subscrição excluída com sucesso');
              loadSubscriptions();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a subscrição');
            }
          },
        },
      ]
    );
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => (
    <BrutalCard style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <BrutalBadge text={item.topicName} variant="primary" />
        <Text style={styles.subscriptionDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.deviceToken} numberOfLines={1}>
        Token: {item.deviceToken}
      </Text>
      <BrutalButton
        title="EXCLUIR"
        onPress={() => handleDeleteSubscription(item.id)}
        variant="outline"
        size="small"
        style={styles.deleteButton}
      />
    </BrutalCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📬 PUSHUA</Text>
        <Text style={styles.subtitle}>Bem-vindo, {user?.email}</Text>
      </View>

      <BrutalCard style={styles.infoCard}>
        <BrutalCardHeader title="Informações" />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Domínio:</Text>
          <BrutalBadge text={user?.domain || ''} variant="success" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>API Key:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {user?.apiKey}
          </Text>
        </View>
        {expoPushToken && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Push Token:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {expoPushToken}
            </Text>
          </View>
        )}
      </BrutalCard>

      <View style={styles.subscriptionsHeader}>
        <Text style={styles.sectionTitle}>Minhas Subscrições</Text>
        <Text style={styles.count}>{subscriptions.length}</Text>
      </View>

      <FlatList
        data={subscriptions}
        renderItem={renderSubscriptionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadSubscriptions} />
        }
        ListEmptyComponent={
          <BrutalCard>
            <Text style={styles.emptyText}>
              Você ainda não tem subscrições ativas
            </Text>
          </BrutalCard>
        }
      />
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
  infoCard: {
    margin: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.black,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.darkGray,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.sm,
  },
  subscriptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.black,
  },
  count: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  subscriptionCard: {
    marginBottom: Spacing.md,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  subscriptionDate: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  deviceToken: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  deleteButton: {
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.darkGray,
    textAlign: 'center',
  },
});
