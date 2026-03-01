const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

// Admin routes
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), authController.deleteUser);
router.put('/users/:id/role', protect, authorize('admin'), authController.updateUserRole);

module.exports = router;
