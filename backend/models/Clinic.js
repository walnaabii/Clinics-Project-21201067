const { db } = require('../config/database');

class Clinic {
  // Create a new clinic
  static create(clinicData) {
    const { name, category, description, address, phone, email, image, rating, isActive } = clinicData;
    
    const stmt = db.prepare(`
      INSERT INTO clinics (name, category, description, address, phone, email, image, rating, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      name,
      category,
      description || null,
      address || null,
      phone || null,
      email || null,
      image || null,
      rating || 0,
      isActive !== undefined ? (isActive ? 1 : 0) : 1
    );
    
    return this.findById(result.lastInsertRowid);
  }

  // Find clinic by ID
  static findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM clinics WHERE id = ?
    `);
    return stmt.get(id);
  }

  // Find all clinics
  static findAll(filters = {}) {
    let query = 'SELECT * FROM clinics WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive ? 1 : 0);
    }

    query += ' ORDER BY name ASC';

    const stmt = db.prepare(query);
    return params.length > 0 ? stmt.all(...params) : stmt.all();
  }

  // Find clinic by name
  static findByName(name) {
    const stmt = db.prepare('SELECT * FROM clinics WHERE name = ?');
    return stmt.get(name);
  }

  // Update clinic
  static update(id, clinicData) {
    const { name, category, description, address, phone, email, image, rating, isActive } = clinicData;
    
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (image !== undefined) {
      updates.push('image = ?');
      values.push(image);
    }
    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE clinics SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.findById(id);
  }

  // Delete clinic
  static delete(id) {
    const stmt = db.prepare('DELETE FROM clinics WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Clinic;
