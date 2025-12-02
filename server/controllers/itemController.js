import itemRepository from '../repositories/itemRepository.js';

class ItemController {
  async getAll(req, res) {
    try {
      const items = await itemRepository.findAll();
      res.json(items);
    } catch (error) {
      console.error('Error getting items:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const item = await itemRepository.findById(id);

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error getting item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { item_name } = req.body;
      
      if (!item_name) {
        return res.status(400).json({ error: 'item_name is required' });
      }

      const item = await itemRepository.create(item_name);
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating item:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Item already exists' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { item_name } = req.body;

      if (!item_name) {
        return res.status(400).json({ error: 'item_name is required' });
      }

      const item = await itemRepository.update(id, item_name);

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error updating item:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Item already exists' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await itemRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ItemController();


