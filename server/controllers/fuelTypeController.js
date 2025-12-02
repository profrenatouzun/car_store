import fuelTypeRepository from '../repositories/fuelTypeRepository.js';

class FuelTypeController {
  async getAll(req, res) {
    try {
      const fuelTypes = await fuelTypeRepository.findAll();
      res.json(fuelTypes);
    } catch (error) {
      console.error('Error getting fuel types:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByCode(req, res) {
    try {
      const code = req.params.code.toUpperCase();
      const fuelType = await fuelTypeRepository.findByCode(code);

      if (!fuelType) {
        return res.status(404).json({ error: 'Fuel type not found' });
      }

      res.json(fuelType);
    } catch (error) {
      console.error('Error getting fuel type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new FuelTypeController();


