# Guia de Integrações do Car Store API

A API Car Store suporta integração com as principais plataformas de chatbot do mercado. Escolha a melhor opção para seu caso de uso.

## 🤖 Plataformas Suportadas

### 1. Google DialogFlow ✅
**Arquivo:** [DIALOGFLOW_INTEGRATION.md](./DIALOGFLOW_INTEGRATION.md)

**Melhor para:**
- Integração com Google Assistant
- Multi-canal (Web, Facebook, Telegram, etc.)
- Processamento de linguagem natural avançado
- Empresas que usam Google Cloud

**Formato:** Webhook com formato específico DialogFlow ES

**Características:**
- ✅ Webhook dedicado: `POST /api/dialogflow/webhook`
- ✅ Suporte a rich messages (cards, quick replies)
- ✅ Formatação automática de respostas
- ✅ 7 intents pré-configurados

**Começar:**
```bash
# Ver documentação completa
cat DIALOGFLOW_INTEGRATION.md

# Testar webhook
curl http://localhost:3000/api/dialogflow/test
```

---

### 2. Microsoft Copilot Studio ✅
**Arquivo:** [COPILOT_STUDIO_INTEGRATION.md](./COPILOT_STUDIO_INTEGRATION.md)

**Melhor para:**
- Empresas que usam Microsoft 365
- Integração com Microsoft Teams
- Interface visual drag-and-drop
- Power Platform ecosystem

**Formato:** REST API padrão (sem webhook especial necessário)

**Características:**
- ✅ Usa endpoints REST existentes
- ✅ Configuração via Actions (HTTP requests)
- ✅ Adaptive Cards para visualização
- ✅ Integração nativa com Teams

**Começar:**
```bash
# Ver documentação completa
cat COPILOT_STUDIO_INTEGRATION.md

# Testar endpoints
curl http://localhost:3000/api/vehicles
```

---

### 3. Qualquer Plataforma REST
**Arquivo:** [API_INTEGRATION.md](./API_INTEGRATION.md)

**Melhor para:**
- Custom chatbots
- Outras plataformas (Rasa, Botpress, etc.)
- Aplicações web/mobile
- Integrações personalizadas

**Formato:** REST API padrão JSON

**Características:**
- ✅ Swagger documentation em `/api-docs`
- ✅ Endpoints RESTful completos
- ✅ CRUD para todas as entidades
- ✅ Filtros avançados

**Começar:**
```bash
# Ver documentação Swagger
open http://localhost:3000/api-docs
```

## 📊 Comparação de Plataformas

| Característica | DialogFlow | Copilot Studio | REST Direto |
|----------------|-----------|----------------|-------------|
| **Dificuldade Setup** | Média | Fácil | Fácil |
| **Webhook Especial** | ✅ Sim | ❌ Não | ❌ Não |
| **Rich Messages** | ✅ Cards | ✅ Adaptive Cards | ➖ Manual |
| **NLP Nativo** | ✅✅ Excelente | ✅ Bom | ❌ N/A |
| **Visual Builder** | ➖ Limitado | ✅✅ Excelente | ❌ N/A |
| **Multi-canal** | ✅✅ Muitos | ✅ Microsoft | ➖ Depende |
| **Custo** | Pay-per-use | M365 incluído | Grátis (API) |
| **Melhor para** | Google eco | Microsoft eco | Custom/Flex |

## 🚀 Quick Start por Plataforma

### DialogFlow

1. Configure o webhook:
   ```
   URL: https://sua-api.com/api/dialogflow/webhook
   ```

2. Crie intents no DialogFlow Console

3. Teste no simulador

**Tempo estimado:** 30-45 minutos

---

### Copilot Studio

1. Configure variável de ambiente:
   ```
   CARSTORE_API_URL = https://sua-api.com
   ```

2. Crie Actions para cada funcionalidade

3. Crie Topics usando as Actions

4. Teste no painel integrado

**Tempo estimado:** 20-30 minutos

---

### REST API Direto

1. Leia a documentação Swagger:
   ```
   http://localhost:3000/api-docs
   ```

2. Faça requisições HTTP:
   ```bash
   curl http://localhost:3000/api/vehicles?brand=Fiat
   ```

3. Integre na sua aplicação

**Tempo estimado:** 10-15 minutos

## 🎯 Endpoints Principais

Todas as plataformas podem usar estes endpoints:

### Veículos
```
GET    /api/vehicles          # Listar com filtros
GET    /api/vehicles/:id      # Buscar por ID
POST   /api/vehicles          # Criar
PUT    /api/vehicles/:id      # Atualizar
DELETE /api/vehicles/:id      # Deletar
```

### Marcas
```
GET    /api/brands            # Listar
GET    /api/brands/:id        # Buscar por ID
```

### Modelos
```
GET    /api/models            # Listar
GET    /api/models/:id        # Buscar por ID
```

### Outros
```
GET    /api/fuel-types        # Tipos de combustível
GET    /api/items             # Itens/acessórios
GET    /api/customers         # Clientes
GET    /api/sales             # Vendas
```

### Especial DialogFlow
```
POST   /api/dialogflow/webhook   # Webhook DialogFlow
GET    /api/dialogflow/test      # Teste de conectividade
```

## 📖 Documentação Completa

- **DialogFlow**: [DIALOGFLOW_INTEGRATION.md](./DIALOGFLOW_INTEGRATION.md)
- **Copilot Studio**: [COPILOT_STUDIO_INTEGRATION.md](./COPILOT_STUDIO_INTEGRATION.md)
- **API REST**: [README.md](./README.md)
- **Swagger**: http://localhost:3000/api-docs

## 🔐 Autenticação

Por padrão, a API não requer autenticação. Para produção, considere:

1. **API Keys**: Header `Authorization`
2. **JWT Tokens**: Para clientes autenticados
3. **OAuth 2.0**: Para integrações enterprise

Configure conforme necessário para sua plataforma.

## 🧪 Testando as Integrações

### DialogFlow
```bash
curl -X POST http://localhost:3000/api/dialogflow/webhook \
  -H "Content-Type: application/json" \
  -d '{"queryResult":{"intent":{"displayName":"buscar.veiculos"},"parameters":{"marca":"Fiat"}}}'
```

### Copilot Studio / REST
```bash
curl "http://localhost:3000/api/vehicles?brand=Fiat&max_price=20000"
```

## 💡 Recomendações

**Use DialogFlow se:**
- Precisa de NLP muito robusto
- Quer integração com Google Assistant
- Planeja multi-canal (WhatsApp, Telegram, etc.)

**Use Copilot Studio se:**
- Sua empresa usa Microsoft 365
- Quer integração com Teams
- Prefere interface visual sem código
- Já usa Power Platform

**Use REST Direto se:**
- Está construindo chatbot custom
- Usa outra plataforma (Rasa, Botpress, etc.)
- Precisa de controle total
- Quer integrar em app web/mobile

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique o arquivo de documentação específico da plataforma
2. Consulte a seção Troubleshooting
3. Teste endpoints diretamente com cURL
4. Verifique logs da API

## 🎉 Próximos Passos

1. Escolha sua plataforma
2. Leia a documentação específica
3. Configure conforme o guia
4. Teste com exemplos fornecidos
5. Customize para seu caso de uso

---

**Desenvolvido para Car Store API** 🚗
