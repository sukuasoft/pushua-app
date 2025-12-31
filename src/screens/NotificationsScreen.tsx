import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/AuthContext';
import { notificationService, NotificationItem } from '../services/notification.service';
import { BrutalCard, BrutalCardHeader } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import AppWrapper from '@/components/AppWrapper';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationsScreen = () => {
  const { user } = useAuth();
  const { fetchNotifications, notificationHistory, notificationLoading, notificationError, notificationPage, notificationTotal } = useNotifications();
  const [topicName, setTopicName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['60%', '90%'];

  useEffect(() => {
    if (activeTab === 'history') {
      fetchNotifications(1);
    }
  }, [activeTab]);

  const handleOpenPreview = useCallback(() => {
    if (!topicName.trim() || !title.trim() || !body.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o tópico, título e corpo da notificação');
      return;
    }
    bottomSheetRef.current?.expand();
  }, [topicName, title, body]);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSendNotification = async () => {
    if (!user?.domain) {
      Alert.alert('Erro', 'Domínio do usuário não encontrado');
      return;
    }

    setSending(true);
    try {
      await notificationService.send({
        domain: user.domain,
        topicName: topicName.trim(),
        title: title.trim(),
        body: body.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });

      Alert.alert('Sucesso! 🎉', 'Notificação enviada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setTopicName('');
            setTitle('');
            setBody('');
            setImageUrl('');
            handleCloseSheet();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível enviar a notificação'
      );
    } finally {
      setSending(false);
    }
  };

  const handleTestNotification = () => {
    setTopicName('test');
    setTitle('Notificação de Teste');
    setBody('Esta é uma notificação de teste do Pushua! Se você está recebendo isso, tudo está funcionando perfeitamente!');
  };

  const handleRefreshHistory = async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications(1);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <View style={styles.notificationTitleRow}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
        </View>
        <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text>
      
      <View style={styles.notificationFooter}>
        <BrutalBadge text={`${item.topicName}`} variant="primary" />
        <BrutalBadge text={`✓ ${item.successCount}`} variant="success" />
        {item.failureCount > 0 && (
          <BrutalBadge text={`✗ ${item.failureCount}`} variant="error" />
        )}
      </View>
    </View>
  );

  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="mail-outline" size={48} color={Colors.darkGray} />
      <Text style={styles.emptyText}>Nenhuma notificação enviada</Text>
      <Text style={styles.emptySubtext}>As notificações que você enviar aparecerão aqui</Text>
    </View>
  );

  return (
    <AppWrapper>
      <View style={styles.container}>
        <GestureHandlerRootView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.container}>
              <View style={styles.header}>
                <View>
                  <ImageBackground style={styles.icon} source={require('../../assets/pushua-green.png')} />
                </View>
              </View>

              {/* Tab Selector */}
              <View style={styles.tabContainer}>
                <Pressable
                  style={[
                    styles.tab,
                    activeTab === 'send' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('send')}
                >
                  <Text style={[styles.tabText, activeTab === 'send' && styles.tabTextActive]}>
                    ENVIAR
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.tab,
                    activeTab === 'history' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('history')}
                >
                  <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                    HISTÓRICO ({notificationTotal})
                  </Text>
                </Pressable>
              </View>

              {/* Send Tab */}
              {activeTab === 'send' && (
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <BrutalCard>
                    <BrutalCardHeader title="Enviar Notificação" />

                    <BrutalInput
                      label="Tópico"
                      placeholder="ex: news, updates, alerts"
                      value={topicName}
                      onChangeText={setTopicName}
                      autoCapitalize="none"
                    />

                    <BrutalInput
                      label="Título"
                      placeholder="Título da notificação"
                      value={title}
                      onChangeText={setTitle}
                    />

                    <BrutalInput
                      label="Mensagem"
                      placeholder="Corpo da notificação"
                      value={body}
                      onChangeText={setBody}
                      multiline
                      numberOfLines={4}
                      style={{ minHeight: 100 }}
                    />

                    <BrutalInput
                      label="URL da Imagem (opcional)"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={imageUrl}
                      onChangeText={setImageUrl}
                      autoCapitalize="none"
                      keyboardType="url"
                    />

                    <View style={styles.buttonRow}>
                      <BrutalButton
                        title="TESTE"
                        onPress={handleTestNotification}
                        variant="outline"
                        size="medium"
                        style={styles.testButton}
                      />
                      <BrutalButton
                        title="PREVIEW"
                        onPress={handleOpenPreview}
                        size="medium"
                        style={styles.previewButton}
                      />
                    </View>
                  </BrutalCard>

                  <BrutalCard style={styles.tipsCard}>
                    <View style={styles.tipsTitleRow}>
                      <MaterialIcons name="lightbulb" size={24} color="black" />
                      <Text style={styles.tipsTitle}>Dicas</Text>
                    </View>
                    <Text style={styles.tipText}>
                      • Use tópicos significativos para organizar suas notificações
                    </Text>
                    <Text style={styles.tipText}>
                      • Mantenha o título curto e chamativo
                    </Text>
                    <Text style={styles.tipText}>
                      • A mensagem pode ter até 1000 caracteres
                    </Text>
                    <Text style={styles.tipText}>
                      • Adicione uma imagem para tornar a notificação mais atraente
                    </Text>
                  </BrutalCard>
                </ScrollView>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <View style={styles.historyContainer}>
                  {notificationLoading && notificationHistory.length === 0 ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                  ) : (
                    <FlatList
                      data={notificationHistory}
                      renderItem={renderNotificationItem}
                      keyExtractor={(item) => item.id}
                      ListEmptyComponent={renderEmptyHistory}
                      contentContainerStyle={styles.listContent}
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={handleRefreshHistory}
                          tintColor={Colors.primary}
                        />
                      }
                    />
                  )}
                </View>
              )}

              <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.handleIndicator}
              >
                <BottomSheetScrollView style={styles.bottomSheetContent}>
                  <Text style={styles.sheetTitle}>Preview da Notificação</Text>

                  <View style={styles.previewCard}>
                    <View style={styles.previewHeader}>
                      <View style={styles.previewAppNameRow}>
                        <MaterialIcons name="mail" size={20} color="black" />
                        <Text style={styles.previewAppName}>Pushua</Text>
                      </View>
                      <Text style={styles.previewTime}>agora</Text>
                    </View>

                    <Text style={styles.previewTitle}>{title}</Text>
                    <Text style={styles.previewBody}>{body}</Text>

                    {imageUrl && (
                      <View style={styles.previewImagePlaceholder}>
                        <View style={styles.imageRow}>
                          <MaterialIcons name="image" size={20} color="black" />
                          <Text style={styles.previewImageText}>Imagem será exibida aqui</Text>
                        </View>
                        <Text style={styles.previewImageUrl} numberOfLines={1}>
                          {imageUrl}
                        </Text>
                      </View>
                    )}

                    <View style={styles.previewFooter}>
                      <BrutalBadge text={`Tópico: ${topicName}`} variant="primary" />
                      <BrutalBadge text={user?.domain || ''} variant="success" />
                    </View>
                  </View>

                  <BrutalButton
                    title="ENVIAR NOTIFICAÇÃO"
                    onPress={handleSendNotification}
                    loading={sending}
                    size="large"
                    style={styles.sendButton}
                  />

                  <BrutalButton
                    title="CANCELAR"
                    onPress={handleCloseSheet}
                    variant="outline"
                    size="medium"
                    style={styles.cancelButton}
                  />
                </BottomSheetScrollView>
              </BottomSheet>
            </View>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </View>
    </AppWrapper>
  );
};const styles = StyleSheet.create({
  icon: {
    width: 120,
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,     
  },
  header: {
    backgroundColor: Colors.black,
    padding: Spacing.lg,
    borderBottomWidth: 3,
    borderBottomColor: Colors.black,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 3,
    borderBottomColor: Colors.black,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRightWidth: 3,
    borderRightColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  tab_last: {
    borderRightWidth: 0,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: '900',
    color: Colors.darkGray,
  },
  tabTextActive: {
    color: Colors.black,
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
    paddingBottom: Spacing.xl,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  notificationItem: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  notificationTitleRow: {
    flex: 1,
    marginRight: Spacing.md,
  },
  notificationTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.black,
  },
  notificationTime: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  notificationBody: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  notificationFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.black,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.darkGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  apiKeyContainer: {
    backgroundColor: Colors.gray,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  apiKeyText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.black,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  testButton: {
    flex: 1,
  },
  previewButton: {
    flex: 1,
  },
  tipsCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.black,
    marginLeft: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.xs,
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
  previewCard: {
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.black,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  previewAppNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAppName: {
    fontSize: FontSizes.sm,
    fontWeight: '900',
    color: Colors.black,
    marginLeft: Spacing.xs,
  },
  previewTime: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  previewTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '900',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  previewBody: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.md,
  },
  previewImagePlaceholder: {
    backgroundColor: Colors.gray,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  previewImageText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
    marginLeft: Spacing.xs,
  },
  previewImageUrl: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  previewFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  sendButton: {
    marginBottom: Spacing.md,
  },
  cancelButton: {
    marginBottom: Spacing.xl,
  },
});
