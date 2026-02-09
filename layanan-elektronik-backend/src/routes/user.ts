import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /user/profile - Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Berhasil mendapatkan profil user',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// PUT /user/profile - Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, phone, address } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, address, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
