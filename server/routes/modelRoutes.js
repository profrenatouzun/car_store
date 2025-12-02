import express from 'express';
import modelController from '../controllers/modelController.js';

const router = express.Router();

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: Lista todos os modelos
 *     tags: [Models]
 *     parameters:
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da marca
 *     responses:
 *       200:
 *         description: Lista de modelos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 */
router.get('/', modelController.getAll.bind(modelController));

/**
 * @swagger
 * /api/models/{id}:
 *   get:
 *     summary: Busca um modelo por ID
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo
 *     responses:
 *       200:
 *         description: Modelo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Model'
 *       404:
 *         description: Modelo não encontrado
 */
router.get('/:id', modelController.getById.bind(modelController));

/**
 * @swagger
 * /api/models:
 *   post:
 *     summary: Cria um novo modelo
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModelInput'
 *     responses:
 *       201:
 *         description: Modelo criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Modelo já existe para esta marca
 */
router.post('/', modelController.create.bind(modelController));

/**
 * @swagger
 * /api/models/{id}:
 *   put:
 *     summary: Atualiza um modelo
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModelInput'
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 *       404:
 *         description: Modelo não encontrado
 */
router.put('/:id', modelController.update.bind(modelController));

/**
 * @swagger
 * /api/models/{id}:
 *   delete:
 *     summary: Deleta um modelo
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do modelo
 *     responses:
 *       204:
 *         description: Modelo deletado com sucesso
 *       404:
 *         description: Modelo não encontrado
 */
router.delete('/:id', modelController.delete.bind(modelController));

export default router;


