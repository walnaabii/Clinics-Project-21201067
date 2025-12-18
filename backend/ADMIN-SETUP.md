# Admin User Setup Guide

This guide explains how to set up and use the admin user in ClinicHub.

## 🚀 Quick Setup

### 1. Create Admin User

Run the seed script to create the default admin user:

```bash
cd backend
npm run seed:admin
```

Or directly:
```bash
node scripts/seed-admin.js
```

### 2. Default Admin Credentials

After running the seed script, you'll have an admin user with these credentials:

- **Email:** `admin@clinichub.com`
- **Password:** `admin123`
- **Role:** `admin`

## 📋 User Roles

The application now supports role-based access control:

- **`user`** - Regular user (default for new registrations)
  - Can view and manage their own appointments
  - Can browse clinics
  - Can book appointments

- **`admin`** - Administrator
  - All user permissions
  - Can view all appointments
  - Can view all users
  - Can access admin dashboard
  - Can manage clinics (if implemented)

## 🔐 Authentication

### Login as Admin

1. Use the login endpoint with admin credentials:
```bash
POST /api/auth/login
{
  "email": "admin@clinichub.com",
  "password": "admin123"
}
```

2. The response will include the user role:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@clinichub.com",
    "role": "admin"
  }
}
```

3. Use the token in subsequent requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🛡️ Role-Based Authorization

### Using Admin Routes

Admin routes are protected with role-based middleware. Example:

```javascript
// In routes/admin.js
const { protect, authorize } = require('../middleware/auth');

// Protect route and require admin role
router.get('/appointments', protect, authorize('admin'), async (req, res) => {
  // Only admins can access this
});
```

### Available Admin Endpoints

- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics

### Example: Creating Admin-Only Routes

```javascript
const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});
```

## 🔧 Database Schema

The `users` table now includes a `role` column:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',  -- New column
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 Creating Additional Admin Users

### Method 1: Using the API (after first admin login)

You can create additional admin users through the registration endpoint, then update their role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'newadmin@example.com';
```

### Method 2: Direct Database Update

```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

### Method 3: Modify Seed Script

Edit `backend/scripts/seed-admin.js` to create additional admin users.

## 🧪 Testing Admin Access

### Test Admin Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinichub.com","password":"admin123"}'
```

### Test Admin Route

```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🔒 Security Best Practices

1. **Change Default Password:** Immediately change the default admin password
2. **Use Strong Passwords:** Admin accounts should have strong, unique passwords
3. **Limit Admin Users:** Only create admin users when necessary
4. **Monitor Admin Activity:** Log admin actions for security auditing
5. **Token Expiration:** JWT tokens expire in 30 days (configured in `routes/auth.js`)

## 🐛 Troubleshooting

### Admin User Not Created

1. Check if the database migration ran successfully
2. Verify the role column exists: `SELECT * FROM users LIMIT 1;`
3. Check for errors in the seed script output

### Cannot Access Admin Routes

1. Verify you're logged in with an admin account
2. Check the token includes the role: `req.user.role === 'admin'`
3. Ensure the `authorize('admin')` middleware is applied

### Role Not Showing in Response

1. Check the User model includes role in queries
2. Verify the auth routes return the role field
3. Check the database has the role column

## 📚 Related Files

- `backend/config/database.js` - Database schema with role column
- `backend/models/User.js` - User model with role support
- `backend/middleware/auth.js` - Authentication and authorization middleware
- `backend/routes/admin.js` - Example admin routes
- `backend/scripts/seed-admin.js` - Admin user seed script

## 🎯 Next Steps

1. Create admin dashboard UI
2. Add more admin features (manage clinics, users, etc.)
3. Implement role-based UI elements
4. Add audit logging for admin actions
5. Create additional roles if needed (e.g., `clinic_manager`)

---

**Need Help?** Check the main README.md or backend documentation.

