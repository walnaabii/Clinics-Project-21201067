# ClinicHub Backend API

Node.js + Express backend for ClinicHub clinic directory and booking system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your configuration:
   - MongoDB connection string
   - JWT secret key
   - Email credentials (optional, for contact form)

3. **Start MongoDB:**
   - **Local MongoDB:** Make sure MongoDB is running on your system
   - **MongoDB Atlas:** Use the connection string from your Atlas cluster

4. **Run the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

5. **Server will run on:** `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (create from .env.example)
├── config/
│   └── database.js        # Database connection
├── models/
│   ├── User.js           # User model
│   ├── Appointment.js    # Appointment model
│   └── Clinic.js         # Clinic model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── appointments.js   # Appointment routes
│   ├── clinics.js       # Clinic routes
│   └── contact.js       # Contact form route
└── middleware/
    └── auth.js          # Authentication middleware
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout (client-side token removal)

### Appointments

- `POST /api/appointments` - Create appointment
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "area": "Muscat",
    "clinic": "Arak Medical clinic",
    "department": "General Practitioner",
    "date": "2025-01-15",
    "message": "Optional message"
  }
  ```

- `GET /api/appointments` - Get user's appointments (requires token)
- `GET /api/appointments/:id` - Get single appointment (requires token)
- `PUT /api/appointments/:id` - Update appointment (requires token)
- `DELETE /api/appointments/:id` - Cancel appointment (requires token)

### Clinics

- `GET /api/clinics` - Get all clinics
- `GET /api/clinics?category=Eye Clinic` - Get clinics by category
- `GET /api/clinics/:id` - Get single clinic

### Contact

- `POST /api/contact` - Send contact form message
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question",
    "message": "Your message here",
    "phone": "1234567890"
  }
  ```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**How to use:**
1. Register or login to get a token
2. Include token in request headers:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## 🗄️ Database Models

### User
- name, email, password (hashed), phone, appointments[]

### Appointment
- user, name, email, phone, area, clinic, department, date, message, status

### Clinic
- name, category, description, address, phone, email, image, rating, isActive

## 📧 Email Configuration

To enable email notifications:
1. Get Gmail App Password (or use another SMTP service)
2. Add to `.env`:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@clinichub.com
   ```

## 🛠️ Development

- **Auto-reload:** Use `npm run dev` (requires nodemon)
- **Environment:** Development uses `.env` file
- **Database:** Uses MongoDB (local or Atlas)

## 📝 Notes

- Passwords are hashed using bcrypt
- JWT tokens expire in 30 days
- All dates are stored in UTC
- CORS is enabled for all origins (configure in production)

## 🚨 Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set up proper CORS origins
- [ ] Use MongoDB Atlas or secure database
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure email service
- [ ] Add rate limiting
- [ ] Set up monitoring/health checks

## 📞 Support

For issues or questions, check the main project README.

