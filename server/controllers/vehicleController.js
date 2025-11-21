import vehicleRepository from '../repositories/vehicleRepository.js';

class VehicleController {
  async getAll(req, res) {
    try {
      const filters = {
        brand: req.query.brand,
        model: req.query.model,
        fuel_type: req.query.fuel_type,
        min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
        min_year: req.query.min_year ? parseInt(req.query.min_year) : undefined,
        max_year: req.query.max_year ? parseInt(req.query.max_year) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined,
      };

      const vehicles = await vehicleRepository.findAll(filters);
      res.json(vehicles);
    } catch (error) {
      console.error('Error getting vehicles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await vehicleRepository.findById(id);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.json(vehicle);
    } catch (error) {
      console.error('Error getting vehicle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const vehicle = await vehicleRepository.create(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Duplicate entry' });
      }
      
      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid foreign key reference' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await vehicleRepository.update(id, req.body);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.json(vehicle);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Duplicate entry' });
      }
      
      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid foreign key reference' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await vehicleRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new VehicleController();

