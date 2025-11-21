# Car Store API

API REST para gerenciamento de veículos desenvolvida com Node.js, Express e PostgreSQL.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## 🚀 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env` e configure as credenciais do banco de dados:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=car_store
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
```

3. Execute os scripts SQL para criar o banco de dados:

```bash
# Execute o script de criação das tabelas
psql -U postgres -d car_store -f ../scripts/create-script-car-store.sql

# Execute o script de inserção de dados (opcional)
psql -U postgres -d car_store -f ../scripts/inserts.sql
```

## 🏃 Executando a API

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação Swagger

Após iniciar o servidor, acesse a documentação Swagger em:

```
http://localhost:3000/api-docs
```

## 🔌 Endpoints

### Veículos

- `GET /api/vehicles` - Lista todos os veículos (com filtros opcionais)
- `GET /api/vehicles/:id` - Busca um veículo por ID
- `POST /api/vehicles` - Cria um novo veículo
- `PUT /api/vehicles/:id` - Atualiza um veículo
- `DELETE /api/vehicles/:id` - Deleta um veículo

### Health Check

- `GET /health` - Verifica o status da API e conexão com o banco

## 📝 Exemplos de Uso

### Listar todos os veículos

```bash
curl http://localhost:3000/api/vehicles
```

### Filtrar veículos

```bash
curl "http://localhost:3000/api/vehicles?brand=Fiat&fuel_type=G&min_price=5000&max_price=15000"
```

### Buscar veículo por ID

```bash
curl http://localhost:3000/api/vehicles/1
```

### Criar novo veículo

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Fiat",
    "model": "Uno Mille",
    "year_manufacture": 1998,
    "fuel_type": "G",
    "simple_description": "Lata véia mas tá rodando!",
    "mileage": 280000,
    "ad_price": 8500,
    "fipe_price": 9200,
    "items": ["Direção mecânica"],
    "photos": ["https://example.com/photo1.jpg"]
  }'
```

### Atualizar veículo

```bash
curl -X PUT http://localhost:3000/api/vehicles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "ad_price": 9000,
    "simple_description": "Nova descrição"
  }'
```

### Deletar veículo

```bash
curl -X DELETE http://localhost:3000/api/vehicles/1
```

## 🏗️ Estrutura do Projeto

```
server/
├── config/
│   ├── database.js      # Configuração do PostgreSQL
│   └── swagger.js       # Configuração do Swagger
├── controllers/
│   └── vehicleController.js  # Lógica dos controllers
├── repositories/
│   └── vehicleRepository.js  # Acesso ao banco de dados
├── routes/
│   └── vehicleRoutes.js      # Definição das rotas
├── index.js             # Arquivo principal
├── package.json
└── README.md
```

## 🔒 Validações

A API valida os seguintes campos:

- `fuel_type`: Deve ser 'G', 'A', 'D' ou 'F'
- `year_manufacture`: Deve estar entre 1900 e o ano atual + 1
- `brand` e `model`: Obrigatórios na criação

## 🐛 Tratamento de Erros

A API retorna os seguintes códigos de status:

- `200` - Sucesso
- `201` - Criado com sucesso
- `204` - Deletado com sucesso
- `400` - Dados inválidos
- `404` - Recurso não encontrado
- `409` - Conflito (duplicata)
- `500` - Erro interno do servidor

