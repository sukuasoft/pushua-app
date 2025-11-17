# 🚀 Guia de Instalação Rápida - Pushua App

## Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app no seu smartphone (Android/iOS)

## Passo a Passo

### 1. Instalar Dependências
```bash
cd pushua-app
npm install
```

### 2. Configurar API URL
Edite o arquivo `src/services/api.ts` e altere a URL da API:
```typescript
const API_URL = 'http://SEU_IP:3000'; // Use o IP da sua máquina, não localhost
```

**Importante**: Se você estiver testando em um dispositivo físico, use o IP da sua máquina na rede local (ex: 192.168.1.100:3000), não use `localhost`.

### 3. Configurar Notificações (Opcional para desenvolvimento)

#### Para Android:
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Baixe o arquivo `google-services.json`
3. Coloque na raiz do projeto pushua-app

#### Para iOS:
1. Configure o APNs no Apple Developer Console
2. Configure as credenciais no Expo

### 4. Iniciar o Projeto
```bash
npm start
```

### 5. Executar no Dispositivo
- Escaneie o QR Code com o app Expo Go (Android) ou Camera (iOS)
- Ou pressione `a` para Android ou `i` para iOS no terminal

## 🧪 Testando a Aplicação

### Criar Conta
1. Abra o app
2. Clique em "Criar uma conta"
3. Preencha:
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
   - Domínio: @seuapp (deve começar com @)

### Testar Notificações
1. Faça login no app
2. Vá para "Subscrições"
3. Crie uma subscrição no tópico "test"
4. Vá para "Notificações"
5. Clique em "🧪 TESTE" para preencher automaticamente
6. Clique em "PREVIEW" e depois "ENVIAR NOTIFICAÇÃO"
7. Você receberá a notificação no dispositivo!

## 🔧 Troubleshooting

### Erro de conexão com API
- Verifique se a API está rodando (`npm run start:dev` no pushua-api)
- Verifique se está usando o IP correto (não use localhost em dispositivo físico)
- Desative firewall/antivírus temporariamente

### Notificações não aparecem
- Notificações push só funcionam em dispositivos físicos
- Verifique se concedeu permissão para notificações
- No desenvolvimento, as notificações podem demorar alguns segundos

### Expo Go não conecta
- Certifique-se de que o computador e smartphone estão na mesma rede
- Tente usar o modo Tunnel no Expo: `expo start --tunnel`

## 📱 Comandos Úteis

```bash
# Iniciar em modo desenvolvimento
npm start

# Limpar cache e reiniciar
npm start -- --clear

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 🎨 Personalizando

### Alterar Cores
Edite `src/constants/theme.ts`:
```typescript
export const Colors = {
  primary: '#24FE9C',      // Cor primária
  primaryDark: '#1AC17D',  // Cor primária escura
  // ...
};
```

### Alterar Nome do App
Edite `app.json`:
```json
{
  "expo": {
    "name": "Seu Nome",
    "slug": "seu-slug"
  }
}
```

## 📚 Próximos Passos

1. Configure o Firebase para notificações em produção
2. Customize as cores e branding
3. Adicione mais funcionalidades
4. Publique na Google Play Store / App Store

## 🆘 Precisa de Ajuda?

- Verifique a [documentação do Expo](https://docs.expo.dev/)
- Verifique a [documentação do React Navigation](https://reactnavigation.org/)
- Abra uma issue no repositório

---

Boa sorte! 🚀
