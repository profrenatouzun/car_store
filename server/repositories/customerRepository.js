import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class CustomerRepository {
  async findAll() {
    const result = await pool.query('SELECT customer_id, full_name, phone, email, created_at FROM customers ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT customer_id, full_name, phone, email, created_at FROM customers WHERE customer_id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT customer_id, full_name, phone, email, password, created_at FROM customers WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async create(customerData) {
    let hashedPassword = null;
    if (customerData.password) {
      hashedPassword = await bcrypt.hash(customerData.password, 10);
    }

    const result = await pool.query(
      'INSERT INTO customers (full_name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING customer_id, full_name, phone, email, created_at',
      [customerData.full_name, customerData.phone || null, customerData.email || null, hashedPassword]
    );
    return result.rows[0];
  }

  async update(id, customerData) {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (customerData.full_name !== undefined) {
      updateFields.push(`full_name = $${paramCount++}`);
      updateValues.push(customerData.full_name);
    }

    if (customerData.phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      updateValues.push(customerData.phone);
    }

    if (customerData.email !== undefined) {
      updateFields.push(`email = $${paramCount++}`);
      updateValues.push(customerData.email);
    }

    if (updateFields.length === 0) {
      return await this.findById(id);
    }

    updateValues.push(id);
    const result = await pool.query(
      `UPDATE customers SET ${updateFields.join(', ')} WHERE customer_id = $${paramCount} RETURNING customer_id, full_name, phone, email, created_at`,
      updateValues
    );
    return result.rows[0] || null;
  }

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE customers SET password = $1 WHERE customer_id = $2 RETURNING customer_id, full_name, phone, email, created_at',
      [hashedPassword, id]
    );
    return result.rows[0] || null;
  }

  async verifyPassword(email, password) {
    const customer = await this.findByEmail(email);
    if (!customer || !customer.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return null;
    }

    // Retornar sem a senha
    const { password: _, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new CustomerRepository();


