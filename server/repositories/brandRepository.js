import pool from '../config/database.js';

class BrandRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM brand ORDER BY name');
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM brand WHERE brand_id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByName(name) {
    const result = await pool.query('SELECT * FROM brand WHERE name = $1', [name]);
    return result.rows[0] || null;
  }

  async create(name) {
    const result = await pool.query(
      'INSERT INTO brand (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  async update(id, name) {
    const result = await pool.query(
      'UPDATE brand SET name = $1 WHERE brand_id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM brand WHERE brand_id = $1 RETURNING brand_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new BrandRepository();


