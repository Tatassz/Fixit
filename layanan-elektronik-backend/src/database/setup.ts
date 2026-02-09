import pool from '../config/database';

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database schema...');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price_start INTEGER NOT NULL,
        estimated_time VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Services table created');

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        service_id INTEGER NOT NULL REFERENCES services(id),
        service_name VARCHAR(255),
        device_brand VARCHAR(255) NOT NULL,
        device_type VARCHAR(255) NOT NULL,
        problem_description TEXT NOT NULL,
        device_photo TEXT,
        address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'waiting',
        technician_id INTEGER,
        technician_name VARCHAR(255),
        technician_phone VARCHAR(20),
        cost_estimation INTEGER,
        final_cost INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Orders table created');

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(100) PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(order_id),
        amount INTEGER NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      );
    `);
    console.log('✓ Payments table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✓ Indexes created');

    console.log('✅ Database schema setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

setupDatabase();
