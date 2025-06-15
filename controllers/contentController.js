const PageContent = require('../models/PageContent');

// Get content by page
const getContentByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const content = await PageContent.findOne({ page, isActive: true });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found for this page'
      });
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all content
const getAllContent = async (req, res) => {
  try {
    const content = await PageContent.find({ isActive: true });

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create or update content
const upsertContent = async (req, res) => {
  try {
    const { page, title, content, image } = req.body;
    const userId = req.session?.userId;

    const updatedContent = await PageContent.findOneAndUpdate(
      { page },
      {
        page,
        title,
        content,
        image,
        lastUpdatedBy: userId
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: updatedContent
    });

  } catch (error) {
    console.error('Upsert content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { page } = req.params;

    const content = await PageContent.findOneAndUpdate(
      { page },
      { isActive: false },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getContentByPage,
  getAllContent,
  upsertContent,
  deleteContent
};
