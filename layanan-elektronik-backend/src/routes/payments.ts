import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate payment ID
const generatePaymentId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `PAY-${timestamp}-${random}`;
};

// POST /payments/ - Create payment
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Order ID dan metode pembayaran harus diisi',
      });
    }

    // Check if order exists and is completed
    const orderResult = await pool.query(
      'SELECT status, final_cost, cost_estimation FROM orders WHERE order_id = $1',
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan',
      });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment hanya bisa dibuat untuk order yang sudah selesai',
      });
    }

    const amount = order.final_cost || order.cost_estimation || 0;
    const paymentId = generatePaymentId();

    const result = await pool.query(
      `INSERT INTO payments (payment_id, order_id, amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [paymentId, order_id, amount, payment_method, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Payment berhasil dibuat',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /payments/:id - Get payment by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mendapatkan detail payment',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /payments/order/:orderId - Get payments by order ID
router.get('/order/:orderId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC',
      [orderId]
    );

    res.json({
      success: true,
      message: 'Berhasil mendapatkan payment history',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get payments by order error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// PUT /payments/:id/confirm - Confirm payment (Admin only)
router.put('/:id/confirm', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const checkResult = await pool.query(
      'SELECT status FROM payments WHERE payment_id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment tidak ditemukan',
      });
    }

    if (checkResult.rows[0].status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment sudah dikonfirmasi sebelumnya',
      });
    }

    const result = await pool.query(
      `UPDATE payments 
       SET status = $1, paid_at = CURRENT_TIMESTAMP
       WHERE payment_id = $2
       RETURNING *`,
      ['paid', id]
    );

    res.json({
      success: true,
      message: 'Payment berhasil dikonfirmasi',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
