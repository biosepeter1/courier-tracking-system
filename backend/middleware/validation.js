const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// User registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required'
  }),
  phone: Joi.string().max(20).optional(),
  address: Joi.string().max(500).optional(),
  role: Joi.string().valid('user', 'admin').optional()
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Shipment creation validation schema
const createShipmentSchema = Joi.object({
  trackingNumber: Joi.string().optional(), // Optional - auto-generated if not provided
  sender: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().max(20).required(),
    address: Joi.string().max(500).required(),
    email: Joi.string().email().optional()
  }).required(),
  receiver: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).required(),
    address: Joi.string().max(500).required()
  }).required(),
  origin: Joi.string().max(200).required(),
  destination: Joi.string().max(200).required(),
  packageDetails: Joi.object({
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object({
      length: Joi.number().min(0).optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional()
    }).optional(),
    description: Joi.string().max(500).optional(),
    value: Joi.number().min(0).optional()
  }).optional(),
  estimatedDelivery: Joi.date().min('now').optional(),
  priority: Joi.string().valid('Low', 'Normal', 'High', 'Urgent').optional()
}).options({ stripUnknown: true }); // Strip any unknown fields

// Shipment update validation schema
const updateShipmentSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Processing', 'Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'On Hold').required(),
  location: Joi.string().max(200).required(),
  note: Joi.string().max(500).optional()
});

// Tracking number validation schema
const trackingSchema = Joi.object({
  trackingNumber: Joi.string().required().messages({
    'any.required': 'Tracking number is required'
  })
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createShipmentSchema,
  updateShipmentSchema,
  trackingSchema
};