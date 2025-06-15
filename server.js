const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Reflects the request origin, effectively allowing any origin for development.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly list allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'], // Common headers
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200 // For compatibility with older browsers/clients
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for large JSON payloads (e.g., Base64 images)
app.use((req, res, next) => {
  console.log('Incoming request body:', req.body);
  next();
});
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increased limit for URL-encoded data

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'leena_group_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/leenagoc'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leenagoc', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
console.log('DEBUG: backend/server.js - About to load service routes');
app.use('/api/services', require('./routes/services'));
console.log('DEBUG: backend/server.js - Service routes supposedly loaded');
app.use('/api/team', require('./routes/team'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/contact-info', require('./routes/contactInfo'));
app.use('/api/pagecontent', require('./routes/pageContentRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Leena Group of Companies API Server' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
