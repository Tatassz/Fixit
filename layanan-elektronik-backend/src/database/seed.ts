import pool from '../config/database';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Seeding database...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Insert users
    await client.query(`
      INSERT INTO users (name, email, password, phone, address, role)
      VALUES 
        ('Andi Pratama', 'andi@mail.com', $1, '08123456789', 'Jl. Sudirman No. 123, Jakarta Pusat', 'user'),
        ('Budi Santoso', 'budi@mail.com', $1, '08234567890', 'Jl. Gatot Subroto No. 45, Jakarta Selatan', 'user'),
        ('Super Admin', 'admin@fixservice.com', $2, '08111222333', 'Jakarta', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword, adminPassword]);
    console.log('✓ Users seeded');

    // Insert services
    await client.query(`
      INSERT INTO services (name, description, price_start, estimated_time, status)
      VALUES 
        ('Perbaikan TV', 'Perbaikan TV LED/LCD semua merk. Termasuk servis panel, power supply, dan mainboard.', 150000, '1-2 hari', 'active'),
        ('Perbaikan AC', 'Service AC, cuci AC, isi freon, perbaikan kompresor dan kelistrikan AC.', 200000, '2-3 hari', 'active'),
        ('Perbaikan Kulkas', 'Perbaikan kulkas 1 pintu dan 2 pintu, service kompresor, ganti thermostat.', 180000, '1-3 hari', 'active'),
        ('Perbaikan Mesin Cuci', 'Service mesin cuci semua tipe, perbaikan dinamo, timer, dan elektronik.', 175000, '1-2 hari', 'active'),
        ('Perbaikan Kipas Angin', 'Perbaikan kipas angin berdiri, duduk, dan dinding. Ganti motor dan kapasitor.', 100000, '1 hari', 'active')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Services seeded');

    // Insert sample order
    await client.query(`
      INSERT INTO orders (
        user_id, service_id, service_name, device_brand, device_type, 
        problem_description, address, status, technician_id, 
        technician_name, technician_phone, cost_estimation
      )
      VALUES (
        1, 1, 'Perbaikan TV', 'Samsung', 'TV LED 43 inch',
        'TV tidak menyala, lampu indikator berkedip merah',
        'Jl. Sudirman No. 123, Jakarta Pusat', 'on_progress', 1,
        'Budi Teknisi', '08987654321', 250000
      )
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Sample order seeded');

    console.log('✅ Database seeding completed successfully!');
    console.log('\nTest accounts:');
    console.log('User: andi@mail.com / password123');
    console.log('Admin: admin@fixservice.com / admin123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase();
