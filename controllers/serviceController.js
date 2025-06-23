const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/services');
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

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found with this ID' });
    }
    // Optionally check for service.isActive if needed for admin views
    // if (!service.isActive) {
    //   return res.status(404).json({ success: false, message: 'Service is inactive' });
    // }
    res.json({ success: true, service });
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ success: false, message: 'Invalid service ID format' });
    }
    console.error('Get service by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get service by slug
const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug, isActive: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category, isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create service
const createService = async (req, res) => {
  try {
    console.log('DEBUG: createService - Request body:', req.body);
    const { title, shortDescription, fullDescription, category, features, images } = req.body; // Added images

    const serviceData = {
      title,
      shortDescription,
      fullDescription,
      category,
      features: features ? (typeof features === 'string' ? JSON.parse(features) : features) : []
    };

    if (images && Array.isArray(images)) {
      serviceData.images = images.map(img => ({ // Ensure structure is correct
        url: img.url, 
        alt: img.alt || title, 
        isPrimary: img.isPrimary || false 
      }));
      // Ensure only one primary image if multiple are provided
      let primaryFound = false;
      serviceData.images.forEach(img => {
        if (img.isPrimary) {
          if (primaryFound) img.isPrimary = false;
          else primaryFound = true;
        }
      });
      if (!primaryFound && serviceData.images.length > 0) {
        serviceData.images[0].isPrimary = true;
      }
    }

    const newService = new Service(serviceData);

    await newService.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully!',
      service: newService
    });

  } catch (error) {
    console.error('Create service error:', error);
    // Log the full error object for more details
    console.error('DEBUG: Full createService error object:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, fullDescription, category, features } = req.body; // Note: 'images' are not handled here directly to prevent accidental overwrite.

    const updateData = {
      title,
      shortDescription,
      fullDescription,
      category,
      features: features ? (typeof features === 'string' ? JSON.parse(features) : features) : []
    };

    const service = await Service.findByIdAndUpdate(
      id,
      updateData, // Only update specified fields, images managed by separate endpoints
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add a new image (Base64) to a service
const addServiceImage = async (req, res) => {
  try {
    const { id } = req.params; // Service ID
    const { imageData, alt, isPrimary } = req.body; // imageData is Base64

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // If this is primary image, set all others to false
    if (isPrimary === true || String(isPrimary).toLowerCase() === 'true') {
      service.images.forEach(img => img.isPrimary = false);
    }

    const newImage = {
      url: imageData, // Store Base64 string directly
      alt: alt || service.title,
      isPrimary: isPrimary === true || String(isPrimary).toLowerCase() === 'true'
    };
    service.images.push(newImage);

    await service.save(); // Save to commit changes including the new image with its _id

    // Find the newly added image to return it with its _id
    const addedImage = service.images[service.images.length - 1];

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      image: addedImage // Return the full image object with its new _id
    });

  } catch (error) {
    console.error('Upload service image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete an image from a service
const deleteServiceImage = async (req, res) => {
  try {
    const { serviceId, imageId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const imageExists = service.images.some(img => img._id.toString() === imageId);
    if (!imageExists) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in this service'
      });
    }

    service.images = service.images.filter(img => img._id.toString() !== imageId);
    
    // If the deleted image was primary, and there are other images, make the first one primary
    const primaryImageStillExists = service.images.some(img => img.isPrimary);
    if (!primaryImageStillExists && service.images.length > 0) {
      service.images[0].isPrimary = true;
    }

    await service.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      images: service.images // Return updated images array
    });

  } catch (error) {
    console.error('Delete service image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
};

// Set an image as primary for a service
const setPrimaryServiceImage = async (req, res) => {
  try {
    const { serviceId, imageId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    let imageFound = false;
    service.images.forEach(img => {
      if (img._id.toString() === imageId) {
        img.isPrimary = true;
        imageFound = true;
      } else {
        img.isPrimary = false;
      }
    });

    if (!imageFound) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in this service to set as primary'
      });
    }

    await service.save();

    res.json({
      success: true,
      message: 'Primary image updated successfully',
      images: service.images // Return updated images array
    });

  } catch (error) {
    console.error('Set primary service image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while setting primary image'
    });
  }
};

module.exports = {
  getAllServices,
  getServiceBySlug,
  getServiceById, // Added
  getServicesByCategory,
  createService,
  updateService,
  deleteService,
  addServiceImage, // Renamed from uploadServiceImage
  deleteServiceImage,
  setPrimaryServiceImage,
  upload // Keep multer's upload export in case it's used by other routes/controllers, review later if it can be removed from here.
};
