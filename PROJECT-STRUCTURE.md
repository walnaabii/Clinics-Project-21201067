# 📁 ClinicHub Project Structure

This document explains the organized folder structure of the ClinicHub project.

## 🗂️ Root Structure

```
Clinics Project/
├── frontend/          # All frontend files
├── backend/          # All backend files
├── README.md         # Main project README
├── .gitignore        # Git ignore rules
└── PROJECT-STRUCTURE.md  # This file
```

## 📂 Frontend Folder (`frontend/`)

Contains all client-side files:

```
frontend/
├── *.html                    # All HTML pages (23 files)
│   ├── index.html           # Homepage
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── contact.html         # Contact page
│   ├── Booking Appointments.html
│   └── [clinic pages]      # Individual clinic pages
│
├── assets/                   # Static assets
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   ├── api.js          # API client
│   │   └── main.js         # Main JavaScript
│   ├── img/                 # Images (100+ files)
│   └── vendor/              # Third-party libraries
│       ├── bootstrap/
│       ├── swiper/
│       ├── glightbox/
│       └── ...
│
└── forms/                   # Legacy form handlers
    ├── contact.php
    └── newsletter.php
```

## 📂 Backend Folder (`backend/`)

Contains all server-side files:

```
backend/
├── server.js                # Express server (main entry point)
├── package.json            # Dependencies
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
│
├── config/                 # Configuration
│   └── database.js         # SQLite database setup
│
├── models/                 # Data models
│   ├── User.js            # User model
│   ├── Appointment.js     # Appointment model
│   └── Clinic.js          # Clinic model
│
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── appointments.js    # Appointment routes
│   ├── clinics.js         # Clinic routes
│   └── contact.js         # Contact form route
│
├── middleware/             # Middleware
│   └── auth.js           # JWT authentication
│
├── scripts/               # Utility scripts
│   └── seed-clinics.js   # Database seeding
│
├── data/                  # SQLite database (auto-created)
│   └── clinichub.db      # Database file
│
└── [documentation files]   # README, guides, etc.
```

## 🚀 How to Run

### From Root Directory:

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=3000
   DB_PATH=data/clinichub.db
   JWT_SECRET=your-secret-key
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Access application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 📝 Important Notes

### File Paths

- **Frontend files** are served from `frontend/` folder
- **Backend API** runs from `backend/` folder
- **Database** is stored in `backend/data/` folder
- **Static assets** are in `frontend/assets/`

### Working Directory

- **Always run npm commands from `backend/` folder**
- **Server automatically serves frontend files**
- **API endpoints are at `/api/*`**

### Development Workflow

1. **Frontend changes:** Edit files in `frontend/`
2. **Backend changes:** Edit files in `backend/`
3. **Database:** Managed automatically in `backend/data/`
4. **Restart server:** After backend changes, restart with `npm run dev`

## 🔄 Migration Notes

This structure was organized from a flat structure:
- All HTML/CSS/JS moved to `frontend/`
- All server files moved to `backend/`
- Server updated to serve from `frontend/` folder
- All paths updated accordingly

## 📚 Documentation

- **Main README:** `README.md` (root)
- **Backend API:** `backend/README-BACKEND.md`
- **Quick Start:** `backend/QUICK-START.md`
- **SQLite Setup:** `backend/SQLITE-SETUP.md`

---

**This structure keeps frontend and backend clearly separated!** ✨

