import pool from '../config/database.js';

class VehicleRepository {
  async findAll(filters = {}) {
    let query = `
      SELECT 
        v.vehicle_id,
        v.year_manufacture,
        v.simple_description,
        v.mileage,
        v.ad_price,
        v.fipe_price,
        v.created_at,
        b.brand_id,
        b.name as brand,
        m.model_id,
        m.name as model,
        ft.fuel_type,
        ft.description as fuel_type_description,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'item_id', i.item_id,
            'item_name', i.item_name
          )) FILTER (WHERE i.item_id IS NOT NULL),
          '[]'
        ) as items,
        COALESCE(
          json_agg(DISTINCT vp.photo_url) FILTER (WHERE vp.photo_url IS NOT NULL),
          '[]'
        ) as photos
      FROM vehicles v
      INNER JOIN brand b ON v.brand_id = b.brand_id
      INNER JOIN model m ON v.model_id = m.model_id
      INNER JOIN fuel_type ft ON v.fuel_type = ft.fuel_type
      LEFT JOIN vehicle_items vi ON v.vehicle_id = vi.vehicle_id
      LEFT JOIN items i ON vi.item_id = i.item_id
      LEFT JOIN vehicle_photos vp ON v.vehicle_id = vp.vehicle_id
    `;

    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (filters.brand) {
      conditions.push(`b.name = $${paramCount++}`);
      params.push(filters.brand);
    }

    if (filters.model) {
      conditions.push(`m.name = $${paramCount++}`);
      params.push(filters.model);
    }

    if (filters.fuel_type) {
      conditions.push(`v.fuel_type = $${paramCount++}`);
      params.push(filters.fuel_type);
    }

    if (filters.min_price) {
      conditions.push(`v.ad_price >= $${paramCount++}`);
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      conditions.push(`v.ad_price <= $${paramCount++}`);
      params.push(filters.max_price);
    }

    if (filters.min_year) {
      conditions.push(`v.year_manufacture >= $${paramCount++}`);
      params.push(filters.min_year);
    }

    if (filters.max_year) {
      conditions.push(`v.year_manufacture <= $${paramCount++}`);
      params.push(filters.max_year);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY 
        v.vehicle_id, b.brand_id, b.name, m.model_id, m.name, 
        ft.fuel_type, ft.description
      ORDER BY v.vehicle_id DESC
    `;

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => ({
      vehicle_id: row.vehicle_id,
      brand: row.brand,
      model: row.model,
      year_manufacture: row.year_manufacture,
      fuel_type: row.fuel_type,
      simple_description: row.simple_description,
      mileage: row.mileage,
      ad_price: parseFloat(row.ad_price),
      fipe_price: parseFloat(row.fipe_price),
      items: Array.isArray(row.items) ? row.items.map(item => item.item_name) : [],
      photos: Array.isArray(row.photos) ? row.photos : [],
    }));
  }

  async findById(id) {
    const query = `
      SELECT 
        v.vehicle_id,
        v.year_manufacture,
        v.simple_description,
        v.mileage,
        v.ad_price,
        v.fipe_price,
        v.created_at,
        b.brand_id,
        b.name as brand,
        m.model_id,
        m.name as model,
        ft.fuel_type,
        ft.description as fuel_type_description,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'item_id', i.item_id,
            'item_name', i.item_name
          )) FILTER (WHERE i.item_id IS NOT NULL),
          '[]'
        ) as items,
        COALESCE(
          json_agg(DISTINCT vp.photo_url) FILTER (WHERE vp.photo_url IS NOT NULL),
          '[]'
        ) as photos
      FROM vehicles v
      INNER JOIN brand b ON v.brand_id = b.brand_id
      INNER JOIN model m ON v.model_id = m.model_id
      INNER JOIN fuel_type ft ON v.fuel_type = ft.fuel_type
      LEFT JOIN vehicle_items vi ON v.vehicle_id = vi.vehicle_id
      LEFT JOIN items i ON vi.item_id = i.item_id
      LEFT JOIN vehicle_photos vp ON v.vehicle_id = vp.vehicle_id
      WHERE v.vehicle_id = $1
      GROUP BY 
        v.vehicle_id, b.brand_id, b.name, m.model_id, m.name, 
        ft.fuel_type, ft.description
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      vehicle_id: row.vehicle_id,
      brand: row.brand,
      model: row.model,
      year_manufacture: row.year_manufacture,
      fuel_type: row.fuel_type,
      simple_description: row.simple_description,
      mileage: row.mileage,
      ad_price: parseFloat(row.ad_price),
      fipe_price: parseFloat(row.fipe_price),
      items: Array.isArray(row.items) ? row.items.map(item => item.item_name) : [],
      photos: Array.isArray(row.photos) ? row.photos : [],
    };
  }

  async create(vehicleData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get or create brand
      let brandResult = await client.query(
        'SELECT brand_id FROM brand WHERE name = $1',
        [vehicleData.brand]
      );
      
      let brandId;
      if (brandResult.rows.length === 0) {
        const insertBrand = await client.query(
          'INSERT INTO brand (name) VALUES ($1) RETURNING brand_id',
          [vehicleData.brand]
        );
        brandId = insertBrand.rows[0].brand_id;
      } else {
        brandId = brandResult.rows[0].brand_id;
      }

      // Get or create model
      let modelResult = await client.query(
        'SELECT model_id FROM model WHERE brand_id = $1 AND name = $2',
        [brandId, vehicleData.model]
      );
      
      let modelId;
      if (modelResult.rows.length === 0) {
        const insertModel = await client.query(
          'INSERT INTO model (brand_id, name) VALUES ($1, $2) RETURNING model_id',
          [brandId, vehicleData.model]
        );
        modelId = insertModel.rows[0].model_id;
      } else {
        modelId = modelResult.rows[0].model_id;
      }

      // Insert vehicle
      const vehicleResult = await client.query(
        `INSERT INTO vehicles (
          brand_id, model_id, year_manufacture, fuel_type, 
          simple_description, mileage, ad_price, fipe_price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING vehicle_id`,
        [
          brandId,
          modelId,
          vehicleData.year_manufacture,
          vehicleData.fuel_type,
          vehicleData.simple_description || null,
          vehicleData.mileage || null,
          vehicleData.ad_price || null,
          vehicleData.fipe_price || null,
        ]
      );

      const vehicleId = vehicleResult.rows[0].vehicle_id;

      // Insert items
      if (vehicleData.items && vehicleData.items.length > 0) {
        for (const itemName of vehicleData.items) {
          // Get or create item
          let itemResult = await client.query(
            'SELECT item_id FROM items WHERE item_name = $1',
            [itemName]
          );
          
          let itemId;
          if (itemResult.rows.length === 0) {
            const insertItem = await client.query(
              'INSERT INTO items (item_name) VALUES ($1) RETURNING item_id',
              [itemName]
            );
            itemId = insertItem.rows[0].item_id;
          } else {
            itemId = itemResult.rows[0].item_id;
          }

          await client.query(
            'INSERT INTO vehicle_items (vehicle_id, item_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [vehicleId, itemId]
          );
        }
      }

      // Insert photos
      if (vehicleData.photos && vehicleData.photos.length > 0) {
        for (const photoUrl of vehicleData.photos) {
          await client.query(
            'INSERT INTO vehicle_photos (vehicle_id, photo_url) VALUES ($1, $2)',
            [vehicleId, photoUrl]
          );
        }
      }

      await client.query('COMMIT');

      return await this.findById(vehicleId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, vehicleData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get or create brand
      let brandId;
      if (vehicleData.brand) {
        let brandResult = await client.query(
          'SELECT brand_id FROM brand WHERE name = $1',
          [vehicleData.brand]
        );
        
        if (brandResult.rows.length === 0) {
          const insertBrand = await client.query(
            'INSERT INTO brand (name) VALUES ($1) RETURNING brand_id',
            [vehicleData.brand]
          );
          brandId = insertBrand.rows[0].brand_id;
        } else {
          brandId = brandResult.rows[0].brand_id;
        }
      }

      // Get or create model
      let modelId;
      if (vehicleData.model && brandId) {
        let modelResult = await client.query(
          'SELECT model_id FROM model WHERE brand_id = $1 AND name = $2',
          [brandId, vehicleData.model]
        );
        
        if (modelResult.rows.length === 0) {
          const insertModel = await client.query(
            'INSERT INTO model (brand_id, name) VALUES ($1, $2) RETURNING model_id',
            [brandId, vehicleData.model]
          );
          modelId = insertModel.rows[0].model_id;
        } else {
          modelId = modelResult.rows[0].model_id;
        }
      }

      // Build update query dynamically
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      if (brandId) {
        updateFields.push(`brand_id = $${paramCount++}`);
        updateValues.push(brandId);
      }

      if (modelId) {
        updateFields.push(`model_id = $${paramCount++}`);
        updateValues.push(modelId);
      }

      if (vehicleData.year_manufacture !== undefined) {
        updateFields.push(`year_manufacture = $${paramCount++}`);
        updateValues.push(vehicleData.year_manufacture);
      }

      if (vehicleData.fuel_type) {
        updateFields.push(`fuel_type = $${paramCount++}`);
        updateValues.push(vehicleData.fuel_type);
      }

      if (vehicleData.simple_description !== undefined) {
        updateFields.push(`simple_description = $${paramCount++}`);
        updateValues.push(vehicleData.simple_description);
      }

      if (vehicleData.mileage !== undefined) {
        updateFields.push(`mileage = $${paramCount++}`);
        updateValues.push(vehicleData.mileage);
      }

      if (vehicleData.ad_price !== undefined) {
        updateFields.push(`ad_price = $${paramCount++}`);
        updateValues.push(vehicleData.ad_price);
      }

      if (vehicleData.fipe_price !== undefined) {
        updateFields.push(`fipe_price = $${paramCount++}`);
        updateValues.push(vehicleData.fipe_price);
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        await client.query(
          `UPDATE vehicles SET ${updateFields.join(', ')} WHERE vehicle_id = $${paramCount}`,
          updateValues
        );
      }

      // Update items if provided
      if (vehicleData.items !== undefined) {
        // Delete existing items
        await client.query('DELETE FROM vehicle_items WHERE vehicle_id = $1', [id]);

        // Insert new items
        if (vehicleData.items.length > 0) {
          for (const itemName of vehicleData.items) {
            let itemResult = await client.query(
              'SELECT item_id FROM items WHERE item_name = $1',
              [itemName]
            );
            
            let itemId;
            if (itemResult.rows.length === 0) {
              const insertItem = await client.query(
                'INSERT INTO items (item_name) VALUES ($1) RETURNING item_id',
                [itemName]
              );
              itemId = insertItem.rows[0].item_id;
            } else {
              itemId = itemResult.rows[0].item_id;
            }

            await client.query(
              'INSERT INTO vehicle_items (vehicle_id, item_id) VALUES ($1, $2)',
              [id, itemId]
            );
          }
        }
      }

      // Update photos if provided
      if (vehicleData.photos !== undefined) {
        // Delete existing photos
        await client.query('DELETE FROM vehicle_photos WHERE vehicle_id = $1', [id]);

        // Insert new photos
        if (vehicleData.photos.length > 0) {
          for (const photoUrl of vehicleData.photos) {
            await client.query(
              'INSERT INTO vehicle_photos (vehicle_id, photo_url) VALUES ($1, $2)',
              [id, photoUrl]
            );
          }
        }
      }

      await client.query('COMMIT');

      return await this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING vehicle_id',
      [id]
    );
    return result.rows.length > 0;
  }
}

export default new VehicleRepository();

