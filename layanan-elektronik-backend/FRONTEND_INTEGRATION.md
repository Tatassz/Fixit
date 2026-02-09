# Frontend Integration Guide

## Menghubungkan Frontend dengan Backend

### 1. Update API Base URL

Edit file `src/services/base.ts` di project frontend:

```typescript
// Ganti URL ini:
export const API_BASE_URL = "https://try2fixit.idlabs.cloud";

// Menjadi:
export const API_BASE_URL = "http://localhost:3000";
```

### 2. Pastikan CORS Sudah Dikonfigurasi

Di backend, file `.env` harus sudah set:

```env
CORS_ORIGIN=http://localhost:5173
```

Jika frontend running di port lain, sesuaikan URL-nya.

### 3. Test Connection

1. **Jalankan Backend:**
   ```bash
   cd layanan-elektronik-backend
   npm run dev
   ```
   Server running di `http://localhost:3000`

2. **Jalankan Frontend:**
   ```bash
   cd layanan-elektronik
   npm run dev
   ```
   Frontend running di `http://localhost:5173`

3. **Test Login:**
   - Buka browser ke `http://localhost:5173`
   - Click "Login"
   - Email: `andi@mail.com`
   - Password: `password123`

### 4. Cek Developer Console

Buka Chrome DevTools (F12) → Network tab untuk melihat API requests.

Jika berhasil, Anda akan melihat:
- Request ke `http://localhost:3000/auth/login`
- Response dengan token dan user data
- Status 200 OK

### Common Issues

#### CORS Error
```
Access to fetch at 'http://localhost:3000/auth/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solusi:**
- Pastikan backend running
- Check `CORS_ORIGIN` di `.env` backend sesuai dengan URL frontend

#### Network Error / Failed to Fetch
```
TypeError: Failed to fetch
```

**Solusi:**
- Pastikan backend server sudah running
- Pastikan URL di `base.ts` sudah benar
- Check firewall tidak memblokir port 3000

#### 401 Unauthorized
```
Token tidak valid
```

**Solusi:**
- Token expired atau tidak valid
- Login ulang untuk mendapatkan token baru

## API Response Format

Semua response mengikuti format ini:

```typescript
{
  success: boolean;
  message: string;
  data?: T;  // Optional, berisi data jika berhasil
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGc...",
    "user": { ... }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

## Authentication Flow

1. **User Login:**
   - POST `/auth/login`
   - Response: `{ token, user }`
   - Frontend menyimpan token di localStorage

2. **Authenticated Requests:**
   - Setiap request authenticated include header:
   - `Authorization: Bearer <token>`

3. **Auto-included in Frontend:**
   Frontend sudah handle ini di `BaseApiClient` (base.ts)

## Testing Checklist

- [ ] Login user berhasil
- [ ] Login admin berhasil  
- [ ] Register user baru berhasil
- [ ] Get user profile berhasil
- [ ] Update profile berhasil
- [ ] List services berhasil
- [ ] Create order berhasil
- [ ] View orders berhasil
- [ ] Admin dashboard berhasil
- [ ] Admin manage orders berhasil

Jika semua checklist ✅, integrasi berhasil!
