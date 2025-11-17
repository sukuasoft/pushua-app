# API Examples - Pushua

Exemplos de uso da API Pushua com diferentes clientes.

## Base URL
```
http://localhost:3000
```

## Autenticação

A API usa dois tipos de autenticação:

1. **JWT Token**: Para endpoints de usuário e subscrições
2. **API Key**: Para envio de notificações

---

## 📝 Exemplos com cURL

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "domain": "@meuapp"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "domain": "@meuapp",
    "apiKey": "api-key-uuid"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

### 3. Obter Perfil

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 4. Criar Subscrição

```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "news",
    "deviceToken": "ExponentPushToken[xxxxx]"
  }'
```

### 5. Listar Subscrições

```bash
# Todas
curl -X GET http://localhost:3000/subscriptions \
  -H "Authorization: Bearer SEU_JWT_TOKEN"

# Por tópico
curl -X GET "http://localhost:3000/subscriptions?topicName=news" \
  -H "Authorization: Bearer SEU_JWT_TOKEN"

# Por device token
curl -X GET "http://localhost:3000/subscriptions?deviceToken=ExponentPushToken[xxxxx]" \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 6. Excluir Subscrição

```bash
curl -X DELETE http://localhost:3000/subscriptions/SUBSCRIPTION_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 7. Enviar Notificação

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_API_KEY" \
  -d '{
    "domain": "@meuapp",
    "topicName": "news",
    "title": "Novidades!",
    "body": "Confira as últimas atualizações do app",
    "imageUrl": "https://exemplo.com/imagem.jpg"
  }'
```

---

## 📱 Exemplos com JavaScript/TypeScript

### Setup Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Registrar

```typescript
const register = async (email: string, password: string, domain: string) => {
  const response = await api.post('/users/register', {
    email,
    password,
    domain,
  });
  
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};
```

### Criar Subscrição

```typescript
const createSubscription = async (topicName: string, deviceToken: string) => {
  const response = await api.post('/subscriptions', {
    topicName,
    deviceToken,
  });
  return response.data;
};
```

### Enviar Notificação

```typescript
const sendNotification = async (data: {
  domain: string;
  topicName: string;
  title: string;
  body: string;
  imageUrl?: string;
}) => {
  const apiKey = localStorage.getItem('apiKey');
  
  const response = await axios.post(
    'http://localhost:3000/notifications/send',
    data,
    {
      headers: {
        'x-api-key': apiKey,
      },
    }
  );
  
  return response.data;
};
```

---

## 🐍 Exemplos com Python

```python
import requests

BASE_URL = "http://localhost:3000"

# Registrar
def register(email, password, domain):
    response = requests.post(
        f"{BASE_URL}/users/register",
        json={
            "email": email,
            "password": password,
            "domain": domain
        }
    )
    return response.json()

# Login
def login(email, password):
    response = requests.post(
        f"{BASE_URL}/users/login",
        json={
            "email": email,
            "password": password
        }
    )
    return response.json()

# Criar subscrição
def create_subscription(token, topic_name, device_token):
    response = requests.post(
        f"{BASE_URL}/subscriptions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "topicName": topic_name,
            "deviceToken": device_token
        }
    )
    return response.json()

# Enviar notificação
def send_notification(api_key, domain, topic_name, title, body, image_url=None):
    data = {
        "domain": domain,
        "topicName": topic_name,
        "title": title,
        "body": body
    }
    
    if image_url:
        data["imageUrl"] = image_url
    
    response = requests.post(
        f"{BASE_URL}/notifications/send",
        headers={"x-api-key": api_key},
        json=data
    )
    return response.json()

# Uso
if __name__ == "__main__":
    # Registrar
    result = register("user@example.com", "password123", "@myapp")
    token = result["access_token"]
    api_key = result["user"]["apiKey"]
    
    # Criar subscrição
    create_subscription(token, "news", "ExponentPushToken[xxxxx]")
    
    # Enviar notificação
    send_notification(
        api_key,
        "@myapp",
        "news",
        "Título",
        "Mensagem"
    )
```

---

## 🔧 Postman Collection

Importe a collection em `pushua-api/docs/postman-collection.json`

### Variáveis de Ambiente

```json
{
  "base_url": "http://localhost:3000",
  "jwt_token": "{{your_jwt_token}}",
  "api_key": "{{your_api_key}}"
}
```

---

## 🧪 Testes

### Script de Teste Completo (Node.js)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testFlow() {
  try {
    // 1. Registrar
    console.log('1. Registrando usuário...');
    const registerRes = await axios.post(`${BASE_URL}/users/register`, {
      email: `test${Date.now()}@example.com`,
      password: 'test123',
      domain: '@testapp',
    });
    
    const { access_token, user } = registerRes.data;
    console.log('✓ Usuário registrado:', user.email);
    
    // 2. Criar subscrição
    console.log('\n2. Criando subscrição...');
    const subRes = await axios.post(
      `${BASE_URL}/subscriptions`,
      {
        topicName: 'test',
        deviceToken: 'ExponentPushToken[test]',
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    console.log('✓ Subscrição criada:', subRes.data.id);
    
    // 3. Listar subscrições
    console.log('\n3. Listando subscrições...');
    const listRes = await axios.get(`${BASE_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    console.log('✓ Total de subscrições:', listRes.data.length);
    
    // 4. Enviar notificação
    console.log('\n4. Enviando notificação...');
    const notifRes = await axios.post(
      `${BASE_URL}/notifications/send`,
      {
        domain: '@testapp',
        topicName: 'test',
        title: 'Teste',
        body: 'Mensagem de teste',
      },
      {
        headers: { 'x-api-key': user.apiKey },
      }
    );
    console.log('✓ Notificação enviada:', notifRes.data);
    
    console.log('\n✅ Todos os testes passaram!');
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testFlow();
```

---

## 📊 Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (já existe)
- `500` - Erro interno do servidor

---

## 💡 Dicas

1. **Guarde o JWT Token**: Use após login/registro para autenticação
2. **Use API Key para notificações**: Diferente do JWT
3. **Tópicos**: Use nomes descritivos (news, alerts, updates)
4. **Device Token**: Obtenha do Expo Notifications
5. **Domínio**: Sempre comece com @ (@meuapp)

---

## 🚀 Próximos Passos

1. Teste todos os endpoints
2. Configure notificações push
3. Integre com seu frontend
4. Deploy em produção
