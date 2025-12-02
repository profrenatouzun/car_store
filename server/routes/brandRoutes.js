import express from 'express';
import brandController from '../controllers/brandController.js';

const router = express.Router();

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Lista todas as marcas
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */
router.get('/', brandController.getAll.bind(brandController));

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Busca uma marca por ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Marca não encontrada
 */
router.get('/:id', brandController.getById.bind(brandController));

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Cria uma nova marca
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       201:
 *         description: Marca criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Marca já existe
 */
router.post('/', brandController.create.bind(brandController));

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Atualiza uma marca
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrandInput'
 *     responses:
 *       200:
 *         description: Marca atualizada com sucesso
 *       404:
 *         description: Marca não encontrada
 *       409:
 *         description: Marca já existe
 */
router.put('/:id', brandController.update.bind(brandController));

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Deleta uma marca
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da marca
 *     responses:
 *       204:
 *         description: Marca deletada com sucesso
 *       404:
 *         description: Marca não encontrada
 */
router.delete('/:id', brandController.delete.bind(brandController));

export default router;


