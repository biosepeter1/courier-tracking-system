const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Socket.IO authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user || !user.isActive) {
      return next(new Error('Authentication error: Invalid token or user not found'));
    }

    // Attach user to socket
    socket.userId = user._id;
    socket.userRole = user.role;
    socket.user = user;
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Authentication error: Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new Error('Authentication error: Token expired'));
    }
    
    return next(new Error('Authentication error: Server error'));
  }
};

module.exports = {
  authenticateSocket
};