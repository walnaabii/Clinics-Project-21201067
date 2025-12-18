# ✅ Admin User Setup Complete!

## What Was Implemented

### 1. **Role-Based Access Control (RBAC)**
   - Added `role` column to the `users` table
   - Default role for new users: `user`
   - Admin role: `admin`

### 2. **Database Changes**
   - ✅ Added `role TEXT DEFAULT 'user'` column to users table
   - ✅ Added index on role column for better performance
   - ✅ Migration handles existing databases automatically

### 3. **User Model Updates**
   - ✅ User creation now supports role assignment
   - ✅ User queries include role information
   - ✅ User updates can modify role

### 4. **Authentication Updates**
   - ✅ Auth middleware includes role in `req.user`
   - ✅ Login/Register responses include user role
   - ✅ New `authorize()` middleware for role-based access

### 5. **Admin User Created**
   - ✅ Default admin user seeded successfully
   - ✅ Admin routes example created

---

## 🔐 Default Admin Credentials

**Email:** `admin@clinichub.com`  
**Password:** `admin123`  
**Role:** `admin`

⚠️ **IMPORTANT:** Change this password after first login!

---

## 🚀 How to Use

### 1. Login as Admin

```bash
POST /api/auth/login
{
  "email": "admin@clinichub.com",
  "password": "admin123"
}
```

Response:
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

### 2. Access Admin Routes

Use the token in your requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Available Admin Endpoints:**
- `GET /api/admin/appointments` - View all appointments
- `GET /api/admin/users` - View all users
- `GET /api/admin/stats` - Dashboard statistics

### 3. Create More Admin Users

Run the seed script again (it will update existing user if needed):
```bash
cd backend
npm run seed:admin
```

Or manually update a user's role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

---

## 📁 Files Modified/Created

### Modified Files:
- ✅ `backend/config/database.js` - Added role column and migration
- ✅ `backend/models/User.js` - Added role support
- ✅ `backend/middleware/auth.js` - Added role to req.user and authorize() function
- ✅ `backend/routes/auth.js` - Include role in responses
- ✅ `backend/server.js` - Added admin routes
- ✅ `backend/package.json` - Added seed scripts

### New Files:
- ✅ `backend/scripts/seed-admin.js` - Admin user seed script
- ✅ `backend/routes/admin.js` - Example admin routes
- ✅ `backend/ADMIN-SETUP.md` - Complete admin setup guide

---

## 🛡️ Role-Based Authorization Example

### Protect a route with admin role:

```javascript
const { protect, authorize } = require('../middleware/auth');

// Single route
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only!' });
});

// Multiple routes
router.use(protect, authorize('admin'));
router.get('/dashboard', ...);
router.get('/users', ...);
```

### Check role in code:

```javascript
if (req.user.role === 'admin') {
  // Admin-only logic
}
```

---

## 📋 User Roles

| Role | Permissions |
|------|-------------|
| **user** | View/manage own appointments, browse clinics |
| **admin** | All user permissions + view all appointments/users, admin dashboard |

---

## ✅ Verification

The admin user has been successfully created! You can verify by:

1. **Check database:**
   ```sql
   SELECT id, name, email, role FROM users WHERE role = 'admin';
   ```

2. **Test login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@clinichub.com","password":"admin123"}'
   ```

3. **Test admin route:**
   ```bash
   curl -X GET http://localhost:3000/api/admin/stats \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 📚 Documentation

For more details, see:
- `backend/ADMIN-SETUP.md` - Complete admin setup guide
- `backend/routes/admin.js` - Example admin routes
- `backend/middleware/auth.js` - Authorization middleware

---

**Status:** ✅ Complete and Ready to Use!

