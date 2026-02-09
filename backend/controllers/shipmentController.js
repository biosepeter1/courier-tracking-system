const Shipment = require('../models/Shipment');
const { geocodeAddress } = require('../utils/geocoding');
const { sendEmail } = require('../utils/emailService');
const { shipmentCreatedEmail, shipmentStatusUpdateEmail } = require('../utils/emailTemplates');

// Create a new shipment (Admin only)
const createShipment = async (req, res) => {
  try {
    const shipmentData = {
      ...req.body,
      createdBy: req.user._id
    };

    const shipment = new Shipment(shipmentData);

    // Geocode the origin for initial location
    if (shipment.origin) {
      const originCoords = await geocodeAddress(shipment.origin);

      // Add initial history entry
      shipment.addHistory({
        status: 'Pending',
        location: shipment.origin,
        coordinates: originCoords,
        note: 'Shipment created',
        updatedBy: req.user._id
      });
    }

    await shipment.save();

    // Populate the createdBy field
    await shipment.populate('createdBy', 'name email');

    // Send email notifications
    try {
      // Email to sender
      const senderEmailContent = shipmentCreatedEmail(shipment, false);
      await sendEmail({
        to: shipment.sender.email,
        subject: senderEmailContent.subject,
        html: senderEmailContent.html,
        text: senderEmailContent.text
      });

      // Email to receiver
      const receiverEmailContent = shipmentCreatedEmail(shipment, false);
      await sendEmail({
        to: shipment.receiver.email,
        subject: receiverEmailContent.subject,
        html: receiverEmailContent.html,
        text: receiverEmailContent.text
      });

      console.log(`📧 Shipment creation emails sent for ${shipment.trackingNumber}`);
    } catch (emailError) {
      console.error('Failed to send shipment creation emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: {
        shipment
      }
    });
  } catch (error) {
    console.error('Create shipment error:', error);

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

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Tracking number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating shipment'
    });
  }
};

// Get all shipments (Admin) or user's shipments (User)
const getShipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user role and filters
    let query = { isActive: true };
    let userFilter = null;

    if (req.user.role === 'user') {
      // Users can only see shipments where they are the sender OR receiver
      userFilter = {
        $or: [
          { 'sender.email': req.user.email },
          { 'receiver.email': req.user.email }
        ]
      };
    }

    // Apply filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.trackingNumber) {
      query.trackingNumber = new RegExp(req.query.trackingNumber, 'i');
    }

    if (req.query.userId && req.user.role === 'admin') {
      query.createdBy = req.query.userId;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Merge user filter with other filters
    if (userFilter) {
      query = { $and: [query, userFilter] };
    }

    const shipments = await Shipment.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shipment.countDocuments(query);

    res.json({
      success: true,
      data: {
        shipments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shipments'
    });
  }
};

// Get single shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Build query - for non-admin users, check ownership
    let query;
    if (req.user.role === 'admin') {
      query = { _id: id, isActive: true };
    } else {
      // Non-admin users can only access their own shipments (as sender or receiver)
      query = {
        _id: id,
        isActive: true,
        $or: [
          { 'sender.email': req.user.email },
          { 'receiver.email': req.user.email }
        ]
      };
    }

    const shipment = await Shipment.findOne(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .populate('history.updatedBy', 'name email');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: {
        shipment
      }
    });
  } catch (error) {
    console.error('Get shipment by ID error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipment ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching shipment'
    });
  }
};

// Get shipment by tracking number (Public access)
const getShipmentByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findOne({
      trackingNumber: trackingNumber.toUpperCase(),
      isActive: true
    })
      .populate('createdBy', 'name')
      .populate('history.updatedBy', 'name')
      .select('-__v');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found with this tracking number'
      });
    }

    res.json({
      success: true,
      data: {
        shipment
      }
    });
  } catch (error) {
    console.error('Get shipment by tracking number error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shipment'
    });
  }
};

// Update shipment status and location (Admin only)
const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;

    const shipment = await Shipment.findById(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Geocode the new location
    const coordinates = await geocodeAddress(location);

    // Add new history entry
    const historyEntry = {
      status,
      location,
      coordinates,
      note: note || '',
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    shipment.addHistory(historyEntry);
    await shipment.save();

    // Populate the updated shipment
    await shipment.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'history.updatedBy', select: 'name email' }
    ]);

    // Send email notification to receiver only
    try {
      const oldStatus = shipment.history.length > 1 ? shipment.history[shipment.history.length - 2].status : 'New';
      const emailContent = shipmentStatusUpdateEmail(shipment, oldStatus);

      // Send to receiver only (person receiving the goods)
      await sendEmail({
        to: shipment.receiver.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      console.log(`📧 Status update email sent to receiver for ${shipment.trackingNumber}`);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    // Emit Socket.IO event
    if (req.io) {
      req.io.to(`tracking:${shipment.trackingNumber}`).emit('shipment:update', {
        trackingNumber: shipment.trackingNumber,
        shipment: shipment,
        checkpoint: historyEntry
      });

      console.log(`Socket event emitted for tracking:${shipment.trackingNumber}`);
    }

    res.json({
      success: true,
      message: 'Shipment updated successfully',
      data: {
        shipment,
        checkpoint: historyEntry
      }
    });
  } catch (error) {
    console.error('Update shipment error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipment ID'
      });
    }

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
      message: 'Server error while updating shipment'
    });
  }
};

// Update shipment details (Admin only)
const updateShipmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.trackingNumber;
    delete updateData.history;
    delete updateData.status;
    delete updateData.currentLocation;
    delete updateData.createdBy;

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      message: 'Shipment details updated successfully',
      data: {
        shipment
      }
    });
  } catch (error) {
    console.error('Update shipment details error:', error);

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
      message: 'Server error while updating shipment details'
    });
  }
};

// Delete/deactivate shipment (Admin only)
const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting shipment'
    });
  }
};

// Get shipment statistics (Admin only)
const getShipmentStats = async (req, res) => {
  try {
    const stats = await Shipment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalShipments = await Shipment.countDocuments({ isActive: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayShipments = await Shipment.countDocuments({
      isActive: true,
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalShipments,
        todayShipments
      }
    });
  } catch (error) {
    console.error('Get shipment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByTrackingNumber,
  updateShipment,
  updateShipmentDetails,
  deleteShipment,
  getShipmentStats
};