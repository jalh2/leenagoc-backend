const express = require('express');
const router = express.Router();
const contactInfoController = require('../controllers/contactInfoController');

// Get contact information
router.get('/', contactInfoController.getContactInfo);

// Update or create contact information
router.put('/', contactInfoController.updateContactInfo);

module.exports = router;
