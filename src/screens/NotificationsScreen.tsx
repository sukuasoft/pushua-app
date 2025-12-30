import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notification.service';
import { BrutalCard, BrutalCardHeader } from '../components/BrutalCard';
import { BrutalButton } from '../components/BrutalButton';
import { BrutalInput } from '../components/BrutalInput';
import { BrutalBadge } from '../components/BrutalBadge';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import AppWrapper from '@/components/AppWrapper';

export const NotificationsScreen = () => {
  const { user } = useAuth();
  const [topicName, setTopicName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sending, setSending] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['60%', '90%'];

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
    backgroundColor: Colors.black,
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
  scrollContent: {
    padding: Spacing.lg,
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
