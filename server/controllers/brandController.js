import brandRepository from '../repositories/brandRepository.js';

class BrandController {
  async getAll(req, res) {
    try {
      const brands = await brandRepository.findAll();
      res.json(brands);
    } catch (error) {
      console.error('Error getting brands:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const brand = await brandRepository.findById(id);

      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      res.json(brand);
    } catch (error) {
      console.error('Error getting brand:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const brand = await brandRepository.create(name);
      res.status(201).json(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Brand already exists' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const brand = await brandRepository.update(id, name);

      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      res.json(brand);
    } catch (error) {
      console.error('Error updating brand:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Brand already exists' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await brandRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting brand:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new BrandController();


