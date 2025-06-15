const express = require('express');
const router = express.Router();
const { 
  getAllTeamMembers, 
  getTeamMemberById, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  uploadTeamMemberImage,
  upload 
} = require('../controllers/teamController');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', getAllTeamMembers);

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', getTeamMemberById);

// @route   POST /api/team
// @desc    Create team member
// @access  Private
router.post('/', requireAuth, createTeamMember);

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private
router.put('/:id', requireAuth, updateTeamMember);

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private
router.delete('/:id', requireAuth, deleteTeamMember);

// @route   POST /api/team/:id/upload
// @desc    Upload team member image
// @access  Private
router.post('/:id/upload', requireAuth, upload.single('image'), uploadTeamMemberImage);

module.exports = router;
