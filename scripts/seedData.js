const mongoose = require('mongoose');
const User = require('../models/User');
const PageContent = require('../models/PageContent');
const Service = require('../models/Service');
const ContactInfo = require('../models/ContactInfo');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await PageContent.deleteMany({});
    await Service.deleteMany({});
    await ContactInfo.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@leenagoc.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Convert default hero image to Base64
    const defaultHeroSourcePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'hero.png');
    let defaultHeroImageBase64 = null;

    if (fs.existsSync(defaultHeroSourcePath)) {
      try {
        const imageBuffer = fs.readFileSync(defaultHeroSourcePath);
        const mimeType = 'image/png'; // Assuming hero.png is always a PNG
        defaultHeroImageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        console.log('Default hero image converted to Base64 for seeding.');
      } catch (readError) {
        console.error('Error reading or converting default hero image to Base64:', readError);
      }
    } else {
      console.warn('Default hero image not found at:', defaultHeroSourcePath, 'Cannot seed with default image.');
    }


    // Create hero content
    const heroContent = new PageContent({
      page: 'hero',
      title: 'Welcome to Leena Group of Companies',
      content: {
        subtitle: 'Your Trusted Partner in Building Materials, Health Tourism & Logistics',
        description: 'We specialize in providing world-class healthcare services in Turkey, high-quality building materials, and reliable logistics solutions between Liberia and Turkey.',
        buttonText: 'Learn More',
        buttonLink: '/about'
      },
      image: defaultHeroImageBase64,
      lastUpdatedBy: adminUser._id
    });
    await heroContent.save();

    // Helper function to convert images to Base64
    const convertImageToBase64 = (imageName, subfolder = '') => {
      const imagePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', subfolder, imageName);
      if (fs.existsSync(imagePath)) {
        try {
          const imageBuffer = fs.readFileSync(imagePath);
          const mimeType = `image/${path.extname(imageName).slice(1)}`; // e.g., image/png
          return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        } catch (readError) {
          console.error(`Error reading or converting ${imageName} to Base64:`, readError);
          return null;
        }
      } else {
        console.warn(`Image not found at: ${imagePath}. Cannot seed this image.`);
        return null;
      }
    };

    // Prepare service images
    const healthTourismImageBase64 = convertImageToBase64('health-tourism.png', 'services');
    const buildingMaterialsImageBase64 = convertImageToBase64('building-materials.png', 'services');
    const logisticsImageBase64 = convertImageToBase64('logistics.png', 'services');

    // Create about content
    const aboutContent = new PageContent({
      page: 'about',
      title: 'About Leena Group of Companies',
      content: {
        vision: 'To become Liberia\'s most trusted and innovative leader in building materials, health tourism, and logistics, inspiring progress and delivering sustainable solutions that enrich lives and build a brighter future.',
        mission: 'To become a leader in providing building materials, health tourism services, and logistics solutions in Liberia, setting benchmarks for quality, innovation, and customer satisfaction while driving economic growth and sustainable development.',
        goal: 'To empower Liberia\'s growth by delivering superior building materials, advancing health tourism experiences, and ensuring seamless logistics solutions, with a dedication to innovation, excellence, and the well-being of our customers and communities.'
      },
      lastUpdatedBy: adminUser._id
    });
    await aboutContent.save();

    // Create contact content
    const contactContent = new PageContent({
      page: 'contact',
      title: 'Contact Us',
      content: {
        address: 'Jacob\'s Town, Japan Freeway, Paynesville, Liberia',
        email: 'leenagroupofcompanies@gmail.com',
        phones: ['+231770447334', '+231886510045'],
        workingHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
        description: 'Get in touch with us for all your building materials, health tourism, and logistics needs.',
        city: 'Monrovia',
        country: 'Liberia',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.290858176587!2d-10.79975768523756!3d6.300645695420959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf09f7f4d4e4e4e4e%3A0x123456789abcdef!2sMonrovia%2C%20Liberia!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus'
      },
      lastUpdatedBy: adminUser._id
    });
    await contactContent.save();

    // Create services
    const healthTourismService = new Service({
      title: 'Health Tourism',
      shortDescription: 'Access world-class healthcare services in Turkey with our comprehensive health tourism packages.',
      fullDescription: 'At Leena Group of Companies, we specialize in linking patients to world-class healthcare services in Turkey, a global leader in medical excellence. With a network of top hospitals and renowned medical professionals, we ensure that our clients receive the best possible treatments tailored to their needs. From initial consultations to post-treatment care, we manage every aspect of your health journey, providing access to cutting-edge medical procedures, advanced technology, and affordable care. Trust us to guide you towards a healthier future with the best healthcare that Turkey has to offer.',
      category: 'health-tourism',
      features: [
        'World-Class hospitals with accredited medical centers',
        'Experienced Doctors with international experience',
        'Affordable Care at competitive prices',
        'Convenient Location - Turkey\'s central location',
        'Complete care management from consultation to recovery'
      ],
      order: 1,
      images: healthTourismImageBase64 ? [{
        url: healthTourismImageBase64,
        alt: 'Health Tourism in Turkey',
        isPrimary: true
      }] : [],
      lastUpdatedBy: adminUser._id
    });
    await healthTourismService.save();

    const buildingMaterialsService = new Service({
      title: 'Building and Construction Materials',
      shortDescription: 'High-quality building materials for residential, commercial, and industrial construction projects.',
      fullDescription: 'We offer a comprehensive range of high-quality building materials to meet the diverse needs of our clients. From durable construction essentials to innovative materials for modern designs, we ensure that every product we provide meets stringent quality standards. Our services are tailored to support construction projects of all sizes, whether for residential, commercial, or industrial purposes. With a commitment to reliability and excellence, we partner with trusted manufacturers and suppliers to deliver materials that enhance structural integrity, efficiency, and aesthetic appeal. Let us be your trusted partner in building the foundation for success.',
      category: 'building-materials',
      features: [
        'Comprehensive range of construction materials',
        'High-quality standards and certifications',
        'Support for all project sizes',
        'Trusted manufacturer partnerships',
        'Enhanced structural integrity and efficiency'
      ],
      order: 2,
      images: buildingMaterialsImageBase64 ? [{
        url: buildingMaterialsImageBase64,
        alt: 'Building and Construction Materials',
        isPrimary: true
      }] : [],
      lastUpdatedBy: adminUser._id
    });
    await buildingMaterialsService.save();

    const logisticsService = new Service({
      title: 'Logistics Services',
      shortDescription: 'Reliable import and export logistics services between Liberia and Turkey.',
      fullDescription: 'We provide reliable and efficient logistics services to streamline the movement of goods across borders. Specializing in import and export between Liberia and Turkey, we ensure seamless transportation, timely deliveries, and end-to-end supply chain management. Our experienced team handles every aspect of logistics, including customs clearance, warehousing, and distribution, allowing our clients to focus on their core business operations. With a strong commitment to excellence, we utilize advanced technology and a robust network to deliver tailored solutions that meet your specific needs. Trust us to keep your business moving smoothly and efficiently.',
      category: 'logistics',
      features: [
        'Seamless cross-border transportation',
        'Complete customs clearance services',
        'Warehousing and distribution solutions',
        'Advanced tracking technology',
        'End-to-end supply chain management'
      ],
      order: 3,
      images: logisticsImageBase64 ? [{
        url: logisticsImageBase64,
        alt: 'Logistics Services',
        isPrimary: true
      }] : [],
      lastUpdatedBy: adminUser._id
    });
    await logisticsService.save();

    // Create ContactInfo
    const defaultContactInfo = new ContactInfo({
      address: 'Jacob\'s Town, Japan Freeway, Paynesville, Liberia',
      city: 'Monrovia',
      country: 'Liberia',
      phones: ['+231770447334', '+231886510045'],
      email: 'leenagroupofcompanies@gmail.com',
      workingHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.290858176587!2d-10.79975768523756!3d6.300645695420959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf09f7f4d4e4e4e4e%3A0x123456789abcdef!2sMonrovia%2C%20Liberia!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus',
      description: 'Get in touch with us for all your building materials, health tourism, and logistics needs.'
    });
    await defaultContactInfo.save();
    console.log('ContactInfo seed data created successfully');

    console.log('Seed data created successfully');
    console.log('Admin credentials: username: admin, password: admin123');
    
  } catch (error) {
    console.error('Seed data error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
