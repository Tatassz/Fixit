import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /orders/ - Create new order
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { service_id, device_brand, device_type, problem_description, device_photo, address } = req.body;

    if (!service_id || !device_brand || !device_type || !problem_description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib harus diisi',
      });
    }

    // Get service name
    const serviceResult = await pool.query(
      'SELECT name FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan',
      });
    }

    const serviceName = serviceResult.rows[0].name;

    const result = await pool.query(
      `INSERT INTO orders (
        user_id, service_id, service_name, device_brand, device_type,
        problem_description, device_photo, address, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, service_id, serviceName, device_brand, device_type, 
       problem_description, device_photo || null, address, 'waiting']
    );

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /orders/user - Get user's orders
router.get('/user', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      message: 'Berhasil mendapatkan daftar order',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /orders/ - Get all orders (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      message: 'Berhasil mendapatkan semua order',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /orders/:id - Get order by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mendapatkan detail order',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// PUT /orders/:id/status - Update order status (Admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, technician_id, technician_name, technician_phone, cost_estimation, final_cost } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status harus diisi',
      });
    }

    const updates: string[] = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [status];
    let paramCount = 2;

    if (technician_id !== undefined) {
      updates.push(`technician_id = $${paramCount}`);
      values.push(technician_id);
      paramCount++;
    }

    if (technician_name !== undefined) {
      updates.push(`technician_name = $${paramCount}`);
      values.push(technician_name);
      paramCount++;
    }

    if (technician_phone !== undefined) {
      updates.push(`technician_phone = $${paramCount}`);
      values.push(technician_phone);
      paramCount++;
    }

    if (cost_estimation !== undefined) {
      updates.push(`cost_estimation = $${paramCount}`);
      values.push(cost_estimation);
      paramCount++;
    }

    if (final_cost !== undefined) {
      updates.push(`final_cost = $${paramCount}`);
      values.push(final_cost);
      paramCount++;
    }

    values.push(id);

    const query = `
      UPDATE orders 
      SET ${updates.join(', ')}
      WHERE order_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Status order berhasil diperbarui',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /orders/:id/tracking - Track order status
router.get('/:id/tracking', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan',
      });
    }

    const order = result.rows[0];
    const history: any[] = [];

    // Build history based on status
    history.push({
      status: 'waiting',
      timestamp: order.created_at,
      note: 'Order dibuat, menunggu teknisi',
    });

    if (order.status === 'on_progress' || order.status === 'completed') {
      history.push({
        status: 'on_progress',
        timestamp: order.updated_at,
        note: order.technician_name 
          ? `Teknisi ${order.technician_name} sedang mengerjakan`
          : 'Sedang dalam pengerjaan',
      });
    }

    if (order.status === 'completed') {
      history.push({
        status: 'completed',
        timestamp: order.updated_at,
        note: 'Perbaikan selesai',
      });
    }

    if (order.status === 'cancelled') {
      history.push({
        status: 'cancelled',
        timestamp: order.updated_at,
        note: 'Order dibatalkan',
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mendapatkan tracking order',
      data: {
        order_id: order.order_id,
        current_status: order.status,
        history,
      },
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// DELETE /orders/:id - Cancel order
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query(
      'SELECT status FROM orders WHERE order_id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan',
      });
    }

    if (checkResult.rows[0].status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order yang sudah selesai tidak bisa dibatalkan',
      });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE order_id = $2
       RETURNING *`,
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: 'Order berhasil dibatalkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
