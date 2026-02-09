import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User, ApiResponse } from '../types';

const router = Router();

// Generate JWT token
const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// POST /auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi',
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'user']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// POST /auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, password, dan phone harus diisi',
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, address, role, created_at`,
      [name, email, hashedPassword, phone, address || null, 'user']
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

// POST /auth/admin/login - Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi',
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const admin = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;
    const token = generateToken(adminWithoutPassword);

    res.json({
      success: true,
      message: 'Login admin berhasil',
      data: {
        token,
        admin: adminWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
    });
  }
});

export default router;
