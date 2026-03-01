const jwt = require('jsonwebtoken');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `User role '${user.role}' is not authorized to access this route` 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
};
