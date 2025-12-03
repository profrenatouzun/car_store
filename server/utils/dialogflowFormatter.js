/**
 * DialogFlow Formatter Utility
 * Converts standard API responses to DialogFlow webhook format (ES - Essentials)
 */

/**
 * Format a single vehicle for DialogFlow response
 * @param {Object} vehicle - Vehicle object from database
 * @returns {string} Formatted text description
 */
function formatVehicleText(vehicle) {
    const price = vehicle.ad_price ? `R$ ${vehicle.ad_price.toLocaleString('pt-BR')}` : 'Preço não disponível';
    const year = vehicle.year_manufacture || 'Ano não informado';
    const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : 'KM não informado';

    let text = `🚗 *${vehicle.brand} ${vehicle.model}* (${year})\n`;
    text += `💰 Preço: ${price}\n`;
    text += `📏 Quilometragem: ${mileage}\n`;

    if (vehicle.fuel_type) {
        const fuelTypes = {
            'G': 'Gasolina',
            'A': 'Álcool',
            'D': 'Diesel',
            'F': 'Flex'
        };
        text += `⛽ Combustível: ${fuelTypes[vehicle.fuel_type] || vehicle.fuel_type}\n`;
    }

    if (vehicle.simple_description) {
        text += `\n📝 ${vehicle.simple_description}`;
    }

    return text;
}

/**
 * Create a basic text response for DialogFlow
 * @param {string} text - Text to send
 * @returns {Object} DialogFlow response object
 */
function createTextResponse(text) {
    return {
        fulfillmentText: text,
        fulfillmentMessages: [
            {
                text: {
                    text: [text]
                }
            }
        ]
    };
}

/**
 * Create a rich card response for a vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {Object} DialogFlow card message
 */
function createVehicleCard(vehicle) {
    const price = vehicle.ad_price ? `R$ ${vehicle.ad_price.toLocaleString('pt-BR')}` : 'Preço não disponível';
    const year = vehicle.year_manufacture || 'N/A';
    const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : 'N/A';

    const fuelTypes = {
        'G': 'Gasolina',
        'A': 'Álcool',
        'D': 'Diesel',
        'F': 'Flex'
    };
    const fuel = fuelTypes[vehicle.fuel_type] || vehicle.fuel_type || 'N/A';

    // Get first photo if available
    const imageUrl = vehicle.photos && vehicle.photos.length > 0
        ? vehicle.photos[0]
        : null;

    const card = {
        card: {
            title: `${vehicle.brand} ${vehicle.model} (${year})`,
            subtitle: `${price} | ${mileage} | ${fuel}`,
            imageUri: imageUrl,
            buttons: []
        }
    };

    // Add button if vehicle has an ID
    if (vehicle.id) {
        card.card.buttons.push({
            text: 'Ver detalhes',
            postback: `Ver veículo ${vehicle.id}`
        });
    }

    return card;
}

/**
 * Format a single vehicle response
 * @param {Object} vehicle - Vehicle object
 * @param {boolean} includeCard - Whether to include rich card
 * @returns {Object} DialogFlow response
 */
function formatVehicleResponse(vehicle, includeCard = true) {
    if (!vehicle) {
        return createTextResponse('Desculpe, não encontrei este veículo.');
    }

    const text = formatVehicleText(vehicle);
    const response = {
        fulfillmentText: text,
        fulfillmentMessages: [
            {
                text: {
                    text: [text]
                }
            }
        ]
    };

    // Add card for rich platforms
    if (includeCard) {
        response.fulfillmentMessages.push(createVehicleCard(vehicle));
    }

    return response;
}

/**
 * Format a list of vehicles response
 * @param {Array} vehicles - Array of vehicle objects
 * @param {Object} filters - Applied filters
 * @returns {Object} DialogFlow response
 */
