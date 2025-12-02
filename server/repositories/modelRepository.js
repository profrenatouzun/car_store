import pool from '../config/database.js';

class ModelRepository {
  async findAll(brandId = null) {
    let query = `
      SELECT 
        m.model_id,
        m.name,
        m.brand_id,
        b.name as brand_name
      FROM model m
      INNER JOIN brand b ON m.brand_id = b.brand_id
    `;
    
    const params = [];
    if (brandId) {
      query += ' WHERE m.brand_id = $1';
      params.push(brandId);
    }
    
    query += ' ORDER BY b.name, m.name';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT 
        m.model_id,
        m.name,
        m.brand_id,
        b.name as brand_name
      FROM model m
      INNER JOIN brand b ON m.brand_id = b.brand_id
      WHERE m.model_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(brandId, name) {
    const result = await pool.query(
      'INSERT INTO model (brand_id, name) VALUES ($1, $2) RETURNING *',
      [brandId, name]
    );
    return result.rows[0];
  }

  async update(id, brandId, name) {
    const result = await pool.query(
      'UPDATE model SET brand_id = $1, name = $2 WHERE model_id = $3 RETURNING *',
      [brandId, name, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM model WHERE model_id = $1 RETURNING model_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new ModelRepository();


