const express = require('express');
const router = express.Router();
const { getContentByPage, getAllContent, upsertContent, deleteContent } = require('../controllers/contentController');


// @route   GET /api/content
// @desc    Get all content
// @access  Public
router.get('/', getAllContent);

// @route   GET /api/content/:page
// @desc    Get content by page
// @access  Public
router.get('/:page', getContentByPage);

// @route   POST /api/content
// @desc    Create or update content
// @access  Private
router.post('/', upsertContent);

// @route   DELETE /api/content/:page
// @desc    Delete content
// @access  Private
router.delete('/:page', deleteContent);

module.exports = router;
