# Integração com Google DialogFlow

Este guia explica como integrar a API Car Store com o Google DialogFlow para criar um chatbot conversacional que permite aos usuários consultar veículos disponíveis.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do DialogFlow](#configuração-do-dialogflow)
4. [Configuração do Webhook](#configuração-do-webhook)
5. [Intents Suportadas](#intents-suportadas)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Testes e Validação](#testes-e-validação)
8. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

A integração com DialogFlow permite que usuários interajam com a API de forma conversacional através de:
- **Chat web** via DialogFlow Messenger
- **Google Assistant**
- **Facebook Messenger**
- **Telegram**
- **Outros canais** suportados pelo DialogFlow

### Formato de Resposta

A API retorna respostas no formato DialogFlow ES (Essentials), incluindo:
- **fulfillmentText**: Texto simples para exibição
- **fulfillmentMessages**: Mensagens ricas (cards, quick replies, etc.)
- **Rich Cards**: Cards com imagens dos veículos, preços e botões de ação

## 🔧 Pré-requisitos

Antes de começar, você precisa:

1. ✅ API Car Store rodando (localmente ou em produção)
2. ✅ Conta no Google Cloud Platform
3. ✅ Projeto criado no [DialogFlow Console](https://dialogflow.cloud.google.com/)
4. ✅ URL pública para o webhook (use ngrok para desenvolvimento local)

### Expondo a API Localmente (Desenvolvimento)

Se estiver desenvolvendo localmente, use o ngrok para criar uma URL pública:

```bash
# Instale o ngrok
npm install -g ngrok

# Exponha sua API (assumindo que ela roda na porta 3000)
ngrok http 3000
```

O ngrok fornecerá uma URL pública como: `https://abc123.ngrok.io`

## ⚙️ Configuração do DialogFlow

### 1. Criar Agente no DialogFlow

1. Acesse o [DialogFlow Console](https://dialogflow.cloud.google.com/)
2. Clique em **"Create Agent"**
3. Configure:
   - **Agent name**: Car Store Bot
   - **Default language**: Portuguese - pt-br
   - **Default time zone**: Seu fuso horário
4. Clique em **"CREATE"**

### 2. Configurar o Webhook

1. No painel esquerdo, clique em **"Fulfillment"**
2. Ative o **"Webhook"**
3. Configure a **URL do Webhook**:
   ```
   https://sua-api.com/api/dialogflow/webhook
   ```
   
   Ou para desenvolvimento local com ngrok:
   ```
   https://abc123.ngrok.io/api/dialogflow/webhook
   ```

4. (Opcional) Adicione headers de autenticação se necessário
5. Clique em **"SAVE"**

### 3. Testar Conectividade

Teste se o webhook está funcionando:

```bash
curl https://sua-api.com/api/dialogflow/test
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "DialogFlow webhook está funcionando!",
  "timestamp": "2025-12-02T22:00:00.000Z",
  "endpoints": {
    "webhook": "/api/dialogflow/webhook"
  }
}
```

### 4. Criar Intents

Agora vamos criar as intents que o bot entenderá:

#### Intent: Boas-vindas

1. Clique em **"Intents"** → **"Create Intent"**
2. Nome: `boas-vindas`
3. **Training phrases** (frases de exemplo):
   - Olá
   - Oi
   - Bom dia
   - Boa tarde
   - Preciso de ajuda

4. **Actions and parameters**: Deixe vazio
5. **Fulfillment**: Ative **"Enable webhook call for this intent"**
6. Clique em **"SAVE"**

#### Intent: Buscar Veículos

1. Crie nova intent: `buscar.veiculos`
2. **Training phrases**:
   - Mostrar veículos da Fiat
   - Quero ver carros da Volkswagen
   - Veículos até 20 mil reais
   - Carros entre 15000 e 30000 reais
   - Mostrar veículos do ano 2020
   - Quero um carro Flex

3. **Actions and parameters**:

   | Parameter name | Entity        | Value              | Required |
   |---------------|---------------|-------------------|----------|
   | marca         | @sys.any      | $marca            | No       |
   | preco_maximo  | @sys.number   | $preco_maximo     | No       |
   | preco_minimo  | @sys.number   | $preco_minimo     | No       |
   | ano_minimo    | @sys.number   | $ano_minimo       | No       |
   | combustivel   | @combustivel  | $combustivel      | No       |

4. **Fulfillment**: Ative o webhook
5. Clique em **"SAVE"**

#### Intent: Listar Marcas

1. Crie nova intent: `listar.marcas`
2. **Training phrases**:
   - Quais marcas vocês têm?
   - Mostrar marcas disponíveis
   - Que marcas de carros vocês vendem?
   - Ver marcas

3. **Fulfillment**: Ative o webhook
4. Clique em **"SAVE"**

#### Intent: Listar Modelos

1. Crie nova intent: `listar.modelos`
2. **Training phrases**:
   - Quais modelos da Fiat?
   - Mostrar modelos da Volkswagen
   - Ver modelos disponíveis
   - Modelos da @marca

3. **Actions and parameters**:

   | Parameter name | Entity    | Value     | Required |
   |---------------|-----------|-----------|----------|
   | marca         | @sys.any  | $marca    | No       |

4. **Fulfillment**: Ative o webhook
5. Clique em **"SAVE"**

#### Intent: Ver Faixa de Preço

1. Crie nova intent: `faixa.preco`
2. **Training phrases**:
   - Qual é a faixa de preço?
   - Quanto custam os carros?
   - Preços dos veículos
   - Valores disponíveis

3. **Fulfillment**: Ative o webhook
4. Clique em **"SAVE"**

#### Intent: Ajuda

1. Crie nova intent: `ajuda`
2. **Training phrases**:
   - Ajuda
   - Como funciona?
   - O que você pode fazer?
   - Preciso de ajuda

3. **Fulfillment**: Ative o webhook
4. Clique em **"SAVE"**

### 5. Criar Entidade Personalizada (Opcional)

Para melhorar o reconhecimento de tipos de combustível:

1. Clique em **"Entities"** → **"Create Entity"**
2. Nome: `combustivel`
3. Adicione sinônimos:

   | Reference value | Synonyms                    |
   |----------------|------------------------------|
   | G              | gasolina, gas               |
   | A              | álcool, etanol              |
   | D              | diesel, óleo diesel         |
   | F              | flex, flexível, bicombustível |

4. Clique em **"SAVE"**

## 🎯 Intents Suportadas

A API suporta as seguintes intents do DialogFlow:

### 1. **welcome / boas-vindas**
Mensagem de boas-vindas quando o usuário inicia a conversa.

**Resposta**: Mensagem de boas-vindas com opções de ação.

---

### 2. **search.vehicles / buscar.veiculos**
Busca veículos com base em filtros.

**Parâmetros aceitos**:
- `brand` ou `marca` (string): Marca do veículo
- `model` ou `modelo` (string): Modelo do veículo
- `fuel_type` ou `combustivel` (string): Tipo de combustível (G/A/D/F)
- `min_price` ou `preco_minimo` (number): Preço mínimo
- `max_price` ou `preco_maximo` (number): Preço máximo
- `min_year` ou `ano_minimo` (number): Ano mínimo
- `max_year` ou `ano_maximo` (number): Ano máximo

**Exemplo de request**:
```json
{
  "queryResult": {
    "intent": {
      "displayName": "buscar.veiculos"
    },
    "parameters": {
      "marca": "Fiat",
      "preco_maximo": 20000
    }
  }
}
```

**Resposta**: Lista de veículos encontrados com cards visuais.

---

### 3. **get.vehicle / ver.veiculo**
Obtém detalhes de um veículo específico.

**Parâmetros**:
- `vehicle_id` ou `id` (number): ID do veículo

**Resposta**: Detalhes completos do veículo com card visual.

---

### 4. **list.brands / listar.marcas**
Lista todas as marcas disponíveis.

**Resposta**: Lista de marcas com sugestões de ação.

---

### 5. **list.models / listar.modelos**
Lista modelos disponíveis, opcionalmente filtrados por marca.

**Parâmetros**:
- `brand` ou `marca` (string, opcional): Filtrar por marca

**Resposta**: Lista de modelos.

---

### 6. **get.price.range / faixa.preco**
Retorna a faixa de preços disponível.

**Parâmetros**:
- `brand` ou `marca` (string, opcional): Filtrar por marca

**Resposta**: Preço mínimo e máximo.

---

### 7. **help / ajuda**
Mensagem de ajuda explicando o que o bot pode fazer.

**Resposta**: Lista de funcionalidades com exemplos.

## 💬 Exemplos de Uso

### Exemplo 1: Buscar veículos da Fiat

**Usuário**: "Mostrar veículos da Fiat"

**Request para API**:
```json
{
  "queryResult": {
    "intent": {
      "displayName": "buscar.veiculos"
    },
    "parameters": {
      "marca": "Fiat"
    }
  }
}
```

**Response da API**:
```json
{
  "fulfillmentText": "Encontrei 3 veículos da marca Fiat:\n\n1. Fiat Uno (2010) - R$ 15.000\n2. Fiat Palio (2015) - R$ 22.000\n3. Fiat Strada (2018) - R$ 35.000",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Encontrei 3 veículos da marca Fiat:..."]
      }
    },
    {
      "card": {
        "title": "Fiat Uno (2010)",
        "subtitle": "R$ 15.000 | 120.000 km | Gasolina",
        "imageUri": "https://example.com/photo.jpg",
        "buttons": [
          {
            "text": "Ver detalhes",
            "postback": "Ver veículo 1"
          }
        ]
      }
    }
  ]
}
```

### Exemplo 2: Veículos até 20 mil

**Usuário**: "Quero ver carros até 20 mil reais"

**Request**:
```json
{
  "queryResult": {
    "intent": {
      "displayName": "buscar.veiculos"
    },
    "parameters": {
      "preco_maximo": 20000
    }
  }
}
```

### Exemplo 3: Listar marcas

**Usuário**: "Quais marcas vocês têm?"

**Response**:
```json
{
  "fulfillmentText": "Temos veículos das seguintes marcas:\n\n1. Fiat\n2. Volkswagen\n3. Chevrolet\n4. Ford\n\nQual marca você prefere?",
  "fulfillmentMessages": [...]
}
```

## 🧪 Testes e Validação

### Testar no Simulador do DialogFlow

1. No DialogFlow Console, use o painel **"Try it now"** à direita
2. Digite frases como:
   - "Olá"
   - "Mostrar veículos da Fiat"
   - "Quais marcas vocês têm?"
   - "Veículos até 20 mil"

3. Verifique se as respostas estão corretas

### Testar com cURL

Teste o webhook diretamente:

```bash
curl -X POST https://sua-api.com/api/dialogflow/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "queryResult": {
      "intent": {
        "displayName": "buscar.veiculos"
      },
      "parameters": {
        "marca": "Fiat",
        "preco_maximo": 20000
      }
    }
  }'
```

### Testar Integração Web

1. No DialogFlow Console, vá em **"Integrations"**
2. Ative **"DialogFlow Messenger"**
3. Copie o código HTML fornecido
4. Cole no seu site para ter um chat widget

## 🐛 Troubleshooting

### Problema: Webhook retorna erro 500

**Solução**:
- Verifique os logs da API: `npm run dev`
- Certifique-se de que o banco de dados está acessível
- Teste a conectividade: `curl https://sua-api.com/api/dialogflow/test`

### Problema: DialogFlow não recebe respostas

**Solução**:
- Verifique se o webhook está ativado na intent
- Confirme que a URL do webhook está correta em Fulfillment
- Use ngrok para desenvolvimento local e certifique-se de que a URL está atualizada

### Problema: Parâmetros não são reconhecidos

**Solução**:
- Verifique se os nomes dos parâmetros na intent correspondem aos esperados pela API
- A API aceita tanto nomes em inglês quanto português (ex: `brand` ou `marca`)
- Confira os training phrases para incluir exemplos variados

### Problema: Cards não aparecem

**Solução**:
- Cards só funcionam em plataformas que suportam rich messages
- No simulador do DialogFlow, cards aparecem como JSON
- Teste em uma integração real (Messenger, Telegram, etc.)

### Problema: CORS Error

**Solução**:
- A API já está configurada com CORS habilitado
- Se precisar restringir, modifique em `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://dialogflow.cloud.google.com'
}));
```

## 📊 Logs e Monitoramento

### Ver logs da API

```bash
# Modo desenvolvimento
npm run dev

# Logs em produção
pm2 logs car-store-api
```

### Logs do DialogFlow

1. No DialogFlow Console, vá em **"History"**
2. Veja todas as conversas e requests/responses
3. Use para debug e análise de comportamento do usuário

## 🚀 Próximos Passos

Após configurar a integração básica, considere:

1. **Adicionar contextos**: Para conversas mais naturais e com memória
2. **Implementar follow-up intents**: Para fluxos conversacionais complexos
3. **Adicionar mais entidades**: Para reconhecimento mais preciso
4. **Integrar com Google Assistant**: Para controle por voz
5. **Adicionar analytics**: Para monitorar uso e melhorar o bot

## 📚 Recursos Adicionais

- [Documentação DialogFlow ES](https://cloud.google.com/dialogflow/es/docs)
- [Webhook Format](https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook)
- [Rich Messages](https://cloud.google.com/dialogflow/es/docs/intents-rich-messages)
- [Best Practices](https://cloud.google.com/dialogflow/es/docs/best-practices)

## 💡 Dicas de Boas Práticas

1. **Training phrases variadas**: Adicione muitos exemplos de como o usuário pode fazer a mesma pergunta
2. **Fallback intent**: Configure uma intent padrão para quando o bot não entender
3. **Small talk**: Considere adicionar small talk para o bot parecer mais humano
4. **Testes frequentes**: Teste regularmente com usuários reais
5. **Analise histórico**: Use o histórico do DialogFlow para identificar melhorias

---

**Desenvolvido para Car Store API** 🚗
