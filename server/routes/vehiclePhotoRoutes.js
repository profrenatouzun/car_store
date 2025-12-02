import express from 'express';
import vehiclePhotoController from '../controllers/vehiclePhotoController.js';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/vehicles/{id}/photos:
 *   get:
 *     summary: Lista todas as fotos de um veículo
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
 *         description: Lista de fotos do veículo
 *       404:
 *         description: Veículo não encontrado
 */
router.get('/', vehiclePhotoController.getByVehicleId.bind(vehiclePhotoController));

/**
 * @swagger
 * /api/vehicles/{id}/photos:
 *   post:
 *     summary: Adiciona uma foto a um veículo
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
 *             type: object
 *             required:
 *               - photo_url
 *             properties:
 *               photo_url:
 *                 type: string
 *                 format: uri
 *                 description: URL da foto
 *     responses:
 *       201:
 *         description: Foto adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Veículo não encontrado
 */
router.post('/', vehiclePhotoController.addPhoto.bind(vehiclePhotoController));

/**
 * @swagger
 * /api/vehicles/{id}/photos/{photoId}:
 *   delete:
 *     summary: Remove uma foto de um veículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da foto
 *     responses:
 *       204:
 *         description: Foto removida com sucesso
 *       404:
 *         description: Foto ou veículo não encontrado
 */
router.delete('/:photoId', vehiclePhotoController.deletePhoto.bind(vehiclePhotoController));

export default router;

