# Instruções para Assets

## Imagens Necessárias

Para que o aplicativo funcione corretamente, você precisa adicionar as seguintes imagens na pasta `assets/`:

### 1. icon.png
- **Tamanho**: 1024x1024 pixels
- **Formato**: PNG com transparência
- **Descrição**: Ícone principal do aplicativo
- **Sugestão**: Use o emoji 📬 ou crie um ícone com as cores #24FE9C e preto

### 2. splash.png
- **Tamanho**: 1284x2778 pixels (para iOS) ou 1080x1920 (para Android)
- **Formato**: PNG
- **Descrição**: Tela de splash inicial
- **Sugestão**: Fundo #24FE9C com o logo/nome Pushua em preto

### 3. adaptive-icon.png
- **Tamanho**: 1024x1024 pixels
- **Formato**: PNG com transparência
- **Descrição**: Ícone adaptativo para Android
- **Nota**: A área segura é de 512x512 pixels no centro

### 4. notification-icon.png
- **Tamanho**: 96x96 pixels
- **Formato**: PNG
- **Descrição**: Ícone para notificações (Android)
- **Sugestão**: Versão simplificada do ícone principal em branco

### 5. favicon.png
- **Tamanho**: 48x48 pixels
- **Formato**: PNG
- **Descrição**: Favicon para versão web

## Gerando Assets Rapidamente

### Opção 1: Usar o Expo Asset Generator
```bash
# Instale a ferramenta
npm install -g @expo/image-utils

# Gere os assets a partir de um único arquivo
npx expo-asset-generator path/to/icon-source.png
```

### Opção 2: Usar ferramentas online
- [App Icon Generator](https://www.appicon.co/)
- [Expo Asset Generator](https://github.com/expo/expo-cli)

### Opção 3: Criar manualmente
Use qualquer editor de imagens (Photoshop, Figma, Canva) e exporte nos tamanhos especificados.

## Dicas de Design

### Paleta de Cores
- Primary: #24FE9C (verde neon)
- Primary Dark: #1AC17D (verde escuro)
- Black: #000000
- White: #FFFFFF

### Estilo Neo-Brutalism
- Bordas grossas (3-4px)
- Sombras duras sem blur
- Contraste alto
- Tipografia bold/black
- Formas geométricas simples

### Exemplos de Ícone
1. Emoji 📬 sobre fundo verde
2. Envelope estilizado com borda preta
3. Sino de notificação Neo-Brutalism
4. Letra "P" estilizada

## Estrutura Final

```
assets/
├── icon.png           (1024x1024)
├── splash.png         (1284x2778 ou 1080x1920)
├── adaptive-icon.png  (1024x1024)
├── notification-icon.png (96x96)
└── favicon.png        (48x48)
```

## Assets Temporários

Se você quiser testar o app sem criar os assets agora, pode usar placeholders:

1. Crie imagens simples com as cores da marca
2. Use ferramentas online para gerar rapidamente
3. O Expo irá avisar sobre assets faltando mas o app funcionará

## Importante

- Todos os assets devem seguir a identidade visual Neo-Brutalism
- Use cores vibrantes (#24FE9C) com alto contraste
- Mantenha as bordas pretas e sombras duras
- Teste em diferentes tamanhos de tela
