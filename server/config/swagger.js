import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Store API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de veículos - Loja de Carros',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Vehicle: {
          type: 'object',
          properties: {
            vehicle_id: {
              type: 'integer',
              description: 'ID único do veículo',
              example: 1,
            },
            brand: {
              type: 'string',
              description: 'Marca do veículo',
              example: 'Fiat',
            },
            model: {
              type: 'string',
              description: 'Modelo do veículo',
              example: 'Uno Mille',
            },
            year_manufacture: {
              type: 'integer',
              description: 'Ano de fabricação',
              example: 1998,
            },
            fuel_type: {
              type: 'string',
              enum: ['G', 'A', 'D', 'F'],
              description: 'Tipo de combustível (G=Gasolina, A=Álcool, D=Diesel, F=Flex)',
              example: 'G',
            },
            simple_description: {
              type: 'string',
              description: 'Descrição simples do veículo',
              example: 'Lata véia mas tá rodando! Ótimo para o dia a dia.',
            },
            mileage: {
              type: 'integer',
              description: 'Quilometragem do veículo',
              example: 280000,
            },
            ad_price: {
              type: 'number',
              format: 'float',
              description: 'Preço do anúncio',
              example: 8500.00,
            },
            fipe_price: {
              type: 'number',
              format: 'float',
              description: 'Preço FIPE',
              example: 9200.00,
            },
            items: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de itens/acessórios do veículo',
              example: ['Direção mecânica', 'Ar condicionado'],
            },
            photos: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
              description: 'URLs das fotos do veículo',
              example: ['https://example.com/photo1.jpg'],
            },
          },
        },
        VehicleInput: {
          type: 'object',
          required: ['brand', 'model', 'year_manufacture', 'fuel_type'],
          properties: {
            brand: {
              type: 'string',
              description: 'Marca do veículo',
              example: 'Fiat',
            },
            model: {
              type: 'string',
              description: 'Modelo do veículo',
              example: 'Uno Mille',
            },
            year_manufacture: {
              type: 'integer',
              description: 'Ano de fabricação',
              example: 1998,
            },
            fuel_type: {
              type: 'string',
              enum: ['G', 'A', 'D', 'F'],
              description: 'Tipo de combustível (G=Gasolina, A=Álcool, D=Diesel, F=Flex)',
              example: 'G',
            },
            simple_description: {
              type: 'string',
              description: 'Descrição simples do veículo',
              example: 'Lata véia mas tá rodando! Ótimo para o dia a dia.',
            },
            mileage: {
              type: 'integer',
              description: 'Quilometragem do veículo',
              example: 280000,
            },
            ad_price: {
              type: 'number',
              format: 'float',
              description: 'Preço do anúncio',
              example: 8500.00,
            },
            fipe_price: {
              type: 'number',
              format: 'float',
              description: 'Preço FIPE',
              example: 9200.00,
            },
            items: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de itens/acessórios do veículo',
              example: ['Direção mecânica', 'Ar condicionado'],
            },
            photos: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
              description: 'URLs das fotos do veículo',
              example: ['https://example.com/photo1.jpg'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            brand_id: {
              type: 'integer',
              description: 'ID único da marca',
            },
            name: {
              type: 'string',
              description: 'Nome da marca',
              example: 'Fiat',
            },
          },
        },
        BrandInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome da marca',
              example: 'Fiat',
            },
          },
        },
        Model: {
          type: 'object',
          properties: {
            model_id: {
              type: 'integer',
              description: 'ID único do modelo',
            },
            name: {
              type: 'string',
              description: 'Nome do modelo',
              example: 'Uno Mille',
            },
            brand_id: {
              type: 'integer',
              description: 'ID da marca',
            },
            brand_name: {
              type: 'string',
              description: 'Nome da marca',
              example: 'Fiat',
            },
          },
        },
        ModelInput: {
          type: 'object',
          required: ['brand_id', 'name'],
          properties: {
            brand_id: {
              type: 'integer',
              description: 'ID da marca',
            },
            name: {
              type: 'string',
              description: 'Nome do modelo',
              example: 'Uno Mille',
            },
          },
        },
        Item: {
          type: 'object',
          properties: {
            item_id: {
              type: 'integer',
              description: 'ID único do item',
            },
            item_name: {
              type: 'string',
              description: 'Nome do item/acessório',
              example: 'Ar condicionado',
            },
          },
        },
        ItemInput: {
          type: 'object',
          required: ['item_name'],
          properties: {
            item_name: {
              type: 'string',
              description: 'Nome do item/acessório',
              example: 'Ar condicionado',
            },
          },
        },
        FuelType: {
          type: 'object',
          properties: {
            fuel_type: {
              type: 'string',
              enum: ['G', 'A', 'D', 'F'],
              description: 'Código do tipo de combustível',
            },
            description: {
              type: 'string',
              description: 'Descrição do tipo de combustível',
              example: 'Gasolina',
            },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            customer_id: {
              type: 'integer',
              description: 'ID único do cliente',
            },
            full_name: {
              type: 'string',
              description: 'Nome completo do cliente',
            },
            phone: {
              type: 'string',
              description: 'Telefone do cliente',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
        },
        CustomerInput: {
          type: 'object',
          required: ['full_name'],
          properties: {
            full_name: {
              type: 'string',
              description: 'Nome completo do cliente',
            },
            phone: {
              type: 'string',
              description: 'Telefone do cliente',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente',
            },
          },
        },
        Sale: {
          type: 'object',
          properties: {
            sale_id: {
              type: 'integer',
              description: 'ID único da venda',
            },
            vehicle_id: {
              type: 'integer',
              description: 'ID do veículo',
            },
            brand: {
              type: 'string',
              description: 'Marca do veículo',
            },
            model: {
              type: 'string',
              description: 'Modelo do veículo',
            },
            year_manufacture: {
              type: 'integer',
              description: 'Ano de fabricação',
            },
            customer_id: {
              type: 'integer',
              description: 'ID do cliente',
            },
            customer_name: {
              type: 'string',
              description: 'Nome do cliente',
            },
            customer_phone: {
              type: 'string',
              description: 'Telefone do cliente',
            },
            customer_email: {
              type: 'string',
              description: 'Email do cliente',
            },
            sale_price: {
              type: 'number',
              format: 'float',
              description: 'Preço da venda',
            },
            sale_date: {
              type: 'string',
              format: 'date',
              description: 'Data da venda',
            },
          },
        },
        SaleInput: {
          type: 'object',
          required: ['vehicle_id', 'customer_id', 'sale_price'],
          properties: {
            vehicle_id: {
              type: 'integer',
              description: 'ID do veículo',
            },
            customer_id: {
              type: 'integer',
              description: 'ID do cliente',
            },
            sale_price: {
              type: 'number',
              format: 'float',
              description: 'Preço da venda',
            },
            sale_date: {
              type: 'string',
              format: 'date',
              description: 'Data da venda (opcional, padrão: hoje)',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Vehicles',
        description: 'Operações relacionadas a veículos',
      },
      {
        name: 'Brands',
        description: 'Operações relacionadas a marcas',
      },
      {
        name: 'Models',
        description: 'Operações relacionadas a modelos',
      },
      {
        name: 'Items',
        description: 'Operações relacionadas a itens/acessórios',
      },
      {
        name: 'FuelTypes',
        description: 'Operações relacionadas a tipos de combustível',
      },
      {
        name: 'Customers',
        description: 'Operações relacionadas a clientes',
      },
      {
        name: 'Sales',
        description: 'Operações relacionadas a vendas',
      },
    ],
  },
  apis: [
    join(__dirname, '../routes/*.js').replace(/\\/g, '/'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Debug: verificar se as rotas foram encontradas
if (process.env.NODE_ENV !== 'production') {
  const routesPath = join(__dirname, '../routes');
  console.log('📁 Looking for routes in:', routesPath);
  try {
    const files = readdirSync(routesPath);
    console.log('📄 Route files found:', files);
  } catch (err) {
    console.error('❌ Error reading routes directory:', err.message);
  }
  console.log('📝 Swagger paths found:', Object.keys(swaggerSpec.paths || {}));
  if (Object.keys(swaggerSpec.paths || {}).length === 0) {
    console.warn('⚠️  No paths found in Swagger spec! Check if JSDoc comments are correct.');
  }
}

export default swaggerSpec;

