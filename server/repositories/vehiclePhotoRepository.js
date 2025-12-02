import pool from '../config/database.js';

class VehiclePhotoRepository {
  async findByVehicleId(vehicleId) {
    const result = await pool.query(
      'SELECT photo_id, vehicle_id, photo_url FROM vehicle_photos WHERE vehicle_id = $1 ORDER BY photo_id',
      [vehicleId]
    );
    return result.rows;
  }

  async findById(photoId) {
    const result = await pool.query(
      'SELECT photo_id, vehicle_id, photo_url FROM vehicle_photos WHERE photo_id = $1',
      [photoId]
    );
    return result.rows[0] || null;
  }

  async create(vehicleId, photoUrl) {
    const result = await pool.query(
      'INSERT INTO vehicle_photos (vehicle_id, photo_url) VALUES ($1, $2) RETURNING *',
      [vehicleId, photoUrl]
    );
    return result.rows[0];
  }

  async delete(photoId) {
    const result = await pool.query(
      'DELETE FROM vehicle_photos WHERE photo_id = $1 RETURNING photo_id',
      [photoId]
    );
    return result.rows.length > 0;
  }

  async deleteByVehicleId(vehicleId) {
    const result = await pool.query(
      'DELETE FROM vehicle_photos WHERE vehicle_id = $1 RETURNING photo_id',
      [vehicleId]
    );
    return result.rows.length > 0;
  }
}

export default new VehiclePhotoRepository();

