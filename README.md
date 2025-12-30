# Pushua App

Aplicação mobile React Native Expo para o sistema Pushua de notificações push.

## 🎨 Identidade Visual

### Cores
- **Primary**: `#24FE9C`
- **Primary Dark**: `#1AC17D`
- **Black**: `#000000`
- **White**: `#FFFFFF`

### Design
- **Estilo**: Neo-Brutalism
- **Características**: Bordas grossas, sombras duras, cores vibrantes, tipografia bold

## ✨ Funcionalidades

- 🔐 **Autenticação**: Login e registro de usuários
- 📝 **Subscrições**: Gerenciar subscrições de tópicos
- 📬 **Notificações**: Enviar notificações push com preview
- 🧪 **Teste de Notificações**: Funcionalidade para testar notificações
- 👤 **Perfil**: Gerenciar conta e visualizar API key
- 🎨 **UI Neo-Brutalism**: Interface moderna e impactante

## 🛠️ Tecnologias

- React Native
- Expo SDK 54
- React Navigation
- @gorhom/bottom-sheet
- Expo Notifications
- Axios
- TypeScript

## 📦 Instalação

1. **Clone o repositório**
```bash
cd pushua-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Edite o arquivo .env e configure a URL da API
EXPO_PUBLIC_API_URL=http://seu-servidor:3000
```

4. **Inicie o projeto**
```bash
npm start
```

5. **Execute em um dispositivo**
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🎯 Estrutura do Projeto

```
pushua-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── BrutalButton.tsx
│   │   ├── BrutalCard.tsx
│   │   ├── BrutalInput.tsx
│   │   └── BrutalBadge.tsx
│   ├── constants/           # Constantes e tema
│   │   └── theme.ts
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/               # Hooks customizados
│   │   └── useNotifications.ts
│   ├── navigation/          # Navegação
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── screens/             # Telas da aplicação
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SubscriptionsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── services/            # Serviços de API
│       ├── api.ts
│       ├── auth.service.ts
│       ├── subscription.service.ts
│       └── notification.service.ts
├── App.tsx                  # Componente principal
├── app.json                # Configuração do Expo
├── package.json
└── tsconfig.json
```

## 🔧 Uso

### Login/Registro
1. Abra o aplicativo
2. Faça login com suas credenciais ou crie uma nova conta
3. Use um domínio no formato `@meuapp`

### Criar Subscrição
1. Acesse a aba "Subscrições"
2. Toque no botão "+ NOVA"
3. Digite o nome do tópico
4. Confirme a criação

### Enviar Notificação
1. Acesse a aba "Notificações"
2. Preencha o tópico, título e mensagem
3. (Opcional) Use o botão "🧪 TESTE" para preencher dados de teste
4. Toque em "PREVIEW" para visualizar
5. Confirme o envio

### Testar Notificações
1. Crie uma subscrição no tópico "test"
2. Na aba "Notificações", clique em "🧪 TESTE"
3. Envie a notificação
4. Você receberá a notificação no dispositivo

## 📋 API Endpoints Utilizados

- `POST /users/register` - Registro de usuário
- `POST /users/login` - Login de usuário
- `GET /users/me` - Obter dados do usuário
- `POST /subscriptions` - Criar subscrição
- `GET /subscriptions` - Listar subscrições
- `DELETE /subscriptions/:id` - Excluir subscrição
- `POST /notifications/send` - Enviar notificação

## 🎨 Componentes Neo-Brutalism

### BrutalButton
Botão com estilo Neo-Brutalism com variantes primary, secondary e outline.

### BrutalCard
Card com sombras duras e bordas grossas.

### BrutalInput
Input estilizado com bordas grossas e sombras.

### BrutalBadge
Badge para tags e labels com diferentes variantes de cores.

## 🚀 Deployment

### Expo EAS Build
```bash
# Instale o EAS CLI
npm install -g eas-cli

# Configure o projeto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 📝 Notas Importantes

- **Notificações Push**: Só funcionam em dispositivos físicos
- **API URL**: Lembre-se de configurar a URL correta da API
- **Firebase**: Necessário para notificações no Android
- **APNs**: Necessário para notificações no iOS

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é parte do sistema Pushua.

---

Feito com ❤️ e React Native
