const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  // Create hash using crypto
  const hash = crypto.createHash('sha256');
  hash.update(this.password);
  this.password = hash.digest('hex');
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  const hash = crypto.createHash('sha256');
  hash.update(candidatePassword);
  const hashedCandidate = hash.digest('hex');
  
  return this.password === hashedCandidate;
};

module.exports = mongoose.model('User', userSchema);
