import express from 'express';
import fuelTypeController from '../controllers/fuelTypeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/fuel-types:
 *   get:
 *     summary: Lista todos os tipos de combustível
 *     tags: [FuelTypes]
 *     responses:
 *       200:
 *         description: Lista de tipos de combustível
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuelType'
 */
router.get('/', fuelTypeController.getAll.bind(fuelTypeController));

/**
 * @swagger
 * /api/fuel-types/{code}:
 *   get:
 *     summary: Busca um tipo de combustível por código
 *     tags: [FuelTypes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           enum: [G, A, D, F]
 *         description: Código do tipo de combustível
 *     responses:
 *       200:
 *         description: Tipo de combustível encontrado
 *       404:
 *         description: Tipo de combustível não encontrado
 */
router.get('/:code', fuelTypeController.getByCode.bind(fuelTypeController));

export default router;


