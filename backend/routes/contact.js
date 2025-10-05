const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  replyToContactMessage,
  updateMessageStatus,
  deleteContactMessage
} = require('../controllers/contactController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public route - anyone can submit a contact message
router.post('/', createContactMessage);

// Protected routes - admin only
router.get('/', authenticateToken, requireAdmin, getContactMessages);
router.get('/:id', authenticateToken, requireAdmin, getContactMessageById);
router.post('/:id/reply', authenticateToken, requireAdmin, replyToContactMessage);
router.patch('/:id/status', authenticateToken, requireAdmin, updateMessageStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteContactMessage);

module.exports = router;
