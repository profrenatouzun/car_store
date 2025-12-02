import express from 'express';
import vehicleController from '../controllers/vehicleController.js';
import vehiclePhotoRoutes from './vehiclePhotoRoutes.js';

const router = express.Router();

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Lista todos os veículos
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filtrar por modelo
 *       - in: query
 *         name: fuel_type
 *         schema:
 *           type: string
 *           enum: [G, A, D, F]
 *         description: Filtrar por tipo de combustível
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: min_year
 *         schema:
 *           type: integer
 *         description: Ano mínimo
 *       - in: query
 *         name: max_year
 *         schema:
 *           type: integer
 *         description: Ano máximo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset para paginação
 *     responses:
 *       200:
 *         description: Lista de veículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get('/', vehicleController.getAll.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Busca um veículo por ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Veículo não encontrado
 */
router.get('/:id', vehicleController.getById.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Cria um novo veículo
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Conflito (duplicata)
 */
router.post('/', vehicleController.create.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Atualiza um veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Veículo não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', vehicleController.update.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Deleta um veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *     responses:
 *       204:
 *         description: Veículo deletado com sucesso
 *       404:
 *         description: Veículo não encontrado
 */
router.delete('/:id', vehicleController.delete.bind(vehicleController));

// Rotas de fotos dos veículos (aninhadas)
router.use('/:id/photos', vehiclePhotoRoutes);

export default router;

