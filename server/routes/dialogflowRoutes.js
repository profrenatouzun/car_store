import express from 'express';
import dialogflowController from '../controllers/dialogflowController.js';

const router = express.Router();

/**
 * @swagger
 * /api/dialogflow/webhook:
 *   post:
 *     summary: DialogFlow Webhook Endpoint
 *     description: Receives webhook requests from Google DialogFlow and returns formatted responses
 *     tags: [DialogFlow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               queryResult:
 *                 type: object
 *                 properties:
 *                   intent:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                         example: "search.vehicles"
 *                   parameters:
 *                     type: object
 *                     example: { "brand": "Fiat", "max_price": 20000 }
 *     responses:
 *       200:
 *         description: DialogFlow formatted response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fulfillmentText:
 *                   type: string
 *                   example: "Encontrei 5 veículos da marca Fiat"
 *                 fulfillmentMessages:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post('/webhook', dialogflowController.webhook.bind(dialogflowController));

/**
 * @swagger
 * /api/dialogflow/test:
 *   get:
 *     summary: Test DialogFlow Webhook
 *     description: Verifies that the DialogFlow webhook endpoint is working correctly
 *     tags: [DialogFlow]
 *     responses:
 *       200:
 *         description: Webhook is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 message:
 *                   type: string
 *                   example: "DialogFlow webhook está funcionando!"
 */
router.get('/test', dialogflowController.test.bind(dialogflowController));

export default router;
