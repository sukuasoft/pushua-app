import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNotifications } from '../hooks/useNotifications';
import { subscriptionService, Subscription } from '../services/subscription.service';
import { BrutalCard } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SubscriptionsScreen = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [creating, setCreating] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%', '50%'];

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

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCreateSubscription = async () => {
    if (!topicName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do tópico');
      return;
    }

    setCreating(true);
    try {
      await subscriptionService.create({
        topicName: topicName.trim()
      });
      Alert.alert('Sucesso', 'Subscrição criada com sucesso!');
      setTopicName('');
      handleCloseSheet();
      loadSubscriptions();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível criar a subscrição'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir esta subscrição?', [
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
    ]);
  };

  const renderSubscriptionItem = ({ item }: { item: Subscription }) => (
    <BrutalCard style={styles.subscriptionCard}>
      <View style={styles.cardHeader}>
        <BrutalBadge text={item.topicName} variant="primary" />
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <BrutalButton
        title="REMOVER"
        onPress={() => handleDeleteSubscription(item.id)}
        variant="outline"
        size="small"
        style={styles.deleteButton}
      />
    </BrutalCard>
  );

  return (
    <SafeAreaView  style={styles.container}>
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Subscrições</Text>
            <Text style={styles.subtitle}>{subscriptions.length} ativas</Text>
          </View>
          <BrutalButton
            title="+ NOVA"
            onPress={handleOpenSheet}
            size="medium"
          />
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
                Nenhuma subscrição encontrada{'\n'}
                Toque em + NOVA para criar
              </Text>
            </BrutalCard>
          }
        />

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.sheetTitle}>Nova Subscrição</Text>

            <BrutalInput
              label="Nome do Tópico"
              placeholder="ex: news, updates, alerts"
              value={topicName}
              onChangeText={setTopicName}
              autoCapitalize="none"
            />

            <BrutalButton
              title="CRIAR SUBSCRIÇÃO"
              onPress={handleCreateSubscription}
              loading={creating}
              size="large"
              style={styles.createButton}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
    </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  listContent: {
    padding: Spacing.lg,
  },
  subscriptionCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  token: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
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
  bottomSheetBackground: {
    backgroundColor: Colors.white,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.black,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: Colors.black,
    width: 60,
    height: 6,
  },
  bottomSheetContent: {
    padding: Spacing.lg,
  },
  sheetTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  tokenInfo: {
    marginBottom: Spacing.md,
  },
  tokenLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  tokenValue: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  createButton: {
    marginTop: Spacing.md,
  },
});
