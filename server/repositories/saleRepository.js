import pool from '../config/database.js';

class SaleRepository {
  async findAll(filters = {}) {
    let query = `
      SELECT 
        s.sale_id,
        s.sale_price,
        s.sale_date,
        v.vehicle_id,
        b.name as brand,
        m.name as model,
        v.year_manufacture,
        c.customer_id,
        c.full_name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email
      FROM sales s
      INNER JOIN vehicles v ON s.vehicle_id = v.vehicle_id
      INNER JOIN brand b ON v.brand_id = b.brand_id
      INNER JOIN model m ON v.model_id = m.model_id
      INNER JOIN customers c ON s.customer_id = c.customer_id
    `;

    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (filters.customer_id) {
      conditions.push(`s.customer_id = $${paramCount++}`);
      params.push(filters.customer_id);
    }

    if (filters.vehicle_id) {
      conditions.push(`s.vehicle_id = $${paramCount++}`);
      params.push(filters.vehicle_id);
    }

    if (filters.start_date) {
      conditions.push(`s.sale_date >= $${paramCount++}`);
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      conditions.push(`s.sale_date <= $${paramCount++}`);
      params.push(filters.end_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY s.sale_date DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT 
        s.sale_id,
        s.sale_price,
        s.sale_date,
        v.vehicle_id,
        b.name as brand,
        m.name as model,
        v.year_manufacture,
        c.customer_id,
        c.full_name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email
      FROM sales s
      INNER JOIN vehicles v ON s.vehicle_id = v.vehicle_id
      INNER JOIN brand b ON v.brand_id = b.brand_id
      INNER JOIN model m ON v.model_id = m.model_id
      INNER JOIN customers c ON s.customer_id = c.customer_id
      WHERE s.sale_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(saleData) {
    const result = await pool.query(
      'INSERT INTO sales (vehicle_id, customer_id, sale_price, sale_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        saleData.vehicle_id,
        saleData.customer_id,
        saleData.sale_price,
        saleData.sale_date || new Date().toISOString().split('T')[0],
      ]
    );
    return await this.findById(result.rows[0].sale_id);
  }

  async update(id, saleData) {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (saleData.vehicle_id !== undefined) {
      updateFields.push(`vehicle_id = $${paramCount++}`);
      updateValues.push(saleData.vehicle_id);
    }

    if (saleData.customer_id !== undefined) {
      updateFields.push(`customer_id = $${paramCount++}`);
      updateValues.push(saleData.customer_id);
    }

    if (saleData.sale_price !== undefined) {
      updateFields.push(`sale_price = $${paramCount++}`);
      updateValues.push(saleData.sale_price);
    }

    if (saleData.sale_date !== undefined) {
      updateFields.push(`sale_date = $${paramCount++}`);
      updateValues.push(saleData.sale_date);
    }

    if (updateFields.length === 0) {
      return await this.findById(id);
    }

    updateValues.push(id);
    await pool.query(
      `UPDATE sales SET ${updateFields.join(', ')} WHERE sale_id = $${paramCount}`,
      updateValues
    );
    return await this.findById(id);
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM sales WHERE sale_id = $1 RETURNING sale_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new SaleRepository();