function formatVehiclesListResponse(vehicles, filters = {}) {
    if (!vehicles || vehicles.length === 0) {
        let message = 'Não encontrei veículos';

        if (filters.brand) {
            message += ` da marca ${filters.brand}`;
        }
        if (filters.model) {
            message += ` modelo ${filters.model}`;
        }
        if (filters.min_price || filters.max_price) {
            message += ' na faixa de preço especificada';
        }

        message += '. Que tal tentar outros filtros?';
        return createTextResponse(message);
    }

    const count = vehicles.length;
    let text = `Encontrei ${count} veículo${count > 1 ? 's' : ''}`;

    if (filters.brand) {
        text += ` da marca ${filters.brand}`;
    }
    if (filters.model) {
        text += ` modelo ${filters.model}`;
    }

    text += ':\n\n';

    // Show up to 5 vehicles in text
    const displayLimit = Math.min(5, vehicles.length);
    for (let i = 0; i < displayLimit; i++) {
        const v = vehicles[i];
        const price = v.ad_price ? `R$ ${v.ad_price.toLocaleString('pt-BR')}` : 'Preço sob consulta';
        text += `${i + 1}. ${v.brand} ${v.model} (${v.year_manufacture}) - ${price}\n`;
    }

    if (vehicles.length > displayLimit) {
        text += `\n...e mais ${vehicles.length - displayLimit} veículo${vehicles.length - displayLimit > 1 ? 's' : ''}.`;
    }

    const response = {
        fulfillmentText: text,
        fulfillmentMessages: [
            {
                text: {
                    text: [text]
                }
            }
        ]
    };

    // Add cards for first 3 vehicles
    const cardLimit = Math.min(3, vehicles.length);
    for (let i = 0; i < cardLimit; i++) {
        response.fulfillmentMessages.push(createVehicleCard(vehicles[i]));
    }

    return response;
}

/**
 * Format brands list response
 * @param {Array} brands - Array of brand objects
 * @returns {Object} DialogFlow response
 */
function formatBrandsResponse(brands) {
    if (!brands || brands.length === 0) {
        return createTextResponse('Não há marcas disponíveis no momento.');
    }

    let text = `Temos veículos das seguintes marcas:\n\n`;
    brands.forEach((brand, index) => {
        text += `${index + 1}. ${brand.name}\n`;
    });

    text += '\nQual marca você prefere?';

    return createTextResponse(text);
}

/**
 * Format models list response
 * @param {Array} models - Array of model objects
 * @param {string} brand - Brand name
 * @returns {Object} DialogFlow response
 */
function formatModelsResponse(models, brand) {
    if (!models || models.length === 0) {
        return createTextResponse(`Não encontrei modelos disponíveis${brand ? ` para ${brand}` : ''}.`);
    }

    let text = `Modelos disponíveis${brand ? ` da ${brand}` : ''}:\n\n`;
    models.forEach((model, index) => {
        text += `${index + 1}. ${model.name}\n`;
    });

    text += '\nQual modelo você está procurando?';

    return createTextResponse(text);
}

/**
 * Format error response
 * @param {string|Error} error - Error message or Error object
 * @returns {Object} DialogFlow response
 */
function formatErrorResponse(error) {
    const message = typeof error === 'string'
        ? error
        : 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';

    return createTextResponse(message);
}

/**
 * Format price range response
 * @param {Object} range - Price range object with min and max
 * @returns {Object} DialogFlow response
 */
function formatPriceRangeResponse(range) {
    if (!range) {
        return createTextResponse('Não consegui obter as informações de preço.');
    }

    const min = range.min ? `R$ ${range.min.toLocaleString('pt-BR')}` : 'N/A';
    const max = range.max ? `R$ ${range.max.toLocaleString('pt-BR')}` : 'N/A';

    const text = `💰 Faixa de preços em nosso estoque:\n\nMenor preço: ${min}\nMaior preço: ${max}`;

    return createTextResponse(text);
}

/**
 * Create a response with quick reply suggestions
 * @param {string} text - Main text
 * @param {Array<string>} suggestions - Array of suggestion texts
 * @returns {Object} DialogFlow response
 */
function createQuickRepliesResponse(text, suggestions) {
    return {
        fulfillmentText: text,
        fulfillmentMessages: [
            {
                text: {
                    text: [text]
                }
            },
            {
                quickReplies: {
                    title: text,
                    quickReplies: suggestions
                }
            }
        ]
    };
}

export {
    formatVehicleResponse,
    formatVehiclesListResponse,
    formatBrandsResponse,
    formatModelsResponse,
    formatErrorResponse,
    formatPriceRangeResponse,
    createTextResponse,
    createQuickRepliesResponse,
    formatVehicleText,
    createVehicleCard
};
