# Configuração de Notificações Push

## Firebase Cloud Messaging (Android)

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `pushua-app` (ou escolha outro)
4. Siga os passos de criação

### 2. Adicionar Android App

1. No console do Firebase, clique em "Adicionar app" > Android
2. Preencha:
   - **Package name**: `com.pushua.app` (mesmo do app.json)
   - **App nickname**: Pushua
   - **Debug signing certificate**: (opcional para desenvolvimento)
3. Baixe o arquivo `google-services.json`
4. Coloque na raiz do projeto: `pushua-app/google-services.json`

### 3. Obter Server Key

1. No Firebase Console, vá em Project Settings > Cloud Messaging
2. Copie o **Server Key**
3. Use esta chave na API Backend (pushua-api)

### 4. Configurar no Backend

No arquivo `.env` do pushua-api:
```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=sua-private-key
FIREBASE_CLIENT_EMAIL=seu-client-email
```

Ou use o arquivo `serviceAccountKey.json` do Firebase.

## Apple Push Notification Service (iOS)

### 1. Configurar no Apple Developer

1. Acesse [Apple Developer](https://developer.apple.com/)
2. Certificates, Identifiers & Profiles
3. Identifiers > + (criar novo)
4. App IDs > Digite: `com.pushua.app`
5. Enable Push Notifications

### 2. Gerar Certificate

1. Keys > + (criar nova)
2. Nome: Pushua Push Notification Key
3. Enable: Apple Push Notifications service (APNs)
4. Baixe o arquivo `.p8`
5. Anote o Key ID

### 3. Configurar no Expo

```bash
# Configure as credenciais
eas credentials

# Selecione iOS
# Upload o arquivo .p8
# Informe o Key ID e Team ID
```

## Expo Push Notifications (Desenvolvimento)

Para desenvolvimento rápido, use os servidores do Expo:

### Vantagens
- Funciona sem configuração adicional
- Suporta Android e iOS
- Perfeito para desenvolvimento

### Limitações
- Não é recomendado para produção
- Limite de mensagens por dia
- Requer Expo Go ou build standalone

### Como Usar

1. O app já está configurado para usar Expo Push Notifications
2. Ao rodar o app, você receberá um `ExpoPushToken`
3. Use este token para enviar notificações via Expo API

## Testando Notificações

### Método 1: Via App
1. Faça login no app
2. Vá para Subscrições e crie uma subscrição
3. Vá para Notificações
4. Clique em "🧪 TESTE"
5. Envie a notificação

### Método 2: Via Postman/cURL

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_API_KEY" \
  -d '{
    "domain": "@seuapp",
    "topicName": "test",
    "title": "Teste",
    "body": "Mensagem de teste",
    "imageUrl": ""
  }'
```

### Método 3: Expo Push Notification Tool

1. Acesse: https://expo.dev/notifications
2. Cole o Expo Push Token
3. Digite título e mensagem
4. Envie!

## Estrutura de Notificação

```typescript
{
  domain: string;        // @seuapp
  topicName: string;     // news, alerts, updates
  title: string;         // Título da notificação
  body: string;          // Corpo da notificação
  data?: {               // Dados adicionais (opcional)
    key: "value"
  };
  imageUrl?: string;     // URL da imagem (opcional)
}
```

## Troubleshooting

### Notificações não aparecem

1. **Verifique permissões**
   - Settings > Apps > Pushua > Notifications > Enabled

2. **Dispositivo físico**
   - Notificações push só funcionam em dispositivos físicos
   - Não funcionam no emulador/simulador

3. **Token válido**
   - Verifique se o token foi registrado corretamente
   - Veja os logs do app para confirmar

4. **Firebase configurado**
   - Confirme que o google-services.json está correto
   - Verifique as credenciais no Firebase Console

### App em foreground

Por padrão, notificações aparecem mesmo com o app aberto devido à configuração:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // Mostra mesmo em foreground
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

## Produção

Para produção, você precisará:

1. Build standalone do app (não Expo Go)
2. Configuração adequada do Firebase/APNs
3. Certificados válidos
4. Testar em diferentes dispositivos

### Build Standalone

```bash
# Configure o EAS
eas build:configure

# Build para Android
eas build --platform android --profile production

# Build para iOS
eas build --platform ios --profile production
```

## Recursos Úteis

- [Expo Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Console](https://console.firebase.google.com/)
- [Apple Developer](https://developer.apple.com/)
- [Expo Push Notification Tool](https://expo.dev/notifications)
