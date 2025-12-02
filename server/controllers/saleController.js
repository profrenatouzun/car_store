import saleRepository from '../repositories/saleRepository.js';

class SaleController {
  async getAll(req, res) {
    try {
      const filters = {
        customer_id: req.query.customer_id ? parseInt(req.query.customer_id) : undefined,
        vehicle_id: req.query.vehicle_id ? parseInt(req.query.vehicle_id) : undefined,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined,
      };

      const sales = await saleRepository.findAll(filters);
      res.json(sales);
    } catch (error) {
      console.error('Error getting sales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const sale = await saleRepository.findById(id);

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      res.json(sale);
    } catch (error) {
      console.error('Error getting sale:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { vehicle_id, customer_id, sale_price, sale_date } = req.body;
      
      if (!vehicle_id || !customer_id || !sale_price) {
        return res.status(400).json({ 
          error: 'vehicle_id, customer_id, and sale_price are required' 
        });
      }

      const sale = await saleRepository.create({
        vehicle_id,
        customer_id,
        sale_price,
        sale_date,
      });
      res.status(201).json(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      
      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid vehicle_id or customer_id' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const sale = await saleRepository.update(id, req.body);

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      res.json(sale);
    } catch (error) {
      console.error('Error updating sale:', error);
      
      if (error.code === '23503') {
        return res.status(400).json({ error: 'Invalid vehicle_id or customer_id' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await saleRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting sale:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SaleController();


