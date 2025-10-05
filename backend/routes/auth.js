const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const upload = require('../middleware/upload');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  listUsers,
  uploadProfileImage,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/upload-image', upload.single('profileImage'), uploadProfileImage);
router.post('/change-password', changePassword);
router.post('/logout', logout);

// Admin only routes
router.get('/users', requireAdmin, listUsers);

module.exports = router;
