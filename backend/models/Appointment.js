const { db } = require('../config/database');

class Appointment {
  // Create a new appointment
  static create(appointmentData) {
    const { user_id, clinic_id, name, email, phone, area, clinic, department, date, message } = appointmentData;
    
    const stmt = db.prepare(`
      INSERT INTO appointments (user_id, clinic_id, name, email, phone, area, clinic, department, date, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      user_id || null,
      clinic_id || null,
      name,
      email,
      phone,
      area,
      clinic,
      department,
      date,
      message || null
    );
    
    return this.findById(result.lastInsertRowid);
  }

  // Find appointment by ID
  static findById(id) {
    const stmt = db.prepare(`
      SELECT * FROM appointments WHERE id = ?
    `);
    return stmt.get(id);
  }

  // Find all appointments for a user
  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  }

  // Find all appointments (admin)
  static findAll() {
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  // Find all appointments for a clinic
  static findByClinicId(clinicId) {
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      WHERE clinic_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(clinicId);
  }

  // Update appointment
  static update(id, appointmentData) {
    const { name, email, phone, area, clinic, department, date, message, status } = appointmentData;
    
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (area !== undefined) {
      updates.push('area = ?');
      values.push(area);
    }
    if (clinic !== undefined) {
      updates.push('clinic = ?');
      values.push(clinic);
    }
    if (department !== undefined) {
      updates.push('department = ?');
      values.push(department);
    }
    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date);
    }
    if (message !== undefined) {
      updates.push('message = ?');
      values.push(message);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.findById(id);
  }

  // Delete appointment
  static delete(id) {
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Appointment;
