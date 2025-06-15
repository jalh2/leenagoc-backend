const ContactInfo = require('../models/ContactInfo');

// Get contact information
exports.getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    if (!contactInfo) {
      return res.status(404).json({ success: false, message: 'Contact information not found' });
    }
    res.status(200).json({ success: true, content: contactInfo });
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update or create contact information
exports.updateContactInfo = async (req, res) => {
  try {
    const { address, city, country, phones, email, workingHours, mapUrl, description } = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (contactInfo) {
      // Update existing
      contactInfo.address = address;
      contactInfo.city = city;
      contactInfo.country = country;
      contactInfo.phones = phones;
      contactInfo.email = email;
      contactInfo.workingHours = workingHours;
      contactInfo.mapUrl = mapUrl;
      contactInfo.description = description;
      await contactInfo.save();
      res.status(200).json({ success: true, message: 'Contact information updated successfully', content: contactInfo });
    } else {
      // Create new
      contactInfo = new ContactInfo({
        address,
        city,
        country,
        phones,
        email,
        workingHours,
        mapUrl,
        description,
      });
      await contactInfo.save();
      res.status(201).json({ success: true, message: 'Contact information created successfully', content: contactInfo });
    }
  } catch (error) {
    console.error('Error updating/creating contact information:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
