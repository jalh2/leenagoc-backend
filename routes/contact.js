const express = require('express');
const router = express.Router();
const { 
  getAllContactMessages, 
  getContactMessageById, 
  createContactMessage, 
  markAsRead, 
  replyToMessage, 
  deleteContactMessage 
} = require('../controllers/contactController');


// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Private
router.get('/', getAllContactMessages);

// @route   GET /api/contact/:id
// @desc    Get contact message by ID
// @access  Private
router.get('/:id', getContactMessageById);

// @route   POST /api/contact
// @desc    Create contact message (from website form)
// @access  Public
router.post('/', createContactMessage);

// @route   PUT /api/contact/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   POST /api/contact/:id/reply
// @desc    Reply to contact message
// @access  Private
router.post('/:id/reply', replyToMessage);

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Private
router.delete('/:id', deleteContactMessage);

module.exports = router;
