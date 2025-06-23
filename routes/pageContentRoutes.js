const express = require('express');
const PageContent = require('../models/PageContent');


const router = express.Router();

// GET page content (e.g., for 'hero', 'about')
// Publicly accessible
router.get('/:pageName', async (req, res) => {
  try {
    const pageContent = await PageContent.findOne({ page: req.params.pageName });
    if (!pageContent) {
      console.log(`Page content for ${req.params.pageName} not found.`);
      return res.status(404).json({ message: 'Page content not found' });
    }
    console.log(`Fetched page content for ${req.params.pageName}:`, pageContent);
    res.json(pageContent);
  } catch (error) {
    console.error(`Error fetching ${req.params.pageName} content:`, error);
    res.status(500).json({ message: 'Server error while fetching page content' });
  }
});

// PUT update page content (e.g., for 'hero')
// Protected: Admin only
router.put('/:pageName', async (req, res) => {
  const { pageName } = req.params;
  const { title, content, images } = req.body; // Expect 'images' array for slideshow

  try {
    let pageData = await PageContent.findOne({ page: pageName });

    if (!pageData) {
      // Option to create if not exists, or return error
      // For 'hero', it's likely pre-seeded or should exist
      return res.status(404).json({ message: `Content for page '${pageName}' not found.` });
    }

    if (title) pageData.title = title;
    
    // Handle Mixed type for content - expecting an object for about content
    if (content) {
      // If content is already an object, assign directly.
      if (typeof content === 'object') {
        pageData.content = content;
      } else {
        // If it's a string, attempt to parse it as JSON. If it fails, assign as is.
        try {
          pageData.content = JSON.parse(content);
        } catch (parseError) {
          pageData.content = content;
        }
      }
    }

    if (images && Array.isArray(images)) {
      // If new images (Base64 strings) are provided, update the array.
      pageData.images = images;
    }
    


    const updatedPageContent = await pageData.save();
    res.json(updatedPageContent);
  } catch (error) {
    console.error(`Error updating ${pageName} content:`, error);
    res.status(500).json({ message: 'Server error while updating page content' });
  }
});

module.exports = router;
