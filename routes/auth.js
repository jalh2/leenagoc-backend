const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Private (admin only)
router.post('/register', requireAuth, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', requireAuth, logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', requireAuth, getCurrentUser);

module.exports = router;
