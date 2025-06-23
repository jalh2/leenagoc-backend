require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const PageContent = require('../models/PageContent');

const MONGODB_URI = process.env.MONGODB_URI;

// Helper function to convert images to Base64
const convertImageToBase64 = (imageName) => {
  const imagePath = path.join(__dirname, '..', 'images', imageName);
  if (fs.existsSync(imagePath)) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const mimeType = `image/${path.extname(imageName).slice(1)}`;
      return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    } catch (readError) {
      console.error(`Error reading or converting ${imageName} to Base64:`, readError);
      return null;
    }
  } else {
    console.warn(`Image not found at: ${imagePath}.`);
    return null;
  }
};

const updateHeroContent = async () => {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');

    const heroImages = [
      convertImageToBase64('health_tourism_2.png'),
      convertImageToBase64('health_tourism_3.png'),
      convertImageToBase64('health_tourism_4.png'),
      convertImageToBase64('health_tourism_41.png'),
    ].filter(Boolean); // Filter out nulls if images weren't found

    const heroContentData = {
        page: 'hero',
        title: 'Welcome to Leena Group of Companies',
        content: {
            subtitle: 'Your Trusted Partner in Building Materials, Health Tourism & Logistics',
            description: 'We specialize in providing world-class healthcare services in Turkey, high-quality building materials, and reliable logistics solutions between Liberia and Turkey.',
            buttonText: 'Learn More',
            buttonLink: '/about'
        },
        images: heroImages,
    };

    // Delete any existing hero content to ensure a fresh entry
    await PageContent.deleteOne({ page: 'hero' });

    // Create a new PageContent document
    const newHeroContent = new PageContent(heroContentData);
    await newHeroContent.save();

    console.log('New hero content created successfully:');
    console.log(newHeroContent);

  } catch (error) {
    console.error('Error updating hero content:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

updateHeroContent();
