const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Database file path (stored in backend/data folder)
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'clinichub.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Created data directory: ${dataDir}`);
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        clinic_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
      )
    `);

    // Add role column if it doesn't exist (migration for existing databases)
    try {
      // Check if column exists by trying to select it
      db.prepare('SELECT role FROM users LIMIT 1').get();
      console.log('ℹ️  Role column already exists');
    } catch (error) {
      // Column doesn't exist, add it
      try {
        db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
        console.log('✅ Added role column to users table');
      } catch (alterError) {
        console.log('ℹ️  Could not add role column (may already exist)');
      }
    }

    // Clinics table
    db.exec(`
      CREATE TABLE IF NOT EXISTS clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        image TEXT,
        rating REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Appointments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        clinic_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        area TEXT NOT NULL,
        clinic TEXT NOT NULL,
        department TEXT NOT NULL,
        date TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
      )
    `);

    // Appointment reschedules history table
    db.exec(`
      CREATE TABLE IF NOT EXISTS appointment_reschedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,
        old_date TEXT NOT NULL,
        new_date TEXT NOT NULL,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    // Add clinic_id column to appointments if it doesn't exist
    try {
      db.prepare('SELECT clinic_id FROM appointments LIMIT 1').get();
      console.log('ℹ️  clinic_id column already exists in appointments');
    } catch (error) {
      try {
        db.exec(`ALTER TABLE appointments ADD COLUMN clinic_id INTEGER REFERENCES clinics(id) ON DELETE SET NULL`);
        console.log('✅ Added clinic_id column to appointments table');
      } catch (alterError) {
        console.log('ℹ️  Could not add clinic_id column (may already exist)');
      }
    }

    // Add clinic_id column to users if it doesn't exist
    try {
      db.prepare('SELECT clinic_id FROM users LIMIT 1').get();
      console.log('ℹ️  clinic_id column already exists in users');
    } catch (error) {
      try {
        db.exec(`ALTER TABLE users ADD COLUMN clinic_id INTEGER REFERENCES clinics(id) ON DELETE SET NULL`);
        console.log('✅ Added clinic_id column to users table');
      } catch (alterError) {
        console.log('ℹ️  Could not add clinic_id column (may already exist)');
      }
    }

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_clinic_id ON users(clinic_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
      CREATE INDEX IF NOT EXISTS idx_clinics_category ON clinics(category);
      CREATE INDEX IF NOT EXISTS idx_clinics_active ON clinics(is_active);
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Initialize on first load
initializeDatabase();

// Helper function to hash password
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Helper function to compare password
function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  db,
  hashPassword,
  comparePassword,
  initializeDatabase,
};
