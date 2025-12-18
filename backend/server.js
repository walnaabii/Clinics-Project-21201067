const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize SQLite database (this creates tables if they don't exist)
const { db } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory (for HTML, CSS, JS, images)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/clinics', require('./routes/clinics'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clinic', require('./routes/clinic'));

// Database is already initialized in config/database.js
console.log('✅ SQLite database connected');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ClinicHub API is running' });
});

// Serve HTML files for all routes (SPA-like behavior)
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve the requested HTML file or index.html from frontend folder
  const fileName = req.path === '/' ? 'index.html' : req.path;
  const filePath = path.join(frontendPath, fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(frontendPath, '404.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});

