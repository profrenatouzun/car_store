# Integração com Microsoft Copilot Studio

Este guia explica como integrar a API Car Store com o Microsoft Copilot Studio (anteriormente Power Virtual Agents) para criar um chatbot conversacional.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Copilot Studio](#configuração-do-copilot-studio)
4. [Criar Actions (Ações)](#criar-actions-ações)
5. [Exemplos de Fluxos](#exemplos-de-fluxos)
6. [Autenticação](#autenticação)
7. [Testes](#testes)
8. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O Microsoft Copilot Studio integra-se com APIs REST através de **Actions** (ações). A API Car Store já está pronta para ser consumida pelo Copilot Studio através dos endpoints REST padrão.

### Como Funciona

```
┌──────────────────┐
│  Copilot Studio  │
│      Agent       │
└────────┬─────────┘
         │ 1. User asks question
         ▼
┌──────────────────┐
│   Topic/Action   │
│   Triggered      │
└────────┬─────────┘
         │ 2. HTTP Request
         ▼
┌─────────────────────┐
│   Car Store API     │
│   REST Endpoints    │
└────────┬────────────┘
         │ 3. JSON Response
         ▼
┌──────────────────┐
│  Copilot Studio  │
│  Process & Reply │
└──────────────────┘
```

## 🔧 Pré-requisitos

1. ✅ Conta no Microsoft 365 com acesso ao Copilot Studio
2. ✅ API Car Store rodando (localmente ou em produção)
3. ✅ URL pública para a API (use ngrok para desenvolvimento local)
4. ✅ (Opcional) Autenticação configurada na API

### Expondo a API Localmente

Para desenvolvimento local, use ngrok:

```bash
# Instale o ngrok
npm install -g ngrok

# Exponha sua API (porta 3000)
ngrok http 3000
```

Anote a URL fornecida (ex: `https://abc123.ngrok.io`)

## ⚙️ Configuração do Copilot Studio

### 1. Criar um Novo Agente

1. Acesse [Microsoft Copilot Studio](https://copilotstudio.microsoft.com/)
2. Clique em **"Create"** → **"New agent"**
3. Configure:
   - **Nome**: Car Store Assistant
   - **Idioma**: Portuguese (Brazil)
   - **Descrição**: Assistente para busca de veículos
4. Clique em **"Create"**

### 2. Configurar Variáveis de Ambiente

Para facilitar a manutenção, configure a URL base da API como variável:

1. No menu lateral, clique em **"Settings"** (⚙️)
2. Vá para **"Variables"**
3. Clique em **"+ New variable"**
4. Configure:
   - **Name**: `CARSTORE_API_URL`
   - **Type**: String
   - **Default value**: `https://sua-api.com` (ou URL do ngrok)
5. Clique em **"Save"**

## 🎬 Criar Actions (Ações)

As ações são chamadas HTTP para os endpoints da API. Vamos criar ações para as principais funcionalidades.

### Action 1: Buscar Veículos

1. No menu lateral, clique em **"Actions"**
2. Clique em **"+ Add an action"**
3. Selecione **"From blank"**
4. Configure:

**Informações Básicas:**
- **Name**: SearchVehicles
- **Description**: Busca veículos por marca, preço, ano ou combustível

**Inputs:**
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| brand | String | No | Marca do veículo |
| minPrice | Number | No | Preço mínimo |
| maxPrice | Number | No | Preço máximo |
| minYear | Number | No | Ano mínimo |
| maxYear | Number | No | Ano máximo |
| fuelType | String | No | Tipo de combustível (G/A/D/F) |

**Action:**
1. Adicione um **"HTTP request"** node
2. Configure:
   - **Method**: GET
   - **URL**: 
     ```
     {System.GlobalVar_CARSTORE_API_URL}/api/vehicles
     ```
   - **Query parameters** (adicione dinamicamente):
     ```
     brand={Topic.brand}
     min_price={Topic.minPrice}
     max_price={Topic.maxPrice}
     min_year={Topic.minYear}
     max_year={Topic.maxYear}
     fuel_type={Topic.fuelType}
     ```
   - **Headers**:
     ```
     Content-Type: application/json
     ```

3. Em **"Response"**, cole este JSON de exemplo:
```json
[
  {
    "id": 1,
    "brand": "Fiat",
    "model": "Uno",
    "year_manufacture": 2010,
    "fuel_type": "G",
    "simple_description": "Ótimo estado",
    "mileage": 120000,
    "ad_price": 15000,
    "fipe_price": 16000,
    "photos": ["https://example.com/photo.jpg"]
  }
]
```

**Outputs:**
- **vehicles** (Array): Response body

4. Clique em **"Save"**

### Action 2: Buscar Veículo por ID

1. Crie nova action: **GetVehicle**
2. **Description**: Obtém detalhes de um veículo específico

**Inputs:**
| Nome | Tipo | Obrigatório |
|------|------|-------------|
| vehicleId | Number | Yes |

**HTTP Request:**
- **Method**: GET
- **URL**: `{System.GlobalVar_CARSTORE_API_URL}/api/vehicles/{Topic.vehicleId}`

**Response Example:**
```json
{
  "id": 1,
  "brand": "Fiat",
  "model": "Uno",
  "year_manufacture": 2010,
  "fuel_type": "G",
  "simple_description": "Ótimo estado",
  "mileage": 120000,
  "ad_price": 15000,
  "fipe_price": 16000,
  "photos": ["https://example.com/photo.jpg"]
}
```

**Outputs:**
- **vehicle** (Object): Response body

### Action 3: Listar Marcas

1. Crie nova action: **ListBrands**
2. **Description**: Lista todas as marcas disponíveis

**Inputs:** Nenhum

**HTTP Request:**
- **Method**: GET
- **URL**: `{System.GlobalVar_CARSTORE_API_URL}/api/brands`

**Response Example:**
```json
[
  {
    "brand_id": 1,
    "name": "Fiat"
  },
  {
    "brand_id": 2,
    "name": "Volkswagen"
  }
]
```

**Outputs:**
- **brands** (Array): Response body

### Action 4: Listar Modelos

1. Crie nova action: **ListModels**
2. **Description**: Lista modelos disponíveis

**Inputs:**
| Nome | Tipo | Obrigatório |
|------|------|-------------|
| brandId | Number | No |

**HTTP Request:**
- **Method**: GET
- **URL**: `{System.GlobalVar_CARSTORE_API_URL}/api/models`
- **Query parameters** (se brandId fornecido):
  ```
  brand_id={Topic.brandId}
  ```

**Response Example:**
```json
[
  {
    "model_id": 1,
    "name": "Uno",
    "brand_id": 1,
    "brand_name": "Fiat"
  }
]
```

**Outputs:**
- **models** (Array): Response body

## 💬 Exemplos de Fluxos

### Fluxo 1: Buscar Veículos por Marca

1. No menu lateral, clique em **"Topics"**
2. Clique em **"+ Add a topic"** → **"From blank"**
3. Configure:
   - **Name**: Search by Brand
   - **Description**: Permite buscar veículos por marca

4. Adicione **Trigger phrases**:
   - "Mostrar veículos da {marca}"
   - "Quero ver carros da {marca}"
   - "Veículos {marca}"
   - "Buscar {marca}"

5. Adicione um **Question node**:
   - **Ask**: "Qual marca você procura?"
   - **Identify**: String
   - **Save response as**: `brand`

6. Adicione um **Call an action**:
   - Selecione **SearchVehicles**
   - **brand**: {Topic.brand}

7. Adicione um **Condition node**:
   - **Condition**: `{Action.vehicles.Count} > 0`

8. **If Yes** (veículos encontrados):
   - Adicione **Message node**:
     ```
     Encontrei {Action.vehicles.Count} veículo(s) da marca {Topic.brand}:
     ```
   - Adicione **Adaptive card** ou liste os resultados

9. **If No** (nenhum veículo):
   - Adicione **Message node**:
     ```
     Desculpe, não encontrei veículos da marca {Topic.brand}.
     ```

### Fluxo 2: Buscar por Faixa de Preço

1. Crie novo topic: **Search by Price**

2. **Trigger phrases**:
   - "Veículos até {número} reais"
   - "Carros entre {número} e {número}"
   - "Mostrar carros baratos"

3. Adicione **Question nodes**:
   - Pergunta 1: "Qual o preço máximo?" → Save as: `maxPrice`
   - Pergunta 2: "E o preço mínimo? (ou digite 0)" → Save as: `minPrice`

4. **Call an action**:
   - Action: SearchVehicles
   - minPrice: {Topic.minPrice}
   - maxPrice: {Topic.maxPrice}

5. Mostre os resultados ou mensagem de "nenhum encontrado"

### Fluxo 3: Ver Marcas Disponíveis

1. Crie novo topic: **Show Brands**

2. **Trigger phrases**:
   - "Quais marcas vocês têm?"
   - "Mostrar marcas"
   - "Ver marcas disponíveis"

3. **Call an action**:
   - Action: ListBrands

4. Adicione **Message node** com loop:
   ```
   Temos veículos das seguintes marcas:
   
   {ForEach brand in Action.brands:
     - {brand.name}
   }
   ```

## 🔐 Autenticação

Se sua API requer autenticação, configure nos HTTP requests:

### API Key (Header)

No HTTP request node, adicione header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

Ou use variável de ambiente:
```
Authorization: Bearer {System.GlobalVar_API_KEY}
```

### OAuth 2.0

1. No Copilot Studio, vá em **Settings** → **Security**
2. Configure **Authentication** com seu provider OAuth
3. O token será incluído automaticamente nas requisições

## 🧪 Testes

### Testar no Copilot Studio

1. Use o painel **"Test your agent"** no canto superior direito
2. Digite frases de teste:
   - "Mostrar veículos da Fiat"
   - "Veículos até 20 mil"
   - "Quais marcas vocês têm?"
3. Verifique se as respostas estão corretas

### Verificar Chamadas HTTP

1. Durante um teste, clique em **"View details"** na conversa
2. Veja os logs de **"Action calls"**
3. Verifique:
   - URL chamada
   - Parâmetros enviados
   - Response recebido
   - Erros (se houver)

### Testar Endpoints Diretamente

Antes de integrar, teste os endpoints:

```bash
# Listar veículos
curl "https://sua-api.com/api/vehicles?brand=Fiat&max_price=20000"

# Buscar por ID
curl "https://sua-api.com/api/vehicles/1"

# Listar marcas
curl "https://sua-api.com/api/brands"

# Listar modelos
curl "https://sua-api.com/api/models"
```

## 🎨 Melhorando a Experiência do Usuário

### Usar Adaptive Cards

Para exibir veículos visualmente:

1. Após chamar a action SearchVehicles
2. Adicione um **"Show a message"** node
3. Selecione **"Adaptive Card"**
4. Use este template:

```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "Container",
      "items": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "Image",
                  "url": "${photos[0]}",
                  "size": "medium"
                }
              ]
            },
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${brand} ${model}",
                  "weight": "bolder",
                  "size": "large"
                },
                {
                  "type": "TextBlock",
                  "text": "Ano: ${year_manufacture}",
                  "spacing": "none"
                },
                {
                  "type": "TextBlock",
                  "text": "Preço: R$ ${formatNumber(ad_price, 0)}",
                  "color": "good",
                  "weight": "bolder"
                },
                {
                  "type": "TextBlock",
                  "text": "KM: ${formatNumber(mileage, 0)}",
                  "spacing": "none"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Usar Quick Replies

Adicione botões para facilitar navegação:

```
Message: "O que você gostaria de fazer?"

Quick replies:
- "Ver veículos"
- "Buscar por marca"
- "Ver marcas disponíveis"
- "Filtrar por preço"
```

## 🐛 Troubleshooting

### Problema: Action falha com erro 404

**Solução:**
- Verifique se a URL base está correta nas variáveis
- Confirme que a API está rodando: `curl https://sua-api.com/health`
- Verifique se o endpoint existe na API

### Problema: CORS Error

**Solução:**
O Copilot Studio faz requisições server-side, então CORS não deve ser problema. Se ocorrer:
- Verifique se a API aceita requisições do domínio do Copilot Studio
- A API já está configurada com CORS habilitado

### Problema: Autenticação falha

**Solução:**
- Verifique se o token/API key está correto
- Confirme que o header está sendo enviado
- Teste manualmente com cURL:
  ```bash
  curl -H "Authorization: Bearer SEU_TOKEN" https://sua-api.com/api/vehicles
  ```

### Problema: Resposta vazia

**Solução:**
- Verifique os logs da API
- Confirme que os query parameters estão corretos
- Teste o endpoint diretamente com os mesmos parâmetros

### Problema: Parsing de resposta falha

**Solução:**
- Verifique se o JSON de exemplo na action corresponde à resposta real
- Use o formato exato retornado pela API
- Teste a response com ferramentas como Postman

## 📊 Monitoramento e Analytics

### Ver Analytics no Copilot Studio

1. No menu lateral, clique em **"Analytics"**
2. Veja métricas como:
   - Total de sessões
   - Taxa de resolução
   - Topics mais usados
   - Abandono de conversas

### Logs da API

Para ver logs das chamadas:

```bash
# No servidor
tail -f /var/log/car-store-api.log

# Ou com PM2
pm2 logs car-store-api
```

## 🚀 Próximos Passos

Após a integração básica:

1. **Adicionar mais topics** para cobrir todos os casos de uso
2. **Implementar fallback topics** para perguntas não reconhecidas
3. **Adicionar small talk** para tornar o bot mais natural
4. **Integrar com canais**:
   - Microsoft Teams
   - Website (widget)
   - Facebook Messenger
   - WhatsApp (via Twilio)
5. **Adicionar analytics customizado** para tracking avançado
6. **Implementar handoff** para agentes humanos quando necessário

## 🔗 Recursos Adicionais

- [Documentação Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
- [HTTP Request Actions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow)
- [Adaptive Cards Designer](https://adaptivecards.io/designer/)
- [Power Fx Formula Reference](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference)

## 💡 Dicas de Boas Práticas

1. **Use variáveis de ambiente** para URLs e tokens
2. **Teste cada action isoladamente** antes de integrar em topics
3. **Forneça feedback ao usuário** durante chamadas de API (ex: "Buscando...")
4. **Trate erros gracefully** com mensagens amigáveis
5. **Limite resultados** para evitar respostas muito longas
6. **Use confirmações** antes de ações importantes
7. **Mantenha conversas naturais** - o bot deve parecer humano

---

**Desenvolvido para Car Store API** 🚗

## Comparação: DialogFlow vs Copilot Studio

| Característica | DialogFlow | Copilot Studio |
|----------------|-----------|----------------|
| **Integração** | Webhook format específico | HTTP REST direto |
| **Configuração** | Intents + Webhook | Topics + Actions |
| **Formato Response** | fulfillmentText/Messages | JSON padrão |
| **Facilidade** | Média | Fácil |
| **Visual Builder** | Limitado | Excelente |
| **Canais** | Muitos | Focado Microsoft |
| **Preço** | Pay-per-use | Incluído no M365 |
