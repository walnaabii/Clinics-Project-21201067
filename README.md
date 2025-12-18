# ClinicHub - Clinic Directory & Booking System

A full-stack web application for managing clinic directories and appointment bookings, built with Node.js, Express, SQLite, and vanilla JavaScript.

## 📁 Project Structure

```
Clinics Project/
├── frontend/              # Frontend files
│   ├── *.html            # All HTML pages
│   ├── assets/           # CSS, JS, images, vendor libraries
│   └── forms/            # Form handlers (legacy PHP files)
│
├── backend/              # Backend API
│   ├── server.js         # Express server
│   ├── package.json      # Dependencies
│   ├── config/           # Database configuration
│   ├── models/           # Data models (User, Appointment, Clinic)
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── scripts/         # Utility scripts (seed data)
│   └── data/            # SQLite database (created automatically)
│
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in backend folder:**
   ```env
   PORT=3000
   DB_PATH=data/clinichub.db
   JWT_SECRET=your-secret-key-12345
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Visit: http://localhost:3000
   - API: http://localhost:3000/api/health

## 📚 Documentation

- **Quick Start:** `backend/QUICK-START.md`
- **SQLite Setup:** `backend/SQLITE-SETUP.md`
- **Backend API:** `backend/README-BACKEND.md`
- **Setup Guide:** `backend/SETUP-GUIDE.md`

## 🎯 Features

- ✅ User authentication (register/login)
- ✅ Appointment booking system
- ✅ Clinic directory with categories
- ✅ Contact form
- ✅ SQLite database (file-based, no server needed)
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Responsive design

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6)
- Bootstrap 5
- Font Awesome
- Swiper.js, GLightbox, and other libraries

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT for authentication
- bcryptjs for password hashing

## 📝 Available Scripts

From the `backend/` folder:

```bash
npm start      # Start production server
npm run dev    # Start development server (with auto-reload)
```

**Seed database:**
```bash
node scripts/seed-clinics.js
```

## 🔧 Configuration

All configuration is in `backend/.env`:

```env
PORT=3000                    # Server port
DB_PATH=data/clinichub.db    # SQLite database path
JWT_SECRET=your-secret-key   # JWT secret (change this!)
```

## 📂 Folder Details

### Frontend (`frontend/`)
- All HTML pages (index, login, register, booking, etc.)
- Static assets (CSS, JavaScript, images)
- Vendor libraries (Bootstrap, Swiper, etc.)

### Backend (`backend/`)
- **server.js** - Main Express server
- **config/** - Database configuration
- **models/** - Data models (User, Appointment, Clinic)
- **routes/** - API endpoints
- **middleware/** - Authentication middleware
- **scripts/** - Utility scripts
- **data/** - SQLite database file (auto-created)

## 🌐 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user's appointments
- `GET /api/clinics` - Get all clinics
- `POST /api/contact` - Send contact message

See `backend/README-BACKEND.md` for complete API documentation.

## 🗄️ Database

SQLite database is stored at: `backend/data/clinichub.db`

**Tables:**
- `users` - User accounts
- `clinics` - Clinic information
- `appointments` - Appointment bookings

## 🚀 Deployment

1. Build/configure your environment
2. Set environment variables
3. Start the server: `npm start`
4. The server serves both API and frontend files

## 📞 Support

For issues or questions, check the documentation in the `backend/` folder.

## 📄 License

ISC

---

**Built with ❤️ by Zainab Salim Al-Nahdi**

