const express = require('express');
console.log('DEBUG: backend/routes/services.js - Module loading');
const router = express.Router();
const { 
  getAllServices, 
  getServiceBySlug, 
  getServiceById, // Added
  getServicesByCategory, 
  createService, 
  updateService, 
  deleteService,
  addServiceImage, // Renamed from uploadServiceImage
  deleteServiceImage,
  setPrimaryServiceImage
  // 'upload' (multer instance) is likely no longer needed here if all images are Base64
  // We'll keep it for now and review if it's used by other parts of services or can be removed from controller exports too.
} = require('../controllers/serviceController');


// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', (req, res, next) => {
  console.log('DEBUG: GET /api/services - Route hit');
  getAllServices(req, res, next);
});

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get('/category/:category', getServicesByCategory);

// @route   GET /api/services/:slug
// @desc    Get service by slug
// @access  Public
// @route   GET /api/services/id/:id
// @desc    Get service by ID
// @access  Public 
router.get('/id/:id', getServiceById);

// @route   GET /api/services/:slug
// @desc    Get service by slug
// @access  Public
router.get('/:slug', (req, res, next) => {
  console.log(`DEBUG: GET /api/services/:slug - Route hit with slug: ${req.params.slug}`);
  getServiceBySlug(req, res, next);
});

// @route   POST /api/services
// @desc    Create service
// @access  Private
router.post('/', createService);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private
router.put('/:id', updateService);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private
router.delete('/:id', deleteService);

// @route   POST /api/services/:id/images
// @desc    Add a new image (Base64) to a service
// @access  Private (Admin)
router.post('/:id/images', addServiceImage); // Removed upload.single('image'), using addServiceImage

// @route   DELETE /api/services/:serviceId/images/:imageId
// @desc    Delete an image from a service
// @access  Private (Admin)
router.delete('/:serviceId/images/:imageId', deleteServiceImage);

// @route   PUT /api/services/:serviceId/images/:imageId/primary
// @desc    Set an image as primary for a service
// @access  Private (Admin)
router.put('/:serviceId/images/:imageId/primary', setPrimaryServiceImage);

module.exports = router;
