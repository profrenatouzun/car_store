import vehiclePhotoRepository from '../repositories/vehiclePhotoRepository.js';
import vehicleRepository from '../repositories/vehicleRepository.js';

class VehiclePhotoController {
  async getByVehicleId(req, res) {
    try {
      const vehicleId = parseInt(req.params.id);
      
      // Verificar se o veículo existe
      const vehicle = await vehicleRepository.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const photos = await vehiclePhotoRepository.findByVehicleId(vehicleId);
      res.json(photos);
    } catch (error) {
      console.error('Error getting vehicle photos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addPhoto(req, res) {
    try {
      const vehicleId = parseInt(req.params.id);
      const { photo_url } = req.body;

      if (!photo_url) {
        return res.status(400).json({ error: 'photo_url is required' });
      }

      // Verificar se o veículo existe
      const vehicle = await vehicleRepository.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const photo = await vehiclePhotoRepository.create(vehicleId, photo_url);
      res.status(201).json(photo);
    } catch (error) {
      console.error('Error adding vehicle photo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deletePhoto(req, res) {
    try {
      const vehicleId = parseInt(req.params.id);
      const photoId = parseInt(req.params.photoId);

      // Verificar se a foto existe e pertence ao veículo
      const photo = await vehiclePhotoRepository.findById(photoId);
      if (!photo) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      if (photo.vehicle_id !== vehicleId) {
        return res.status(400).json({ error: 'Photo does not belong to this vehicle' });
      }

      const deleted = await vehiclePhotoRepository.delete(photoId);
      if (!deleted) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting vehicle photo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new VehiclePhotoController();

