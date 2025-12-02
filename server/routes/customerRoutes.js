import express from 'express';
import customerController from '../controllers/customerController.js';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/', customerController.getAll.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Busca um cliente por ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', customerController.getById.bind(customerController));

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', customerController.create.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:id', customerController.update.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Deleta um cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id', customerController.delete.bind(customerController));

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     summary: Autentica um cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha inválidos
 */
router.post('/login', customerController.login.bind(customerController));

/**
 * @swagger
 * /api/customers/{id}/change-password:
 *   post:
 *     summary: Altera a senha de um cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Senha atual incorreta
 *       404:
 *         description: Cliente não encontrado
 */
router.post('/:id/change-password', customerController.changePassword.bind(customerController));

export default router;


