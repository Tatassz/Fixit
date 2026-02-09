import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';
import { DashboardStats, ReportData } from '../types';

const router = Router();

// GET /admin/dashboard - Get dashboard statistics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get total users
    const usersResult = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get pending orders
    const pendingResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'waiting'"
    );
    const pendingOrders = parseInt(pendingResult.rows[0].count);

    // Get completed orders
    const completedResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'completed'"
    );
    const completedOrders = parseInt(completedResult.rows[0].count);

    // Get total revenue
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(COALESCE(final_cost, cost_estimation)), 0) as revenue
       FROM orders WHERE status = 'completed'`
    );
    const totalRevenue = parseInt(revenueResult.rows[0].revenue);

    // Get monthly revenue (current month)
    const monthlyRevenueResult = await pool.query(
      `SELECT COALESCE(SUM(COALESCE(final_cost, cost_estimation)), 0) as revenue
       FROM orders 
       WHERE status = 'completed' 
       AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );
    const monthlyRevenue = parseInt(monthlyRevenueResult.rows[0].revenue);

    const stats: DashboardStats = {
      total_users: totalUsers,
      total_technicians: 5, // Static for now
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
    };

    res.json({
      success: true,
      message: 'Berhasil mendapatkan statistik dashboard',
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /admin/users - Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, address, role, created_at 
       FROM users 
       WHERE role = 'user'
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      message: 'Berhasil mendapatkan daftar user',
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// GET /admin/reports - Get reports
router.get('/reports', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    // Orders summary
    const totalOrdersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    const completedOrdersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'completed'"
    );
    const onProgressOrdersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'on_progress'"
    );
    const waitingOrdersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'waiting'"
    );
    const cancelledOrdersResult = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'cancelled'"
    );

    const ordersSummary = {
      total: parseInt(totalOrdersResult.rows[0].count),
      completed: parseInt(completedOrdersResult.rows[0].count),
      on_progress: parseInt(onProgressOrdersResult.rows[0].count),
      waiting: parseInt(waitingOrdersResult.rows[0].count),
      cancelled: parseInt(cancelledOrdersResult.rows[0].count),
    };

    // Total revenue
    const totalRevenueResult = await pool.query(
      `SELECT COALESCE(SUM(COALESCE(final_cost, cost_estimation)), 0) as revenue
       FROM orders WHERE status = 'completed'`
    );
    const totalRevenue = parseInt(totalRevenueResult.rows[0].revenue);

    // Revenue by service
    const revenueByServiceResult = await pool.query(
      `SELECT 
        s.id as service_id,
        s.name as service_name,
        COUNT(o.order_id) as total_orders,
        COALESCE(SUM(COALESCE(o.final_cost, o.cost_estimation)), 0) as revenue
       FROM services s
       LEFT JOIN orders o ON s.id = o.service_id AND o.status = 'completed'
       GROUP BY s.id, s.name
       ORDER BY revenue DESC`
    );

    const revenueByService = revenueByServiceResult.rows.map(row => ({
      service_id: row.service_id,
      service_name: row.service_name,
      total_orders: parseInt(row.total_orders),
      revenue: parseInt(row.revenue),
    }));

    const reportData: ReportData = {
      orders_summary: ordersSummary,
      total_revenue: totalRevenue,
      revenue_by_service: revenueByService,
    };

    res.json({
      success: true,
      message: 'Berhasil mendapatkan laporan',
      data: reportData,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
