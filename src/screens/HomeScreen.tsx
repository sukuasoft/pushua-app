import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext'; import { MaterialIcons } from '@expo/vector-icons'; import { useNotifications } from '../hooks/useNotifications';
import { subscriptionService, Subscription } from '../services/subscription.service';
import { BrutalCard, BrutalCardHeader } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import AppWrapper from '@/components/AppWrapper';
import BannerAdComponent from '../components/BannerAd';

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
    <AppWrapper>
             <GestureHandlerRootView style={styles.container}>
     
        <View style={styles.header}>
          <View>
            <ImageBackground style={styles.icon} source={require('../../assets/pushua-green.png')} />
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadSubscriptions} />
          }
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >

          <BrutalCard style={styles.infoCard}>
            <BrutalCardHeader title="Informações" />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Domínio:</Text>
              <BrutalBadge text={user?.domain || ''} variant="success" />
            </View>

          </BrutalCard>

          <View style={styles.subscriptionsHeader}>
            <Text style={styles.sectionTitle}>Minhas Subscrições</Text>
            <Text style={styles.count}>{subscriptions.length}</Text>
          </View>

          <FlatList
            scrollEnabled={false}
            data={subscriptions}
            renderItem={renderSubscriptionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}

            ListEmptyComponent={
              <BrutalCard>
                <Text style={styles.emptyText}>
                  Você ainda não tem subscrições ativas
                </Text>
              </BrutalCard>
            }
          />
          <BannerAdComponent />
        </ScrollView>
      </GestureHandlerRootView>

    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 120,
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.black,
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
  deleteButton: {
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.darkGray,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  }
});
