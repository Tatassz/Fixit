# Layanan Elektronik - Backend API

Backend API untuk aplikasi Fix Service - Layanan Perbaikan Elektronik. Dibuat dengan Node.js, Express, TypeScript, dan PostgreSQL.

## 📋 Prerequisites

Sebelum memulai, pastikan sudah terinstall:

- **Node.js** (v18 atau lebih tinggi) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 atau lebih tinggi) - [Download](https://www.postgresql.org/download/)
- **npm** atau **yarn**

## 🚀 Quick Start

### 1. Clone atau Copy Project

```bash
# Jika sudah ada folder project, masuk ke dalamnya
cd layanan-elektronik-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

#### A. Buat Database Baru

Buka PostgreSQL (pgAdmin atau psql) dan jalankan:

```sql
CREATE DATABASE layanan_elektronik;
```

#### B. Buat User Database (Opsional, jika ingin user khusus)

```sql
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE layanan_elektronik TO your_username;
```

### 4. Konfigurasi Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi PostgreSQL Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=layanan_elektronik
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (ganti dengan string random yang aman)
JWT_SECRET=ganti_dengan_secret_key_yang_aman_123

# CORS (sesuaikan dengan URL frontend Anda)
CORS_ORIGIN=http://localhost:5173
```

### 5. Setup Database Schema

Jalankan script untuk membuat tabel-tabel:

```bash
npm run db:setup
```

Anda akan melihat output:
```
✓ Users table created
✓ Services table created
✓ Orders table created
✓ Payments table created
✓ Indexes created
✅ Database schema setup completed successfully!
```

### 6. Seed Database dengan Data Awal

Jalankan script untuk mengisi data awal:

```bash
npm run db:seed
```

Output:
```
✓ Users seeded
✓ Services seeded
✓ Sample order seeded
✅ Database seeding completed successfully!

Test accounts:
User: andi@mail.com / password123
Admin: admin@fixservice.com / admin123
```

### 7. Jalankan Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| POST | `/auth/admin/login` | Admin login | No |

### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/profile` | Get user profile | Yes (User) |
| PUT | `/user/profile` | Update user profile | Yes (User) |

### Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services/` | Get all active services | No |
| GET | `/services/:id` | Get service by ID | No |
| POST | `/services/` | Create new service | Yes (Admin) |
| PUT | `/services/:id` | Update service | Yes (Admin) |
| DELETE | `/services/:id` | Delete service | Yes (Admin) |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders/` | Create new order | Yes (User) |
| GET | `/orders/user` | Get user's orders | Yes (User) |
| GET | `/orders/` | Get all orders | Yes (Admin) |
| GET | `/orders/:id` | Get order by ID | Yes |
| PUT | `/orders/:id/status` | Update order status | Yes (Admin) |
| GET | `/orders/:id/tracking` | Track order | Yes |
| DELETE | `/orders/:id` | Cancel order | Yes |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/` | Create payment | Yes (User) |
| GET | `/payments/:id` | Get payment by ID | Yes |
| GET | `/payments/order/:orderId` | Get payments by order | Yes |
| PUT | `/payments/:id/confirm` | Confirm payment | Yes (Admin) |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Get dashboard stats | Yes (Admin) |
| GET | `/admin/users` | Get all users | Yes (Admin) |
| GET | `/admin/reports` | Get reports | Yes (Admin) |

## 🧪 Testing API

Anda bisa test API menggunakan:

### 1. Postman atau Thunder Client

Import collection atau buat request manual.

**Example: Login**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "andi@mail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Andi Pratama",
      "email": "andi@mail.com",
      "phone": "08123456789",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "role": "user"
    }
  }
}
```

### 2. cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"andi@mail.com","password":"password123"}'

# Get services (no auth needed)
curl http://localhost:3000/services/

# Get user profile (need token)
curl http://localhost:3000/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### Database Connection Error

Jika muncul error koneksi database:

1. Pastikan PostgreSQL sudah running
2. Cek username, password, dan nama database di `.env`
3. Test koneksi manual:
   ```bash
   psql -U postgres -d layanan_elektronik
   ```

### Port Already in Use

Jika port 3000 sudah digunakan:

1. Ubah `PORT` di file `.env` ke port lain (misal 3001)
2. Restart server

### JWT Error

Jika ada error terkait JWT:

1. Pastikan `JWT_SECRET` di `.env` sudah diisi
2. Pastikan token dikirim dengan format: `Bearer <token>`

## 📁 Project Structure

```
layanan-elektronik-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection
│   ├── database/
│   │   ├── setup.ts              # Database schema setup
│   │   └── seed.ts               # Database seeding
│   ├── middleware/
│   │   └── auth.ts               # JWT authentication
│   ├── routes/
│   │   ├── auth.ts               # Authentication routes
│   │   ├── user.ts               # User profile routes
│   │   ├── services.ts           # Services routes
│   │   ├── orders.ts             # Orders routes
│   │   ├── payments.ts           # Payments routes
│   │   └── admin.ts              # Admin routes
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── index.ts                  # Main server file
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Notes

1. **Jangan commit file `.env`** - File ini berisi credentials
2. **Ganti JWT_SECRET** dengan string random yang aman untuk production
3. **Gunakan HTTPS** saat deploy ke production
4. **Validasi input** - Backend sudah include basic validation
5. **Rate limiting** - Pertimbangkan menambahkan rate limiting untuk production

## 🚢 Deployment

### Deploy ke Heroku (Contoh)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```
6. Deploy: `git push heroku main`
7. Run migrations: `heroku run npm run db:setup`
8. Seed database: `heroku run npm run db:seed`

## 📝 Test Accounts

Setelah seeding, gunakan akun ini untuk testing:

**User Account:**
- Email: `andi@mail.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@fixservice.com`
- Password: `admin123`

## 🤝 Integrasi dengan Frontend

Update `API_BASE_URL` di frontend (`src/services/base.ts`):

```typescript
// Development
export const API_BASE_URL = "http://localhost:3000";

// Production
export const API_BASE_URL = "https://your-api-domain.com";
```

## 📞 Support

Jika ada pertanyaan atau masalah, hubungi tim development atau buat issue di repository.

## 📄 License

ISC
