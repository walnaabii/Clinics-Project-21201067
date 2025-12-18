# ClinicHub Backend Setup Guide

Complete guide to set up and run the Node.js + Express backend for ClinicHub.

## 📋 Prerequisites

Before you begin, make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - **Local MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
  - **MongoDB Atlas** (Cloud - Free) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

Open terminal in your project folder and run:
```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- nodemailer

### Step 2: Set Up Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   # Windows (PowerShell)
   New-Item .env

   # Mac/Linux
   touch .env
   ```

2. Copy this content into `.env`:
   ```env
   # Server Configuration
   PORT=3000

   # MongoDB Database
   # Option 1: Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/clinichub
   
   # Option 2: MongoDB Atlas (Cloud) - Replace with your connection string
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clinichub

   # JWT Secret Key (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

   # Email Configuration (Optional - for contact form)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@clinichub.com
   ```

3. **Important:** Change `JWT_SECRET` to a random string (you can use any random text)

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
# MongoDB should start automatically as a service
# Or run: net start MongoDB

# Mac (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
- No setup needed! Just use your connection string in `.env`

### Step 4: Start the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
📝 API available at http://localhost:3000/api
```

## 🧪 Test the API

Open your browser and visit:
- **Health Check:** http://localhost:3000/api/health
- **Homepage:** http://localhost:3000

You should see:
```json
{
  "status": "OK",
  "message": "ClinicHub API is running"
}
```

## 🔧 Troubleshooting

### Problem: "Cannot find module 'express'"
**Solution:** Run `npm install` again

### Problem: "MongoDB connection error"
**Solutions:**
1. Make sure MongoDB is running
2. Check your `MONGODB_URI` in `.env`
3. For Atlas: Check your IP is whitelisted and credentials are correct

### Problem: "Port 3000 already in use"
**Solution:** Change `PORT=3000` to another port (e.g., `PORT=3001`) in `.env`

### Problem: Frontend can't connect to API
**Solution:** 
1. Make sure backend is running on port 3000
2. Check `API_BASE_URL` in `assets/js/api.js` matches your backend URL
3. If using different port, update the URL

## 📧 Email Setup (Optional)

To enable email notifications for contact form:

1. **Gmail Setup:**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password
   - Use that password in `EMAIL_PASS`

2. **Other Email Providers:**
   - Update `EMAIL_HOST` and `EMAIL_PORT` in `.env`
   - Use your provider's SMTP settings

## 🎯 Next Steps

1. **Test Registration:**
   - Go to http://localhost:3000/register.html
   - Create an account
   - Check MongoDB to see the user

2. **Test Login:**
   - Go to http://localhost:3000/login.html
   - Login with your account

3. **Test Appointment Booking:**
   - Go to http://localhost:3000/Booking Appointments.html
   - Fill the form and submit

## 📁 Project Structure

```
Clinics Project/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── config/
│   └── database.js        # Database connection
├── models/
│   ├── User.js            # User model
│   ├── Appointment.js     # Appointment model
│   └── Clinic.js         # Clinic model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── appointments.js    # Appointment routes
│   ├── clinics.js        # Clinic routes
│   └── contact.js        # Contact form route
├── middleware/
│   └── auth.js           # Authentication middleware
└── assets/js/
    └── api.js            # Frontend API client
```

## 🔐 Security Notes

- **Never commit `.env` file** to Git (it's in `.gitignore`)
- Change `JWT_SECRET` to a strong random string
- In production, use HTTPS
- Set up proper CORS origins
- Use environment variables for all secrets

## 📚 API Documentation

See `README-BACKEND.md` for complete API documentation.

## 💡 Tips

- Use `npm run dev` during development (auto-reloads on changes)
- Check browser console for API errors
- Use MongoDB Compass to view your database
- All API endpoints are prefixed with `/api`

## 🆘 Need Help?

1. Check the error message in terminal
2. Verify MongoDB is running
3. Check `.env` file is correct
4. Make sure all dependencies are installed

---

**You're all set!** 🎉 Your backend is now running and ready to use.

