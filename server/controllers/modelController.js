import modelRepository from '../repositories/modelRepository.js';

class ModelController {
  async getAll(req, res) {
    try {
      const brandId = req.query.brand_id ? parseInt(req.query.brand_id) : null;
      const models = await modelRepository.findAll(brandId);
      res.json(models);
    } catch (error) {
      console.error('Error getting models:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const model = await modelRepository.findById(id);

      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      res.json(model);
    } catch (error) {
      console.error('Error getting model:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { brand_id, name } = req.body;
      
      if (!brand_id || !name) {
        return res.status(400).json({ error: 'brand_id and name are required' });
      }

      const model = await modelRepository.create(brand_id, name);
      res.status(201).json(model);
    } catch (error) {
      console.error('Error creating model:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Model already exists for this brand' });
      }

      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid brand_id' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { brand_id, name } = req.body;

      if (!brand_id || !name) {
        return res.status(400).json({ error: 'brand_id and name are required' });
      }

      const model = await modelRepository.update(id, brand_id, name);

      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      res.json(model);
    } catch (error) {
      console.error('Error updating model:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Model already exists for this brand' });
      }

      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid brand_id' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await modelRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Model not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting model:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ModelController();


