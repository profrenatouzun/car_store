import swaggerJsdoc from 'swagger-jsdoc';

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
      },
    },
    tags: [
      {
        name: 'Vehicles',
        description: 'Operações relacionadas a veículos',
      },
    ],
  },
  apis: ['./server/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

