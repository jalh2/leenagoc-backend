const TeamMember = require('../models/TeamMember');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/team');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      teamMembers
    });

  } catch (error) {
    console.error('Get all team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get team member by ID
const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findOne({ _id: id, isActive: true });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      teamMember
    });

  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create team member
const createTeamMember = async (req, res) => {
  try {
    const { name, position, bio, email, phone, image } = req.body;

    // Build team member object
    const newMemberData = {
      name,
      position,
      bio,
      email,
      phone
    };

    // If an image was uploaded in this same request, persist its relative path
    if (image) {
      newMemberData.image = image;
    }

    const teamMember = new TeamMember(newMemberData);

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      teamMember
    });

  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, email, phone, image } = req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      {
        name,
        position,
        bio,
        email,
        phone,
        ...(image ? { image } : {})
      },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      message: 'Team member updated successfully',
      teamMember
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete team member
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });

  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload team member image
const uploadTeamMemberImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const imageUrl = `/uploads/team/${req.file.filename}`;
    teamMember.image = imageUrl;
    await teamMember.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl
    });

  } catch (error) {
    console.error('Upload team member image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberImage,
  upload
};
