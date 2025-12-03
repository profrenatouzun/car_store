import vehicleRepository from '../repositories/vehicleRepository.js';
import brandRepository from '../repositories/brandRepository.js';
import modelRepository from '../repositories/modelRepository.js';
import {
    formatVehicleResponse,
    formatVehiclesListResponse,
    formatBrandsResponse,
    formatModelsResponse,
    formatErrorResponse,
    formatPriceRangeResponse,
    createQuickRepliesResponse
} from '../utils/dialogflowFormatter.js';

/**
 * DialogFlow Webhook Controller
 * Handles incoming webhook requests from Google DialogFlow
 */
class DialogFlowController {
    /**
     * Main webhook handler
     * Processes DialogFlow webhook requests and routes to appropriate handler
     */
    async webhook(req, res) {
        try {
            const { queryResult } = req.body;

            if (!queryResult) {
                return res.json(formatErrorResponse('Invalid webhook request'));
            }

            const intent = queryResult.intent?.displayName;
            const parameters = queryResult.parameters || {};

            console.log('DialogFlow Intent:', intent);
            console.log('Parameters:', parameters);

            let response;

            // Route to appropriate handler based on intent
            switch (intent) {
                case 'search.vehicles':
                case 'buscar.veiculos':
                    response = await this.searchVehicles(parameters);
                    break;

                case 'get.vehicle':
                case 'ver.veiculo':
                    response = await this.getVehicle(parameters);
                    break;

                case 'list.brands':
                case 'listar.marcas':
                    response = await this.listBrands(parameters);
                    break;

                case 'list.models':
                case 'listar.modelos':
                    response = await this.listModels(parameters);
                    break;

                case 'get.price.range':
                case 'faixa.preco':
                    response = await this.getPriceRange(parameters);
                    break;

                case 'welcome':
                case 'boas-vindas':
                    response = this.welcome();
                    break;

                case 'help':
                case 'ajuda':
                    response = this.help();
                    break;

                default:
                    response = formatErrorResponse(
                        'Desculpe, não entendi o que você precisa. Você pode pedir para ver veículos, marcas ou modelos disponíveis.'
                    );
            }

            res.json(response);
        } catch (error) {
            console.error('DialogFlow webhook error:', error);
            res.json(formatErrorResponse('Ocorreu um erro ao processar sua solicitação.'));
        }
    }

    /**
     * Search vehicles based on parameters
     */
    async searchVehicles(parameters) {
        try {
            const filters = {
                brand: parameters.brand || parameters.marca,
                model: parameters.model || parameters.modelo,
                fuel_type: parameters.fuel_type || parameters.combustivel,
                min_price: parameters.min_price || parameters.preco_minimo,
                max_price: parameters.max_price || parameters.preco_maximo,
                min_year: parameters.min_year || parameters.ano_minimo,
                max_year: parameters.max_year || parameters.ano_maximo,
                limit: 10 // Limit results for better user experience
            };

            // Remove undefined values
            Object.keys(filters).forEach(key =>
                filters[key] === undefined && delete filters[key]
            );

            const vehicles = await vehicleRepository.findAll(filters);
            return formatVehiclesListResponse(vehicles, filters);
        } catch (error) {
            console.error('Error searching vehicles:', error);
            return formatErrorResponse('Não consegui buscar os veículos. Por favor, tente novamente.');
        }
    }

    /**
     * Get a specific vehicle by ID
     */
    async getVehicle(parameters) {
        try {
            const vehicleId = parameters.vehicle_id || parameters.id;

            if (!vehicleId) {
                return formatErrorResponse('Por favor, informe o ID do veículo que deseja ver.');
            }

            const vehicle = await vehicleRepository.findById(parseInt(vehicleId));
            return formatVehicleResponse(vehicle);
        } catch (error) {
            console.error('Error getting vehicle:', error);
            return formatErrorResponse('Não consegui encontrar este veículo.');
        }
    }

    /**
     * List all available brands
     */
    async listBrands(parameters) {
        try {
            const brands = await brandRepository.findAll();
            return formatBrandsResponse(brands);
        } catch (error) {
            console.error('Error listing brands:', error);
            return formatErrorResponse('Não consegui listar as marcas. Por favor, tente novamente.');
        }
    }

    /**
   * List models, optionally filtered by brand
   */
    async listModels(parameters) {
        try {
            const brandName = parameters.brand || parameters.marca;
            let brandId = null;

            // If brand name is provided, find the brand ID
            if (brandName) {
                const brand = await brandRepository.findByName(brandName);
                if (brand) {
                    brandId = brand.brand_id;
                }
            }

            const models = await modelRepository.findAll(brandId);
            return formatModelsResponse(models, brandName);
        } catch (error) {
            console.error('Error listing models:', error);
            return formatErrorResponse('Não consegui listar os modelos. Por favor, tente novamente.');
        }
    }

    /**
     * Get price range information
     */
    async getPriceRange(parameters) {
        try {
            const brand = parameters.brand || parameters.marca;
            const filters = brand ? { brand } : {};

            const vehicles = await vehicleRepository.findAll(filters);

            if (vehicles.length === 0) {
                return formatErrorResponse('Não há veículos disponíveis para calcular a faixa de preço.');
            }

            const prices = vehicles
                .map(v => v.ad_price)
                .filter(p => p != null);

            const range = {
                min: Math.min(...prices),
                max: Math.max(...prices)
            };

            return formatPriceRangeResponse(range);
        } catch (error) {
            console.error('Error getting price range:', error);
            return formatErrorResponse('Não consegui obter a faixa de preços.');
        }
    }

    /**
     * Welcome message
     */
    welcome() {
        const suggestions = [
            'Ver veículos disponíveis',
            'Buscar por marca',
            'Ver marcas disponíveis',
            'Ajuda'
        ];

        return createQuickRepliesResponse(
            '👋 Olá! Bem-vindo à Car Store! Posso ajudá-lo a encontrar o veículo ideal. O que você gostaria de fazer?',
            suggestions
        );
    }

    /**
     * Help message
     */
    help() {
        const suggestions = [
            'Ver veículos',
            'Buscar Fiat',
            'Ver marcas',
            'Faixa de preço'
        ];

        const helpText = `Posso ajudá-lo com:

✅ Buscar veículos por marca, modelo, preço ou ano
✅ Ver detalhes de um veículo específico
✅ Listar marcas disponíveis
✅ Listar modelos de uma marca
✅ Ver faixa de preços

Exemplos do que você pode perguntar:
• "Mostrar veículos da Fiat"
• "Veículos até 20 mil"
• "Quais marcas vocês têm?"
• "Modelos da Volkswagen"`;

        return createQuickRepliesResponse(helpText, suggestions);
    }

    /**
     * Test endpoint to verify webhook is working
     */
    async test(req, res) {
        try {
            res.json({
                status: 'ok',
                message: 'DialogFlow webhook está funcionando!',
                timestamp: new Date().toISOString(),
                endpoints: {
                    webhook: '/api/dialogflow/webhook'
                }
            });
        } catch (error) {
            console.error('Test endpoint error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new DialogFlowController();
