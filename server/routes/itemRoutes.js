import express from 'express';
import itemController from '../controllers/itemController.js';

const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Lista todos os itens/acessórios
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get('/', itemController.getAll.bind(itemController));

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Busca um item por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item não encontrado
 */
router.get('/:id', itemController.getById.bind(itemController));

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Cria um novo item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Item já existe
 */
router.post('/', itemController.create.bind(itemController));

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Atualiza um item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.put('/:id', itemController.update.bind(itemController));

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Deleta um item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     responses:
 *       204:
 *         description: Item deletado com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.delete('/:id', itemController.delete.bind(itemController));

export default router;


