# ClinicHub Database Schema

Complete database structure with all tables, columns, relationships, and indexes.

**Database File:** `backend/data/clinichub.db`  
**Database Type:** SQLite

---

## 📊 Tables Overview

| Table | Description | Records |
|-------|-------------|---------|
| `users` | User accounts (patients, admins, clinic staff) | - |
| `clinics` | Clinic directory information | - |
| `appointments` | Appointment bookings | - |
| `sqlite_sequence` | SQLite internal table (auto-increment tracking) | - |

---

## 1. 📋 `users` Table

**Purpose:** Stores all user accounts (patients, admins, clinic users)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user ID |
| `name` | TEXT | NOT NULL | User's full name |
| `email` | TEXT | NOT NULL, UNIQUE | User's email address (unique) |
| `password` | TEXT | NOT NULL | Hashed password (bcrypt) |
| `phone` | TEXT | NULL | User's phone number (optional) |
| `role` | TEXT | DEFAULT 'user' | User role: 'user', 'admin', or 'clinic' |
| `clinic_id` | INTEGER | NULL, FOREIGN KEY | Links clinic users to their clinic |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Foreign Keys:**
- `clinic_id` → `clinics(id)` ON DELETE SET NULL

**Indexes:**
- `idx_users_email` - Index on email (for fast login lookups)
- `idx_users_role` - Index on role (for role-based queries)
- `idx_users_clinic_id` - Index on clinic_id (for clinic user queries)

**Example Data:**
```sql
id | name              | email                    | role   | clinic_id
1  | Administrator     | admin@clinichub.com     | admin  | NULL
2  | John Doe          | john@example.com        | user   | NULL
3  | Clinic Manager    | clinic@arakmedical.com   | clinic | 1
```

---

## 2. 🏥 `clinics` Table

**Purpose:** Stores clinic directory information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique clinic ID |
| `name` | TEXT | NOT NULL, UNIQUE | Clinic name (unique) |
| `category` | TEXT | NOT NULL | Clinic category (e.g., "Eye Clinic", "Dental Clinic") |
| `description` | TEXT | NULL | Clinic description |
| `address` | TEXT | NULL | Clinic physical address |
| `phone` | TEXT | NULL | Clinic phone number |
| `email` | TEXT | NULL | Clinic email address |
| `image` | TEXT | NULL | Clinic image URL/path |
| `rating` | REAL | DEFAULT 0 | Clinic rating (0-5) |
| `is_active` | INTEGER | DEFAULT 1 | Active status (1 = active, 0 = inactive) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Clinic creation timestamp |

**Indexes:**
- `idx_clinics_category` - Index on category (for filtering)
- `idx_clinics_active` - Index on is_active (for active clinic queries)

**Example Data:**
```sql
id | name                    | category           | rating | is_active
1  | Arak Medical clinic     | Private Hospital   | 4.5    | 1
2  | German eye centre       | Eye Clinic         | 4.8    | 1
3  | Islam Dental clinic     | Dental Clinic      | 4.2    | 1
```

---

## 3. 📅 `appointments` Table

**Purpose:** Stores appointment bookings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique appointment ID |
| `user_id` | INTEGER | NULL, FOREIGN KEY | Links to user who booked (if logged in) |
| `clinic_id` | INTEGER | NULL, FOREIGN KEY | Links appointment to clinic |
| `name` | TEXT | NOT NULL | Patient name |
| `email` | TEXT | NOT NULL | Patient email |
| `phone` | TEXT | NOT NULL | Patient phone number |
| `area` | TEXT | NOT NULL | Patient area/location |
| `clinic` | TEXT | NOT NULL | Clinic name (text field) |
| `department` | TEXT | NOT NULL | Department/service type |
| `date` | TEXT | NOT NULL | Appointment date (ISO format) |
| `message` | TEXT | NULL | Additional message/notes |
| `status` | TEXT | DEFAULT 'pending' | Status: 'pending', 'confirmed', 'cancelled', 'completed' |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Booking creation timestamp |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE SET NULL
- `clinic_id` → `clinics(id)` ON DELETE SET NULL

**Indexes:**
- `idx_appointments_user_id` - Index on user_id (for user's appointments)
- `idx_appointments_clinic_id` - Index on clinic_id (for clinic's appointments)
- `idx_appointments_date` - Index on date (for date-based queries)

**Example Data:**
```sql
id | user_id | clinic_id | name      | clinic              | date       | status
1  | 2       | 1         | John Doe  | Arak Medical clinic | 2025-01-15 | pending
2  | NULL    | 2         | Jane Smith| German eye centre   | 2025-01-20 | confirmed
```

---

## 4. 🔗 Relationships

### Entity Relationship Diagram (Text)

```
users
  ├── clinic_id → clinics(id)
  └── id ← appointments(user_id)

clinics
  ├── id ← users(clinic_id)
  └── id ← appointments(clinic_id)

appointments
  ├── user_id → users(id)
  └── clinic_id → clinics(id)
```

### Relationship Details

1. **Users → Clinics** (Many-to-One)
   - Clinic users (`role='clinic'`) are linked to a clinic via `clinic_id`
   - Regular users and admins have `clinic_id = NULL`

2. **Users → Appointments** (One-to-Many)
   - A user can have multiple appointments
   - Appointments can exist without a user (guest bookings)

3. **Clinics → Appointments** (One-to-Many)
   - A clinic can have multiple appointments
   - Appointments are linked to clinics via `clinic_id`

---

## 📑 Indexes Summary

| Index Name | Table | Column(s) | Purpose |
|------------|-------|-----------|---------|
| `idx_users_email` | users | email | Fast email lookups for login |
| `idx_users_role` | users | role | Fast role-based queries |
| `idx_users_clinic_id` | users | clinic_id | Fast clinic user queries |
| `idx_appointments_user_id` | appointments | user_id | Fast user appointment queries |
| `idx_appointments_clinic_id` | appointments | clinic_id | Fast clinic appointment queries |
| `idx_appointments_date` | appointments | date | Fast date-based queries |
| `idx_clinics_category` | clinics | category | Fast category filtering |
| `idx_clinics_active` | clinics | is_active | Fast active clinic queries |

---

## 🔍 Common Queries

### Get all users
```sql
SELECT * FROM users;
```

### Get all clinics
```sql
SELECT * FROM clinics WHERE is_active = 1;
```

### Get user's appointments
```sql
SELECT * FROM appointments WHERE user_id = ?;
```

### Get clinic's appointments
```sql
SELECT * FROM appointments WHERE clinic_id = ?;
```

### Get clinic users
```sql
SELECT * FROM users WHERE role = 'clinic' AND clinic_id = ?;
```

### Get appointments with clinic details
```sql
SELECT a.*, c.name as clinic_name, c.category 
FROM appointments a
LEFT JOIN clinics c ON a.clinic_id = c.id
WHERE a.clinic_id = ?;
```

---

## 📝 Notes

1. **Password Storage:** Passwords are hashed using bcrypt (10 salt rounds)
2. **Timestamps:** All timestamps use SQLite's CURRENT_TIMESTAMP
3. **Status Values:** Appointment status can be: 'pending', 'confirmed', 'cancelled', 'completed'
4. **Role Values:** User role can be: 'user', 'admin', 'clinic'
5. **Active Status:** Clinic `is_active` uses INTEGER (1 = active, 0 = inactive)
6. **Foreign Keys:** Set to NULL on delete (ON DELETE SET NULL) to preserve data

---

## 🛠️ View Schema

To view the current database schema, run:
```bash
cd backend
node scripts/show-schema.js
```

---

**Last Updated:** 2025-01-XX

