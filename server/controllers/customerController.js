import customerRepository from '../repositories/customerRepository.js';

class CustomerController {
  async getAll(req, res) {
    try {
      const customers = await customerRepository.findAll();
      res.json(customers);
    } catch (error) {
      console.error('Error getting customers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const customer = await customerRepository.findById(id);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(customer);
    } catch (error) {
      console.error('Error getting customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { full_name, phone, email, password } = req.body;
      
      if (!full_name) {
        return res.status(400).json({ error: 'full_name is required' });
      }

      const customer = await customerRepository.create({ full_name, phone, email, password });
      res.status(201).json(customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const customer = await customerRepository.update(id, req.body);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(customer);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await customerRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const customer = await customerRepository.verifyPassword(email, password);

      if (!customer) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.json({
        customer: {
          id: customer.customer_id,
          name: customer.full_name,
          email: customer.email,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async changePassword(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      // Verificar senha atual
      const customer = await customerRepository.findById(id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const customerWithPassword = await customerRepository.findByEmail(customer.email);
      const isValidPassword = await customerRepository.verifyPassword(
        customer.email,
        currentPassword
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Atualizar senha
      const updatedCustomer = await customerRepository.updatePassword(id, newPassword);

      if (!updatedCustomer) {
        return res.status(500).json({ error: 'Failed to update password' });
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CustomerController();


