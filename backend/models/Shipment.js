const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Pending', 'Processing', 'Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'On Hold']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  _id: true
});

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: false, // Auto-generated in pre-save hook if not provided
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  sender: {
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      maxlength: [100, 'Sender name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Sender phone is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    address: {
      type: String,
      required: [true, 'Sender address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  receiver: {
    name: {
      type: String,
      required: [true, 'Receiver name is required'],
      trim: true,
      maxlength: [100, 'Receiver name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Receiver email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Receiver phone is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    address: {
      type: String,
      required: [true, 'Receiver address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    }
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true,
    maxlength: [200, 'Origin cannot exceed 200 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    maxlength: [200, 'Destination cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'On Hold'],
    default: 'Pending'
  },
  currentLocation: {
    type: String,
    trim: true,
    maxlength: [200, 'Current location cannot exceed 200 characters']
  },
  packageDetails: {
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    value: {
      type: Number,
      min: [0, 'Value cannot be negative']
    }
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  history: [historySchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ createdBy: 1 });
shipmentSchema.index({ 'receiver.email': 1 });
shipmentSchema.index({ createdAt: -1 });
shipmentSchema.index({ updatedAt: -1 });

// Generate tracking number before saving (if not provided)
shipmentSchema.pre('save', async function(next) {
  if (!this.trackingNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingNumber = `CT${timestamp.slice(-6)}${random}`;
  }
  
  // Update the updatedAt field
  this.updatedAt = Date.now();
  
  // Update status and currentLocation based on latest history entry
  if (this.history && this.history.length > 0) {
    const latestHistory = this.history[this.history.length - 1];
    this.status = latestHistory.status;
    this.currentLocation = latestHistory.location;
    
    // Set actual delivery date if status is Delivered
    if (latestHistory.status === 'Delivered' && !this.actualDelivery) {
      this.actualDelivery = latestHistory.updatedAt;
    }
  }
  
  next();
});

// Virtual for calculating delivery progress percentage
shipmentSchema.virtual('progressPercentage').get(function() {
  const statusOrder = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentIndex = statusOrder.indexOf(this.status);
  return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
});

// Virtual for getting the latest history entry
shipmentSchema.virtual('latestUpdate').get(function() {
  return this.history && this.history.length > 0 ? this.history[this.history.length - 1] : null;
});

// Method to add history entry
shipmentSchema.methods.addHistory = function(historyData) {
  this.history.push({
    ...historyData,
    updatedAt: new Date()
  });
};

// Method to check if shipment is delivered
shipmentSchema.methods.isDelivered = function() {
  return this.status === 'Delivered';
};

// Method to check if shipment is cancelled
shipmentSchema.methods.isCancelled = function() {
  return this.status === 'Cancelled';
};

// Transform JSON output
shipmentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Shipment', shipmentSchema);