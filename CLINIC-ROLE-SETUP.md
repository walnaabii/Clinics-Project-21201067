# Clinic Role Feature - Setup Guide

## ✅ What Was Implemented

### 1. **Database Updates**
- ✅ Added `clinic_id` column to `users` table (links clinic users to their clinic)
- ✅ Added `clinic_id` column to `appointments` table (links appointments to clinics)
- ✅ Added foreign key relationships
- ✅ Added indexes for better performance

### 2. **Backend API Endpoints**

#### Clinic Routes (`/api/clinic/*`)
- `GET /api/clinic/appointments` - Get all appointments for the clinic
- `GET /api/clinic/stats` - Get clinic statistics
- `PUT /api/clinic/appointments/:id/status` - Update appointment status
- `GET /api/clinic/profile` - Get clinic profile information

All routes require:
- Authentication (JWT token)
- Clinic role
- Valid clinic_id association

### 3. **Frontend Pages**
- ✅ `clinic-dashboard.html` - Clinic dashboard to view and manage appointments
- ✅ Login redirects clinic users to dashboard
- ✅ Admin panel can create clinic users

### 4. **Admin Features**
- ✅ Admin can create clinic users from admin panel
- ✅ Admin can assign clinic users to specific clinics
- ✅ Users table shows clinic role and clinic_id

---

## 🚀 How to Create a Clinic User

### Method 1: Using Admin Panel (Recommended)

1. **Log in as admin:**
   - Email: `admin@clinichub.com`
   - Password: `admin123`

2. **Go to Admin Panel:**
   - Navigate to `admin.html`

3. **Click "Add User" button** in the Users section

4. **Fill in the form:**
   - Name: Clinic manager name
   - Email: Clinic email
   - Password: Set password
   - Role: Select "Clinic"
   - Clinic: Select the clinic from dropdown

5. **Click "Add User"**

### Method 2: Using Command Line Script

```bash
cd backend
node scripts/create-clinic-user.js <clinic_id> <email> <password> <name>
```

**Example:**
```bash
node scripts/create-clinic-user.js 1 clinic@arakmedical.com password123 "Arak Medical Manager"
```

**First, find clinic IDs:**
```bash
# Check existing clinics in database or admin panel
```

---

## 📋 Clinic User Workflow

### 1. **Login**
- Clinic users log in with their email and password
- They are automatically redirected to `clinic-dashboard.html`

### 2. **View Appointments**
- Clinic dashboard shows all appointments assigned to their clinic
- Statistics: Total, Pending, Confirmed, Cancelled

### 3. **Manage Appointments**
- **Confirm**: Change status from "pending" to "confirmed"
- **Cancel**: Cancel appointments
- **Complete**: Mark appointments as completed

### 4. **View Clinic Information**
- See clinic name and category
- View clinic profile details

---

## 🔐 Security

- ✅ Clinic users can only see appointments for their clinic
- ✅ Clinic users cannot access other clinics' appointments
- ✅ Role-based access control enforced
- ✅ All endpoints require authentication

---

## 📊 Database Schema Changes

### Users Table
```sql
ALTER TABLE users ADD COLUMN clinic_id INTEGER REFERENCES clinics(id);
```

### Appointments Table
```sql
ALTER TABLE appointments ADD COLUMN clinic_id INTEGER REFERENCES clinics(id);
```

### Indexes
- `idx_users_clinic_id` - Index on users.clinic_id
- `idx_appointments_clinic_id` - Index on appointments.clinic_id

---

## 🎯 Appointment Linking

When a user books an appointment:
1. System finds clinic by name
2. Links appointment to `clinic_id`
3. Clinic users can see appointments for their clinic_id

---

## 📝 API Examples

### Get Clinic Appointments
```bash
GET /api/clinic/appointments
Authorization: Bearer <clinic_user_token>
```

### Update Appointment Status
```bash
PUT /api/clinic/appointments/1/status
Authorization: Bearer <clinic_user_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Get Clinic Stats
```bash
GET /api/clinic/stats
Authorization: Bearer <clinic_user_token>
```

---

## 🎨 Clinic Dashboard Features

1. **Statistics Cards:**
   - Total Appointments
   - Pending Appointments
   - Confirmed Appointments
   - Cancelled Appointments

2. **Appointments Table:**
   - Patient Name
   - Email
   - Phone
   - Department
   - Date
   - Status (with color badges)
   - Actions (Confirm/Cancel/Complete)

3. **Status Management:**
   - Pending → Confirmed
   - Pending/Confirmed → Cancelled
   - Confirmed → Completed

---

## 🔄 User Roles Summary

| Role | Access | Dashboard |
|------|--------|-----------|
| **user** | Own appointments | Profile page |
| **admin** | All data | Admin panel |
| **clinic** | Clinic appointments | Clinic dashboard |

---

## ✅ Testing Checklist

- [ ] Create a clinic user via admin panel
- [ ] Login as clinic user
- [ ] Verify redirect to clinic dashboard
- [ ] View appointments for clinic
- [ ] Confirm an appointment
- [ ] Cancel an appointment
- [ ] Verify clinic users can't see other clinics' appointments
- [ ] Verify appointment linking works when booking

---

## 🐛 Troubleshooting

### Clinic user can't see appointments
- Check if `clinic_id` is set in user record
- Verify appointments have `clinic_id` linked
- Check appointment booking links to correct clinic

### Can't create clinic user
- Ensure clinic exists first
- Verify clinic_id is valid
- Check email is unique

### Appointments not linked to clinic
- Verify clinic name matches exactly
- Check clinic exists in database
- Appointment booking should auto-link to clinic_id

---

## 📚 Related Files

- `backend/routes/clinic.js` - Clinic API routes
- `backend/models/Appointment.js` - Updated with clinic_id support
- `backend/models/User.js` - Updated with clinic_id support
- `backend/config/database.js` - Database schema updates
- `frontend/clinic-dashboard.html` - Clinic dashboard page
- `backend/scripts/create-clinic-user.js` - CLI script to create clinic users

---

**Status:** ✅ Complete and Ready to Use!

