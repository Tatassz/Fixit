import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /services/ - Get all active services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE status = $1 ORDER BY id ASC',
      ['active']
    );

    res.json({
      success: true,
      message: 'Berhasil mendapatkan daftar layanan',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /services/:id - Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mendapatkan detail layanan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// POST /services/ - Create new service (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, description, price_start, estimated_time } = req.body;

    if (!name || !description || !price_start || !estimated_time) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi',
      });
    }

    const result = await pool.query(
      `INSERT INTO services (name, description, price_start, estimated_time, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price_start, estimated_time, 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Layanan berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// PUT /services/:id - Update service (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_start, estimated_time, status } = req.body;

    // Check if service exists
    const checkResult = await pool.query('SELECT id FROM services WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan',
      });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (price_start !== undefined) {
      updates.push(`price_start = $${paramCount}`);
      values.push(price_start);
      paramCount++;
    }

    if (estimated_time) {
      updates.push(`estimated_time = $${paramCount}`);
      values.push(estimated_time);
      paramCount++;
    }

    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE services 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Layanan berhasil diperbarui',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// DELETE /services/:id - Soft delete service (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE services 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id`,
      ['inactive', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Layanan berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
