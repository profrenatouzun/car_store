import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Lista todas as vendas
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do cliente
 *       - in: query
 *         name: vehicle_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do veículo
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
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
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 */
router.get('/', saleController.getAll.bind(saleController));

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Busca uma venda por ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda encontrada
 *       404:
 *         description: Venda não encontrada
 */
router.get('/:id', saleController.getById.bind(saleController));

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleInput'
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', saleController.create.bind(saleController));

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Atualiza uma venda
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleInput'
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *       404:
 *         description: Venda não encontrada
 */
router.put('/:id', saleController.update.bind(saleController));

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Deleta uma venda
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       204:
 *         description: Venda deletada com sucesso
 *       404:
 *         description: Venda não encontrada
 */
router.delete('/:id', saleController.delete.bind(saleController));

export default router;


