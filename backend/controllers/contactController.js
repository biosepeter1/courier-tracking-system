const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/emailService');
const { contactMessageReceivedEmail, adminReplyEmail } = require('../utils/emailTemplates');

// Create a new contact message (Public)
const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      userId: req.user ? req.user._id : null  // Set userId if logged in
    });

    await contactMessage.save();

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@courier.com';
      const emailContent = contactMessageReceivedEmail(contactMessage);
      
      await sendEmail({
        to: adminEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`📧 Contact message notification sent to admin`);
    } catch (emailError) {
      console.error('Failed to send contact message notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: {
        contactMessage
      }
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
};

// Get all contact messages (Admin only)
const getContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    let query = { isActive: true };
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') },
        { subject: new RegExp(req.query.search, 'i') },
        { message: new RegExp(req.query.search, 'i') }
      ];
    }

    const messages = await ContactMessage.find(query)
      .populate('userId', 'name email')
      .populate('replies.repliedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments(query);
    
    // Get counts by status
    const statusCounts = await ContactMessage.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        },
        statusCounts
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
};

// Get single contact message by ID (Admin only)
const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findById(id)
      .populate('userId', 'name email phone')
      .populate('replies.repliedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it's new
    if (message.status === 'new') {
      await message.markAsRead();
    }

    res.json({
      success: true,
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Get contact message by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching message'
    });
  }
};

// Reply to contact message (Admin only)
const replyToContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const message = await ContactMessage.findById(id)
      .populate('userId', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Add reply
    await message.addReply(reply, req.user._id);
    
    // Populate the reply
    await message.populate('replies.repliedBy', 'name email');

    // Send email to the person who contacted
    try {
      const emailContent = adminReplyEmail(message, reply, req.user.name);
      
      await sendEmail({
        to: message.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`📧 Reply email sent to ${message.email}`);
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Reply to contact message error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while sending reply'
    });
  }
};

// Update message status (Admin only)
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Update message status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    });
  }
};

// Delete/archive message (Admin only)
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { isActive: false, status: 'archived' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message archived successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while archiving message'
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  replyToContactMessage,
  updateMessageStatus,
  deleteContactMessage
};
