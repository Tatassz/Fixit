import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import servicesRoutes from './routes/services';
import ordersRoutes from './routes/orders';
import paymentsRoutes from './routes/payments';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fix Service API',
    version: '1.0.0',
  });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/services', servicesRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Fix Service API                      ║
║   Server running on port ${PORT}          ║
║   http://localhost:${PORT}                ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════╝
  `);
});

export default app;
