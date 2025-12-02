import pool from '../config/database.js';

class FuelTypeRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM fuel_type ORDER BY fuel_type');
    return result.rows;
  }

  async findByCode(code) {
    const result = await pool.query('SELECT * FROM fuel_type WHERE fuel_type = $1', [code]);
    return result.rows[0] || null;
  }
}

export default new FuelTypeRepository();


