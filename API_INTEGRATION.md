# Integração com API

O frontend React agora está integrado com a API Node.js/Express.

## Configuração

### 1. Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto com a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

**Importante:** Se você não criar o arquivo `.env`, o frontend usará `http://localhost:3000/api` como padrão.

### 2. Iniciar a API

Certifique-se de que a API está rodando:

```bash
cd server
npm install
npm run dev
```

A API estará disponível em `http://localhost:3000`

### 3. Iniciar o Frontend

Em outro terminal:

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:8080` (ou a porta configurada no Vite)

## Estrutura da Integração

### Serviços (`src/services/api.ts`)
- Cliente HTTP para comunicação com a API
- Métodos para buscar veículos, marcas, modelos, etc.

### Hooks (`src/hooks/useVehicles.ts`)
- Hooks React Query para gerenciar estado e cache
- `useVehicles()` - Lista veículos com filtros
- `useVehicle(id)` - Busca um veículo específico
- `useBrands()` - Lista marcas
- `useFuelTypes()` - Lista tipos de combustível

### Tipos (`src/types/vehicle.ts`)
- Interfaces TypeScript compartilhadas
- Labels de tipos de combustível

## Funcionalidades

### Página Principal (`Index.tsx`)
- ✅ Carrega veículos da API
- ✅ Filtros aplicados na API (marca, combustível, preço, ano)
- ✅ Busca por texto no frontend
- ✅ Estados de loading e erro

### Detalhes do Veículo (`VehicleDetails.tsx`)
- ✅ Carrega dados do veículo da API
- ✅ Estados de loading e erro

### Filtros (`FilterSidebar.tsx`)
- ✅ Carrega marcas da API
- ✅ Carrega tipos de combustível da API

## Troubleshooting

### Erro: "Failed to fetch"
- Verifique se a API está rodando na porta 3000
- Verifique se a URL no `.env` está correta
- Verifique se há problemas de CORS (a API já está configurada com CORS)

### Erro: "Network Error"
- Verifique se a API está acessível
- Verifique o console do navegador para mais detalhes

### Dados não aparecem
- Verifique se o banco de dados tem dados
- Execute os scripts SQL em `scripts/`
- Verifique os logs da API no terminal


