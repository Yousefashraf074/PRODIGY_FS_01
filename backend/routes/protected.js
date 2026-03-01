const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected route - accessible by authenticated users
router.get('/user-only', protect, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected user route',
    userId: req.userId,
  });
});

// Protected route - accessible only by admin
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'This is an admin-only route',
    user: req.user,
  });
});

// Protected route - accessible by admin and moderator
router.get('/moderator-only', protect, authorize('admin', 'moderator'), (req, res) => {
  res.json({
    success: true,
    message: 'This route is accessible to admin and moderators',
    user: req.user,
  });
});

module.exports = router;
