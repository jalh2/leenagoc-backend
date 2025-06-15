const mongoose = require('mongoose');

const ContactInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phones: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  workingHours: {
    type: String,
    trim: true,
  },
  mapUrl: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', ContactInfoSchema);
