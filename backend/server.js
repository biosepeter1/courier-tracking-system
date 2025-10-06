require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');
const contactRoutes = require('./routes/contact');
const { authenticateSocket } = require('./middleware/socketAuth');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// CORS origin checker function
const corsOriginChecker = (origin, callback) => {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  
  // Get allowed origins from env
  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:3000'];
  
  // Check if origin matches allowed origins or is a Vercel preview URL
  const isAllowed = allowedOrigins.some(allowed => origin === allowed) ||
                    origin.endsWith('.vercel.app');
  
  if (isAllowed) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

// Socket.IO setup with dynamic CORS
const io = socketIo(server, {
  cors: {
    origin: corsOriginChecker,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Security middleware with custom configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:", "http://localhost:5000", "http://localhost:3000"],
    },
  },
}));

// CORS configuration with dynamic origin checker
app.use(cors({
  origin: corsOriginChecker,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static file serving for uploads with CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO connection handling
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join tracking room
  socket.on('join-tracking', (trackingNumber) => {
    if (trackingNumber) {
      socket.join(`tracking:${trackingNumber}`);
      console.log(`Socket ${socket.id} joined room: tracking:${trackingNumber}`);
    }
  });

  // Leave tracking room
  socket.on('leave-tracking', (trackingNumber) => {
    if (trackingNumber) {
      socket.leave(`tracking:${trackingNumber}`);
      console.log(`Socket ${socket.id} left room: tracking:${trackingNumber}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});