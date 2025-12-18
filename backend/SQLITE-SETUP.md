# SQLite Database Setup - ClinicHub

Your backend now uses **SQLite** - a file-based database that requires no separate server! 🎉

## ✅ What Changed

- **Removed:** MongoDB/Mongoose
- **Added:** SQLite with `better-sqlite3`
- **Database file:** `data/clinichub.db` (created automatically)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install `better-sqlite3` instead of `mongoose`.

### 2. Create `.env` File

```env
PORT=3000
DB_PATH=data/clinichub.db
JWT_SECRET=your-secret-key-12345
```

**Note:** The database file will be created automatically in the `data/` folder.

### 3. Start the Server

```bash
npm run dev
```

The database and tables will be created automatically on first run!

## 📁 Database Structure

The database file is located at: `data/clinichub.db`

### Tables Created:

1. **users** - User accounts
   - id, name, email, password, phone, created_at

2. **clinics** - Clinic information
   - id, name, category, description, address, phone, email, image, rating, is_active, created_at

3. **appointments** - Appointment bookings
   - id, user_id, name, email, phone, area, clinic, department, date, message, status, created_at

## 🎯 Advantages of SQLite

✅ **No server setup** - Just a file  
✅ **Easy to backup** - Just copy the `.db` file  
✅ **Fast** - Perfect for small to medium apps  
✅ **Zero configuration** - Works out of the box  
✅ **Portable** - Database is a single file  

## 📝 Seed the Database

To add sample clinics:

```bash
node scripts/seed-clinics.js
```

## 🔍 View Your Database

### Option 1: SQLite Browser (GUI)
Download [DB Browser for SQLite](https://sqlitebrowser.org/)
- Open `data/clinichub.db`
- Browse tables and data

### Option 2: Command Line
```bash
# Install SQLite CLI (if not installed)
# Then:
sqlite3 data/clinichub.db

# In SQLite prompt:
.tables          # List all tables
SELECT * FROM users;  # View users
SELECT * FROM clinics;  # View clinics
.quit           # Exit
```

## 🔄 Migration from MongoDB

If you had MongoDB data, you'll need to:
1. Export data from MongoDB (if any)
2. Import into SQLite using the seed script or manual SQL

## 📊 Database Location

By default, the database is at:
```
data/clinichub.db
```

You can change this in `.env`:
```env
DB_PATH=/path/to/your/database.db
```

## 🛠️ Backup Database

Just copy the database file:
```bash
# Windows
copy data\clinichub.db backup\clinichub-backup.db

# Mac/Linux
cp data/clinichub.db backup/clinichub-backup.db
```

## ⚠️ Important Notes

- **File-based:** The database is a single file - easy to backup/move
- **No concurrent writes:** SQLite handles this automatically
- **Perfect for:** Small to medium applications
- **Not ideal for:** High-traffic applications with many concurrent writes

## 🆘 Troubleshooting

**Database file not created?**
- Make sure the `data/` folder exists (it's created automatically)
- Check file permissions
- Check `.env` DB_PATH is correct

**Permission errors?**
- Make sure the app has write permissions to the `data/` folder
- On Linux/Mac: `chmod 755 data/`

**Database locked?**
- Make sure only one instance of the server is running
- Close any database browser tools

---

**That's it!** Your SQLite database is ready to use! 🎉

