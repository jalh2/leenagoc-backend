// Simple authentication middleware using sessions
// No need to import User model if we're not fetching from DB

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login first.'
    });
  }
  // Attach a minimal user object with just the _id from the session
  req.user = { _id: req.session.userId };
  next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin
};
