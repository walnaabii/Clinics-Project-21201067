const { db, hashPassword, comparePassword } = require('../config/database');

class User {
  // Create a new user
  static create(userData) {
    const { name, email, password, phone, role, clinic_id } = userData;
    
    try {
      const hashedPassword = hashPassword(password);
      
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password, phone, role, clinic_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        name, 
        email.toLowerCase().trim(), 
        hashedPassword, 
        phone || null,
        role || 'user',
        clinic_id || null
      );
      
      return {
        id: result.lastInsertRowid,
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: role || 'user',
        clinic_id: clinic_id || null,
      };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('User already exists with this email');
      }
      throw error;
    }
  }

  // Find user by email
  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.toLowerCase().trim());
  }

  // Find user by ID
  static findById(id) {
    const stmt = db.prepare('SELECT id, name, email, phone, role, clinic_id, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  // Find user by ID with password (for login)
  static findByIdWithPassword(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return comparePassword(plainPassword, hashedPassword);
  }

  // Update user
  static update(id, userData) {
    const { name, phone, role, email, clinic_id } = userData;
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email.toLowerCase().trim());
    }
    if (clinic_id !== undefined) {
      updates.push('clinic_id = ?');
      values.push(clinic_id);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.findById(id);
  }

  // Update password
  static updatePassword(id, newPassword) {
    const hashedPassword = hashPassword(newPassword);
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    stmt.run(hashedPassword, id);
    return true;
  }

  // Delete user
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = User;
