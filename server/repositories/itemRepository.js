import pool from '../config/database.js';

class ItemRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM items ORDER BY item_name');
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM items WHERE item_id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByName(name) {
    const result = await pool.query('SELECT * FROM items WHERE item_name = $1', [name]);
    return result.rows[0] || null;
  }

  async create(name) {
    const result = await pool.query(
      'INSERT INTO items (item_name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  async update(id, name) {
    const result = await pool.query(
      'UPDATE items SET item_name = $1 WHERE item_id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM items WHERE item_id = $1 RETURNING item_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new ItemRepository();


